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

// Заявки с формы обратной связи. Отдельная таблица и отдельная ленивая схема:
// события с формой не связаны, и приём заявки не должен зависеть от того,
// поднялась ли схема аналитики.
let _leadsSchema = null;

export function ensureLeadsSchema() {
  if (_leadsSchema) return _leadsSchema;
  _leadsSchema = (async () => {
    const sql = db();
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id          BIGSERIAL PRIMARY KEY,
        ts          TIMESTAMPTZ NOT NULL DEFAULT now(),
        name        TEXT NOT NULL,
        channel     TEXT NOT NULL,
        contact     TEXT NOT NULL,
        task        TEXT NOT NULL,
        consent     BOOLEAN NOT NULL DEFAULT false,
        status      TEXT NOT NULL DEFAULT 'new',
        session_id  TEXT,
        ip_hash     TEXT,
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
        lang        TEXT,
        notified    BOOLEAN NOT NULL DEFAULT false
      )`;
    await sql`CREATE INDEX IF NOT EXISTS leads_ts_idx ON leads (ts DESC)`;
    // Частота заявок считается по ip_hash за последний час — индекс под этот запрос.
    await sql`CREATE INDEX IF NOT EXISTS leads_ip_ts_idx ON leads (ip_hash, ts DESC)`;
  })().catch((e) => {
    _leadsSchema = null;
    throw e;
  });
  return _leadsSchema;
}

// Таблица лидеров мини-игры «Космический дзен-сад». Раньше жила в отдельном
// проекте Supabase, который перестал существовать вместе со всем топом; теперь
// здесь же, где аналитика и заявки — одна база, один деплой, нечему разъехаться.
let _zenSchema = null;

export function ensureZenSchema() {
  if (_zenSchema) return _zenSchema;
  _zenSchema = (async () => {
    const sql = db();
    await sql`
      CREATE TABLE IF NOT EXISTS zen_players (
        player_id  TEXT PRIMARY KEY,
        nickname   TEXT NOT NULL,
        nick_key   TEXT NOT NULL,
        score      BIGINT  NOT NULL DEFAULT 0,
        harvests   INTEGER NOT NULL DEFAULT 0,
        best_rank  TEXT    NOT NULL DEFAULT 'common',
        ip_hash    TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    // Колонка добавлена позже таблицы — на уже созданной базе CREATE TABLE
    // молчит, поэтому досыпаем отдельно.
    await sql`ALTER TABLE zen_players ADD COLUMN IF NOT EXISTS ip_hash TEXT`;
    // Бронь имени: два садовника с одним ником в топе жить не могут.
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS zen_players_nick_key_idx ON zen_players (nick_key)`;
    await sql`CREATE INDEX IF NOT EXISTS zen_players_score_idx ON zen_players (score DESC)`;
    // Частота бронирований считается по ip_hash за последний час — как в leads.
    await sql`CREATE INDEX IF NOT EXISTS zen_players_ip_created_idx ON zen_players (ip_hash, created_at DESC)`;
  })().catch((e) => {
    _zenSchema = null;
    throw e;
  });
  return _zenSchema;
}
