// Заявки для админки: список и отметка «обработана». Закрыт подписанной кукой,
// как и статистика: в таблице лежат имена и контакты живых людей.
import { db, ensureLeadsSchema } from './_db.js';
import { requireAuth } from './_auth.js';

const STATUSES = new Set(['new', 'done']);

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  try {
    await ensureLeadsSchema();
    const sql = db();

    if (req.method === 'GET') {
      const limit = Math.max(1, Math.min(500, Number(req.query.limit) || 100));
      const rows = await sql`
        SELECT id, ts, name, channel, contact, task, status, notified,
               path, referrer, utm_source, utm_medium, utm_campaign,
               country, city, device, browser, os
        FROM leads ORDER BY ts DESC LIMIT ${limit}`;
      const [{ n }] = await sql`SELECT count(*)::int AS n FROM leads WHERE status = 'new'`;
      return res.status(200).json({ leads: rows, newCount: n });
    }

    if (req.method === 'PATCH') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = null; }
      }
      const id = Number(body && body.id);
      const status = String((body && body.status) || '');
      if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Нет id заявки' });
      if (!STATUSES.has(status)) return res.status(400).json({ error: 'Неизвестный статус' });
      await sql`UPDATE leads SET status = ${status} WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, PATCH');
    return res.status(405).json({ error: 'Метод не поддерживается' });
  } catch (e) {
    // Наружу текст ошибки базы не отдаём даже авторизованному: подробности —
    // в логах Vercel, где им и место.
    console.error('leads:', e.message);
    return res.status(500).json({ error: 'Не удалось обратиться к базе заявок' });
  }
}
