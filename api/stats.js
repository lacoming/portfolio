// Агрегаты для админки. Отдаёт всё одним JSON — панель рисует его без
// дополнительных запросов. Закрыт подписанной кукой.
import { db, ensureSchema } from './_db.js';
import { requireAuth } from './_auth.js';

// Часовой пояс, в котором режем сутки для графика по дням.
const TZ = 'Europe/Moscow';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  const days = Math.max(1, Math.min(365, Number(req.query.days) || 30));
  const since = new Date(Date.now() - days * 86400e3).toISOString();

  try {
    await ensureSchema();
    const sql = db();

    const [
      totals, daily, projects, contacts, funnel,
      referrers, utm, geo, devices, browsers, oses, scroll, langs, recent,
    ] = await Promise.all([
      sql`
        SELECT
          count(DISTINCT session_id)::int AS visits,
          count(DISTINCT visitor_id)::int AS visitors,
          count(*) FILTER (WHERE type = 'pageview')::int AS pageviews,
          count(*) FILTER (WHERE type = 'project_open')::int AS project_opens,
          count(*) FILTER (WHERE type = 'contact_click')::int AS contacts,
          COALESCE(round(avg(value) FILTER (WHERE type = 'session_end'))::int, 0) AS avg_seconds
        FROM events WHERE ts >= ${since}::timestamptz`,

      sql`
        SELECT to_char(ts AT TIME ZONE ${TZ}, 'YYYY-MM-DD') AS d,
               count(DISTINCT session_id)::int AS visits,
               count(DISTINCT visitor_id)::int AS visitors,
               count(*) FILTER (WHERE type = 'project_open')::int AS opens,
               count(*) FILTER (WHERE type = 'contact_click')::int AS contacts
        FROM events WHERE ts >= ${since}::timestamptz
        GROUP BY 1 ORDER BY 1`,

      sql`
        SELECT target AS key,
               count(*) FILTER (WHERE type = 'project_open')::int AS opens,
               count(*) FILTER (WHERE type = 'project_open' AND context = 'drum')::int AS drum,
               count(*) FILTER (WHERE type = 'project_open' AND context = 'grid')::int AS grid,
               count(*) FILTER (WHERE type = 'external_open')::int AS external,
               count(DISTINCT session_id) FILTER (WHERE type = 'project_open')::int AS sessions,
               COALESCE(round(avg(value) FILTER (WHERE type = 'modal_time'))::int, 0) AS avg_seconds
        FROM events
        WHERE ts >= ${since}::timestamptz AND target IS NOT NULL
          AND type IN ('project_open', 'external_open', 'modal_time')
        GROUP BY 1 ORDER BY opens DESC, avg_seconds DESC`,

      sql`
        SELECT target, count(*)::int AS n, count(DISTINCT session_id)::int AS sessions
        FROM events WHERE ts >= ${since}::timestamptz AND type = 'contact_click' AND target IS NOT NULL
        GROUP BY 1 ORDER BY n DESC`,

      sql`
        SELECT
          count(DISTINCT session_id) FILTER (WHERE type = 'pageview')::int AS visits,
          count(DISTINCT session_id) FILTER (WHERE type = 'section_view' AND target = 'works')::int AS works,
          count(DISTINCT session_id) FILTER (WHERE type = 'project_open')::int AS projects,
          count(DISTINCT session_id) FILTER (WHERE type = 'section_view' AND target = 'contact')::int AS contact_section,
          count(DISTINCT session_id) FILTER (WHERE type = 'contact_click')::int AS contact_click
        FROM events WHERE ts >= ${since}::timestamptz`,

      sql`
        SELECT COALESCE(NULLIF(referrer, ''), 'прямые заходы') AS src, count(DISTINCT session_id)::int AS n
        FROM events WHERE ts >= ${since}::timestamptz AND type = 'pageview'
        GROUP BY 1 ORDER BY n DESC LIMIT 20`,

      sql`
        SELECT utm_source AS source, utm_medium AS medium, utm_campaign AS campaign,
               count(DISTINCT session_id)::int AS n
        FROM events WHERE ts >= ${since}::timestamptz AND utm_source IS NOT NULL
        GROUP BY 1, 2, 3 ORDER BY n DESC LIMIT 20`,

      sql`
        SELECT COALESCE(country, '—') AS country, COALESCE(city, '—') AS city,
               count(DISTINCT session_id)::int AS n
        FROM events WHERE ts >= ${since}::timestamptz AND type = 'pageview'
        GROUP BY 1, 2 ORDER BY n DESC LIMIT 25`,

      sql`
        SELECT COALESCE(device, '—') AS k, count(DISTINCT session_id)::int AS n
        FROM events WHERE ts >= ${since}::timestamptz AND type = 'pageview' GROUP BY 1 ORDER BY n DESC`,

      sql`
        SELECT COALESCE(browser, '—') AS k, count(DISTINCT session_id)::int AS n
        FROM events WHERE ts >= ${since}::timestamptz AND type = 'pageview' GROUP BY 1 ORDER BY n DESC`,

      sql`
        SELECT COALESCE(os, '—') AS k, count(DISTINCT session_id)::int AS n
        FROM events WHERE ts >= ${since}::timestamptz AND type = 'pageview' GROUP BY 1 ORDER BY n DESC`,

      sql`
        SELECT value AS depth, count(DISTINCT session_id)::int AS n
        FROM events WHERE ts >= ${since}::timestamptz AND type = 'scroll' AND value IS NOT NULL
        GROUP BY 1 ORDER BY 1`,

      sql`
        SELECT COALESCE(target, lang, '—') AS k, count(*)::int AS n
        FROM events WHERE ts >= ${since}::timestamptz AND type = 'lang_switch' GROUP BY 1 ORDER BY n DESC`,

      sql`
        SELECT to_char(ts AT TIME ZONE ${TZ}, 'DD.MM HH24:MI') AS at,
               type, target, context, value, country, city, device, browser
        FROM events WHERE ts >= ${since}::timestamptz
        ORDER BY ts DESC LIMIT 60`,
    ]);

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      days,
      totals: totals[0],
      funnel: funnel[0],
      daily, projects, contacts, referrers, utm, geo,
      devices, browsers, oses, scroll, langs, recent,
    });
  } catch (e) {
    console.error('stats:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
