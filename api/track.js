// Приём событий с витрины. Открытый эндпоинт: пишет только то, что описано
// в белом списке TYPES, всё остальное молча отбрасывает.
import { createHash } from 'node:crypto';
import { db, ensureSchema } from './_db.js';

const TYPES = new Set([
  'pageview',       // загрузка страницы
  'project_open',   // клик по окну барабана или карточке в гриде
  'modal_time',     // сколько секунд смотрели сайт в модалке
  'external_open',  // «в новой вкладке ↗»
  'contact_click',  // telegram / email / github
  'cta_click',      // «Обсудить проект», кнопки в хиро
  'lang_switch',    // RU / EN
  'scroll',         // докрутка до 25 / 50 / 75 / 100 %
  'section_view',   // секция появилась на экране
  'session_end',    // визит закончился, value — секунды на странице
]);

const str = (v, max) => (v == null || v === '' ? null : String(v).slice(0, max));

function parseUA(ua = '') {
  const s = ua.toLowerCase();
  const tablet = /ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s);
  const mobile = /mobi|iphone|ipod|android|blackberry|windows phone/.test(s);
  const device = tablet ? 'tablet' : mobile ? 'mobile' : 'desktop';

  let browser = 'прочие';
  if (/edg\//.test(s)) browser = 'Edge';
  else if (/yabrowser/.test(s)) browser = 'Yandex';
  else if (/opr\/|opera/.test(s)) browser = 'Opera';
  else if (/firefox/.test(s)) browser = 'Firefox';
  else if (/chrome|crios/.test(s)) browser = 'Chrome';
  else if (/safari/.test(s)) browser = 'Safari';

  let os = 'прочие';
  if (/windows/.test(s)) os = 'Windows';
  else if (/iphone|ipad|ipod/.test(s)) os = 'iOS';
  else if (/mac os x/.test(s)) os = 'macOS';
  else if (/android/.test(s)) os = 'Android';
  else if (/linux/.test(s)) os = 'Linux';

  return { device, browser, os };
}

// Идентификатор посетителя — соль + IP + UA + дата, прогнанные через SHA-256.
// Сырой IP в базу не попадает, а хеш сам протухает через сутки: сопоставить
// посетителя с человеком по такой базе нельзя.
function visitorId(req, ip) {
  const salt = process.env.ADMIN_SECRET || 'vz';
  const day = new Date().toISOString().slice(0, 10);
  return createHash('sha256')
    .update(`${salt}|${ip}|${req.headers['user-agent'] || ''}|${day}`)
    .digest('hex')
    .slice(0, 32);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Только POST' });
  }

  // Считаем события только со своей же страницы — отсекает случайный внешний шум.
  const origin = req.headers.origin || req.headers.referer || '';
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  if (origin && host && !origin.includes(host)) {
    return res.status(204).end();
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== 'object') return res.status(204).end();

  const type = str(body.t, 32);
  if (!type || !TYPES.has(type)) return res.status(204).end();

  const sessionId = str(body.s, 64);
  if (!sessionId) return res.status(204).end();

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || '0.0.0.0';
  const { device, browser, os } = parseUA(req.headers['user-agent'] || '');
  const utm = body.q && typeof body.q === 'object' ? body.q : {};

  let value = null;
  if (body.v != null && Number.isFinite(Number(body.v))) {
    // Верхняя граница: сутки в секундах. Спасает от мусорных значений,
    // если вкладка провисела в фоне неделю.
    value = Math.max(0, Math.min(86400, Math.round(Number(body.v))));
  }

  try {
    await ensureSchema();
    const sql = db();
    await sql`
      INSERT INTO events
        (session_id, visitor_id, type, target, context, value, path, referrer,
         utm_source, utm_medium, utm_campaign, country, city, device, browser, os, lang)
      VALUES
        (${sessionId}, ${visitorId(req, ip)}, ${type}, ${str(body.k, 64)}, ${str(body.c, 32)},
         ${value}, ${str(body.p, 200)}, ${str(body.r, 300)},
         ${str(utm.source, 100)}, ${str(utm.medium, 100)}, ${str(utm.campaign, 100)},
         ${str(req.headers['x-vercel-ip-country'], 8)},
         ${str(decodeURIComponent(req.headers['x-vercel-ip-city'] || ''), 100)},
         ${device}, ${browser}, ${os}, ${str(body.l, 8)})`;
    return res.status(204).end();
  } catch (e) {
    // Аналитика не имеет права ронять страницу: логируем и отвечаем «принято».
    console.error('track:', e.message);
    return res.status(204).end();
  }
}
