// Аутентификация админки: пароль сверяется на сервере, дальше живёт
// подписанная HttpOnly-кука. Ни пароль, ни секрет на клиент не попадают.
import { createHmac, timingSafeEqual, createHash } from 'node:crypto';

const COOKIE = 'vz_admin';
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 дней

function secret() {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error('Не задана переменная окружения ADMIN_SECRET');
  return s;
}

function sign(payload) {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

// Сравнение фиксированной длины: не даёт подобрать подпись по времени ответа.
function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function checkPassword(input) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) throw new Error('Не задана переменная окружения ADMIN_PASSWORD');
  // Хешируем обе стороны — так длина всегда совпадает и timingSafeEqual
  // не спотыкается о разную длину ввода.
  const h = (v) => createHash('sha256').update(String(v)).digest('hex');
  return safeEqual(h(input), h(real));
}

export function issueCookie() {
  const exp = Date.now() + TTL_MS;
  const payload = `admin.${exp}`;
  const value = `${payload}.${sign(payload)}`;
  return `${COOKIE}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${Math.floor(TTL_MS / 1000)}`;
}

export function clearCookie() {
  return `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

// Любая осечка тут означает «не авторизован». Отдельно важно, что sign()
// падает без ADMIN_SECRET: до настройки переменных на Vercel это иначе
// выливалось бы в 500 со стектрейсом вместо честного «нужен вход».
export function isAuthed(req) {
  try {
    const raw = req.headers.cookie || '';
    const hit = raw.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE}=`));
    if (!hit) return false;
    const parts = hit.slice(COOKIE.length + 1).split('.');
    if (parts.length !== 3) return false;
    const [who, exp, mac] = parts;
    if (!safeEqual(mac, sign(`${who}.${exp}`))) return false;
    return Number(exp) > Date.now();
  } catch {
    return false;
  }
}

// Единая точка отказа для защищённых эндпоинтов.
export function requireAuth(req, res) {
  if (isAuthed(req)) return true;
  const configured = process.env.ADMIN_SECRET && process.env.ADMIN_PASSWORD;
  res.status(401).json({
    error: configured
      ? 'Нужна авторизация'
      : 'Админка не настроена: задайте ADMIN_PASSWORD и ADMIN_SECRET в переменных окружения',
  });
  return false;
}
