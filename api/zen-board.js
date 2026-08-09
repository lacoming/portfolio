// Таблица лидеров мини-игры «Космический дзен-сад» (sites/zen-garden).
//
//   GET  /api/zen-board?limit=50            - топ садовников
//   POST /api/zen-board {action:'claim'}    - забронировать ник, встать в топ с нулём
//   POST /api/zen-board {action:'score'}    - обновить счёт уже забронированного ника
//
// Открытый эндпоинт без авторизации: игрок опознаётся случайным player_id из
// своего localStorage. Это игрушка на витрине, а не рейтинг с призами — от
// подделки счёта через консоль здесь не защищаемся, но чужой ник занять нельзя
// и мат в общий топ не попадает.
import { db, ensureZenSchema } from './_db.js';
import { clientIp, sameOrigin, visitorId } from './_client.js';
import { validateNick } from './_profanity.js';

const RANKS = new Set([
  'common', 'uncommon', 'rare', 'epic', 'legendary', 'cosmic', 'unicorn',
]);

// player_id генерирует crypto.randomUUID() на клиенте. Принимаем чуть шире,
// чтобы не сломать тех, у кого в localStorage лежит id из прошлых версий.
const isPlayerId = (v) => typeof v === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(v);

const clampInt = (v, max) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(max, Math.round(n)));
};

// player_id наружу не отдаём. Он здесь и ключ владения записью: знающий чужой
// id мог бы переписать чужой счёт и переименовать чужую строку. Клиенту он не
// нужен — свою строку игрок находит по нику, а ник в таблице уникален.
async function readBoard(limit) {
  const sql = db();
  const rows = await sql`
    SELECT nickname, score, harvests, best_rank
      FROM zen_players
     ORDER BY score DESC, harvests DESC, created_at ASC
     LIMIT ${limit}`;
  // score в базе BIGINT — драйвер отдаёт его строкой, а на клиенте это число.
  return rows.map((r) => ({
    nickname:  r.nickname,
    score:     Number(r.score),
    harvests:  Number(r.harvests),
    best_rank: r.best_rank,
  }));
}

// Сколько ников можно забронировать с одного адреса в час. Бронь — единственное
// действие, создающее строки, поэтому именно она и ограничена: без этого скрипт
// набивает таблицу мусором и вытесняет живых игроков из топа.
const CLAIMS_PER_HOUR = 5;

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Только GET и POST' });
  }
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Чужой источник' });

  try {
    await ensureZenSchema();
  } catch (e) {
    console.error('zen-board schema:', e.message);
    return res.status(503).json({ error: 'База недоступна' });
  }

  const limit = Math.max(1, Math.min(100, Number(req.query?.limit) || 50));

  if (req.method === 'GET') {
    try {
      return res.status(200).json({ board: await readBoard(limit) });
    } catch (e) {
      console.error('zen-board get:', e.message);
      return res.status(503).json({ error: 'База недоступна' });
    }
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Пустое тело' });
  if (!isPlayerId(body.playerId)) return res.status(400).json({ error: 'Некорректный playerId' });

  const sql = db();

  // ── Бронь ника ────────────────────────────────────────────────────────────
  // Игрок попадает в общий топ сразу при вводе имени, с нулём: имя занято,
  // место в таблице есть, урожай можно собирать потом.
  if (body.action === 'claim') {
    const check = validateNick(body.nick);
    if (!check.ok) return res.status(200).json({ ok: false, reason: check.reason });

    const ipHash = visitorId(req, clientIp(req));

    try {
      // Переименование своей записи новых строк не создаёт — лимит только на них.
      const mine = await sql`SELECT 1 FROM zen_players WHERE player_id = ${body.playerId}`;
      if (mine.length === 0) {
        const recent = await sql`
          SELECT count(*)::int AS n FROM zen_players
           WHERE ip_hash = ${ipHash} AND created_at > now() - interval '1 hour'`;
        if ((recent[0]?.n ?? 0) >= CLAIMS_PER_HOUR) {
          return res.status(429).json({ ok: false, reason: 'rate' });
        }
      }

      await sql`
        INSERT INTO zen_players (player_id, nickname, nick_key, ip_hash)
        VALUES (${body.playerId}, ${check.nick}, ${check.key}, ${ipHash})
        ON CONFLICT (player_id) DO UPDATE
          SET nickname = EXCLUDED.nickname,
              nick_key = EXCLUDED.nick_key,
              updated_at = now()`;
    } catch (e) {
      // 23505 — уникальный индекс по nick_key: ник уже забронирован другим.
      if (e?.code === '23505') return res.status(200).json({ ok: false, reason: 'taken' });
      console.error('zen-board claim:', e.message);
      return res.status(503).json({ error: 'База недоступна' });
    }

    try {
      return res.status(200).json({ ok: true, nick: check.nick, board: await readBoard(limit) });
    } catch {
      return res.status(200).json({ ok: true, nick: check.nick });
    }
  }

  // ── Обновление счёта ──────────────────────────────────────────────────────
  if (body.action === 'score') {
    const score    = clampInt(body.score, 1e12);
    const harvests = clampInt(body.harvests, 1e7);
    const bestRank = RANKS.has(body.bestRank) ? body.bestRank : 'common';

    try {
      // Именно UPDATE, а не upsert: счёт без забронированного ника не нужен —
      // иначе в топе заводились бы безымянные строки.
      const done = await sql`
        UPDATE zen_players
           SET score = ${score}, harvests = ${harvests},
               best_rank = ${bestRank}, updated_at = now()
         WHERE player_id = ${body.playerId}
        RETURNING player_id`;
      if (done.length === 0) return res.status(200).json({ ok: false, reason: 'no-nick' });
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('zen-board score:', e.message);
      return res.status(503).json({ error: 'База недоступна' });
    }
  }

  return res.status(400).json({ error: 'Неизвестное действие' });
}
