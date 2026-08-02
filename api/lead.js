// Приём заявок с формы обратной связи. Открытый эндпоинт, поэтому всё, что
// приходит, проверяется здесь: чужие поля игнорируются, длины режутся, контакт
// сверяется с выбранным каналом связи.
//
// Заявка сначала ложится в базу и только потом уходит в Телеграм: уведомление —
// удобство, а потеря заявки — потеря денег. Если Телеграм не настроен или не
// ответил, человек всё равно видит «отправлено», а заявка лежит в админке.
import { db, ensureLeadsSchema } from './_db.js';
import { clientIp, parseUA, sameOrigin, visitorId } from './_client.js';

const CHANNELS = {
  phone: 'Телефон',
  telegram: 'Telegram',
  vk: 'VK',
  email: 'Почта',
};

// Не больше стольких заявок с одного обезличенного адреса за час. Порог с запасом:
// живой человек, который передумал и написал второй раз, в него не упирается.
const RATE_LIMIT_PER_HOUR = 5;

const str = (v, max) => (v == null ? '' : String(v).trim().slice(0, max));

// Проверка контакта под выбранный канал. Намеренно мягкая: задача — отсечь
// мусор и опечатки, а не спорить с человеком о формате его же телефона.
function contactLooksValid(channel, contact) {
  const v = contact.trim();
  if (channel === 'phone') {
    const digits = v.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  }
  if (channel === 'email') return /^[^\s@]+@[^\s@]+\.[a-zа-я]{2,}$/i.test(v);
  // Ссылочные варианты заякорены целиком: без ^…$ проверку проходила любая
  // строка, где ссылка просто встречается, — вместе с приписанным к ней мусором.
  if (channel === 'telegram') return /^@?[a-z0-9_]{4,32}$/i.test(v) || /^(https?:\/\/)?t\.me\/[a-z0-9_]{4,32}\/?$/i.test(v);
  if (channel === 'vk') return /^@?[a-z0-9_.]{3,64}$/i.test(v) || /^(https?:\/\/)?vk\.com\/[a-z0-9_.]{3,64}\/?$/i.test(v);
  return false;
}

const escapeHtml = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

// Уведомление в Телеграм. Токен и чат берутся из переменных окружения Vercel;
// если их нет — молча пропускаем, эндпоинт от этого не ломается.
async function notifyTelegram(lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return false;

  const lines = [
    '<b>Заявка с витрины</b>',
    `Имя: ${escapeHtml(lead.name)}`,
    `Связь: ${escapeHtml(CHANNELS[lead.channel])} — ${escapeHtml(lead.contact)}`,
    '',
    escapeHtml(lead.task),
  ];
  if (lead.utm_source) lines.push('', `utm: ${escapeHtml([lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(' / '))}`);

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chat,
        text: lines.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    if (!r.ok) throw new Error(`telegram ${r.status}`);
    return true;
  } catch (e) {
    console.error('lead → telegram:', e.message);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Только POST' });
  }
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Чужой источник запроса' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Пустая заявка' });

  // Ловушка для ботов: поле спрятано от человека, заполнить его может только
  // автозаполнялка робота. Отвечаем как при успехе, чтобы не подсказывать.
  if (str(body.company, 100)) return res.status(200).json({ ok: true });

  const name = str(body.name, 80);
  const channel = str(body.channel, 16).toLowerCase();
  const contact = str(body.contact, 120);
  const task = str(body.task, 4000);

  if (!name) return res.status(400).json({ error: 'Не заполнено имя' });
  if (!CHANNELS[channel]) return res.status(400).json({ error: 'Неизвестный способ связи' });
  if (!contact) return res.status(400).json({ error: 'Не заполнен контакт' });
  if (!contactLooksValid(channel, contact)) {
    return res.status(400).json({ error: `Контакт не похож на «${CHANNELS[channel]}» — проверьте` });
  }
  if (task.length < 10) return res.status(400).json({ error: 'Опишите задачу хотя бы парой фраз' });
  if (body.consent !== true) return res.status(400).json({ error: 'Нужно согласие на обработку данных' });

  const ip = clientIp(req);
  const ipHash = visitorId(req, ip);
  const { device, browser, os } = parseUA(req.headers['user-agent'] || '');
  const utm = body.utm && typeof body.utm === 'object' ? body.utm : {};
  const nullable = (v, max) => (str(v, max) || null);

  try {
    await ensureLeadsSchema();
    const sql = db();

    const [{ recent }] = await sql`
      SELECT count(*)::int AS recent FROM leads
      WHERE ip_hash = ${ipHash} AND ts > now() - interval '1 hour'`;
    if (recent >= RATE_LIMIT_PER_HOUR) {
      return res.status(429).json({ error: 'Заявка уже отправлена — отвечу в ближайшее время' });
    }

    const [row] = await sql`
      INSERT INTO leads
        (name, channel, contact, task, consent, session_id, ip_hash, path, referrer,
         utm_source, utm_medium, utm_campaign, country, city, device, browser, os, lang)
      VALUES
        (${name}, ${channel}, ${contact}, ${task}, true, ${nullable(body.session, 64)}, ${ipHash},
         ${nullable(body.path, 200)}, ${nullable(body.referrer, 300)},
         ${nullable(utm.source, 100)}, ${nullable(utm.medium, 100)}, ${nullable(utm.campaign, 100)},
         ${nullable(req.headers['x-vercel-ip-country'], 8)},
         ${nullable(decodeURIComponent(req.headers['x-vercel-ip-city'] || ''), 100)},
         ${device}, ${browser}, ${os}, ${nullable(body.lang, 8)})
      RETURNING id`;

    const notified = await notifyTelegram({
      name, channel, contact, task,
      utm_source: utm.source, utm_medium: utm.medium, utm_campaign: utm.campaign,
    });
    if (notified) {
      await sql`UPDATE leads SET notified = true WHERE id = ${row.id}`;
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('lead:', e.message);
    return res.status(500).json({ error: 'Не удалось сохранить заявку. Напишите в Telegram — отвечу сразу' });
  }
}
