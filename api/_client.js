// Разбор клиента запроса: устройство, браузер, ОС и обезличенный идентификатор.
// Общий модуль для аналитики (track.js) и формы заявок (lead.js) — раньше это
// жило внутри track.js, но заявке нужны те же данные.
import { createHash, randomBytes } from 'node:crypto';

export function parseUA(ua = '') {
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

// x-real-ip проставляет сама платформа, и подделать его снаружи нельзя.
// x-forwarded-for оставлен запасным вариантом для локального запуска: его первый
// элемент клиент волен прислать любой, поэтому на него нельзя опираться там,
// где IP держит ограничение частоты.
export function clientIp(req) {
  const real = String(req.headers['x-real-ip'] || '').trim();
  if (real) return real;
  return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || '0.0.0.0';
}

// Запасная соль на случай, когда ADMIN_SECRET не задан. Случайная и своя у
// каждого инстанса: хеши перестают быть сопоставимыми между инстансами, зато
// не превращаются в предсказуемые — по известному IP и UA их не подобрать.
const FALLBACK_SALT = randomBytes(24).toString('hex');

// Идентификатор посетителя — соль + IP + UA + дата, прогнанные через SHA-256.
// Сырой IP в базу не попадает, а хеш сам протухает через сутки: сопоставить
// посетителя с человеком по такой базе нельзя.
export function visitorId(req, ip) {
  const salt = process.env.ADMIN_SECRET || FALLBACK_SALT;
  const day = new Date().toISOString().slice(0, 10);
  return createHash('sha256')
    .update(`${salt}|${ip}|${req.headers['user-agent'] || ''}|${day}`)
    .digest('hex')
    .slice(0, 32);
}

// Запрос со своей же страницы? Отсекает случайный внешний шум и чужие формы.
export function sameOrigin(req) {
  const origin = req.headers.origin || req.headers.referer || '';
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  if (!origin || !host) return true; // заголовков нет — судить не по чему, пропускаем
  return origin.includes(host);
}
