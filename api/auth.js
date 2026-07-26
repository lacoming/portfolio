// Вход и выход из админки.
//   POST   { password }  → ставит подписанную куку
//   GET                  → сообщает, авторизован ли текущий браузер
//   DELETE               → гасит куку
import { checkPassword, issueCookie, clearCookie, isAuthed } from './_auth.js';

// Простой тормоз против перебора: помнит неудачные попытки в памяти
// инстанса. Не абсолютная защита (инстансов может быть несколько),
// но перебор по словарю с одной машины делает бессмысленным.
const fails = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 8;

function tooManyFails(ip) {
  const rec = fails.get(ip);
  if (!rec) return false;
  if (Date.now() - rec.first > WINDOW_MS) { fails.delete(ip); return false; }
  return rec.n >= MAX_FAILS;
}

function noteFail(ip) {
  const rec = fails.get(ip);
  if (!rec || Date.now() - rec.first > WINDOW_MS) fails.set(ip, { n: 1, first: Date.now() });
  else rec.n += 1;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ authed: isAuthed(req) });
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearCookie());
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'local';
  if (tooManyFails(ip)) {
    return res.status(429).json({ error: 'Слишком много попыток. Подождите 15 минут.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  const password = body && body.password;
  if (!password) return res.status(400).json({ error: 'Введите пароль' });

  try {
    if (!checkPassword(password)) {
      noteFail(ip);
      return res.status(401).json({ error: 'Неверный пароль' });
    }
  } catch (e) {
    // Сюда попадаем, если на Vercel не заданы ADMIN_PASSWORD / ADMIN_SECRET.
    console.error('auth:', e.message);
    return res.status(500).json({ error: 'Админка не настроена: ' + e.message });
  }

  fails.delete(ip);
  res.setHeader('Set-Cookie', issueCookie());
  return res.status(200).json({ ok: true });
}
