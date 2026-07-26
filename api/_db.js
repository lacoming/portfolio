// Подключение к Postgres (Neon) и схема таблицы событий.
// Файл начинается с подчёркивания — Vercel не превращает такие файлы в роуты,
// это просто общий модуль для функций из /api.
import { neon } from '@neondatabase/serverless';

let _sql = null;

// Интеграция Neon в Vercel кладёт строку подключения в DATABASE_URL,
// старая интеграция Vercel Postgres — в POSTGRES_URL. Принимаем обе.
export function db() {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('Не задана переменная окружения DATABASE_URL');
  _sql = neon(url);
  return _sql;
}

// Схема создаётся лениво один раз на холодный старт: не нужно отдельной
// миграции и деплой не может разъехаться с базой.
let _schema = null;

export function ensureSchema() {
  if (_schema) return _schema;
  _schema = (async () => {
    const sql = db();
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id          BIGSERIAL PRIMARY KEY,
        ts          TIMESTAMPTZ NOT NULL DEFAULT now(),
        session_id  TEXT NOT NULL,
        visitor_id  TEXT NOT NULL,
        type        TEXT NOT NULL,
        target      TEXT,
        context     TEXT,
        value       INTEGER,
        path        TEXT,
        referrer    TEXT,
        utm_source  TEXT,
        utm_medium  TEXT,
        utm_campaign TEXT,
        country     TEXT,
        city        TEXT,
        device      TEXT,
        browser     TEXT,
        os          TEXT,
        lang        TEXT
      )`;
    await sql`CREATE INDEX IF NOT EXISTS events_ts_idx ON events (ts DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS events_type_ts_idx ON events (type, ts DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS events_session_idx ON events (session_id)`;
  })().catch((e) => {
    _schema = null; // дать следующему запросу шанс повторить
    throw e;
  });
  return _schema;
}
