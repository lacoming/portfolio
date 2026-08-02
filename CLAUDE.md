# Правила проекта

- После любой правки сайта в `sites/` обновляй его превью `previews/<key>.jpg` (924×520, JPEG, скрин верха страницы). Ключи: tokeon, rentsale-altay, flexpath, univer-zakupok, tersk, termy, bastard-world, gastro, atelier.
- Исключение: `previews/tokeon.jpg` — курированный скрин, поверх него анимируется отдельный слой `previews/tokeon-sphere.png`. Не перезаписывать без явной просьбы.
- `sites/last-signal/` и `previews/last-signal.jpg` временно сняты с витрины (сайт переделывается) — файлы не удалять.
- Переменные окружения Vercel: `DATABASE_URL` (Neon), `ADMIN_PASSWORD` и `ADMIN_SECRET` (админка), `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` (уведомления о заявках). Без телеграм-переменных форма работает, заявка просто ложится в базу без уведомления. В репозиторий ничего из этого не класть — `.env` и `.env.*` в `.gitignore`.
- `sites/bastard-world/` — статическая копия главной bastard.world: боевой сайт запрещает встраивание в iframe (`X-Frame-Options: SAMEORIGIN`, CSP `frame-ancestors 'self'`). Пересобирается скриптом `sites/bastard-world/_src/snapshot.py` из корня витрины.
