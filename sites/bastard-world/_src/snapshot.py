"""Снимок главной bastard.world для витрины.

Боевой сайт отдаёт X-Frame-Options: SAMEORIGIN и CSP frame-ancestors 'self',
поэтому в iframe витрины он не открывается - показываем локальную копию главной,
как у Токеона. Скрипт тянет боевую страницу, складывает её ресурсы рядом и
вырезает JS: копия статична, все внутренние ссылки уводят на боевой сайт
в новой вкладке.

Запуск из корня витрины:  python sites/bastard-world/_src/snapshot.py
Нужен Pillow (pip install pillow) - им пережимается обложка «Йода».

Превью previews/bastard-world.jpg снимается с этой копии вьюпортом 1100x619 и
уменьшается до 924x520: на штатных 1440 обложки книг в кадре мелкие и на тёмном
фоне витрины карточка читается плохо.
"""

import re
import shutil
import urllib.parse
import urllib.request
from pathlib import Path

SITE = "https://bastard.world"
OUT = Path(__file__).resolve().parent.parent
ASSETS = OUT / "assets"


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (vitrina snapshot)"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def save_asset(path: str) -> str:
    """Качает ресурс сайта и возвращает путь к нему относительно index.html."""
    clean = path.split("?")[0]
    name = Path(urllib.parse.unquote(clean)).name
    (ASSETS / name).write_bytes(fetch(SITE + path))
    return "assets/" + name


def main() -> None:
    if ASSETS.exists():
        shutil.rmtree(ASSETS)
    ASSETS.mkdir(parents=True)

    html = fetch(SITE + "/").decode("utf-8")

    # ---- стили: внутри лежат ссылки на шрифты (../media/ от папки chunks), их тоже тянем ----
    css_link = re.search(r'href="(/_next/static/chunks/[^"]+\.css)"', html)
    if not css_link:
        raise SystemExit("не нашёл ссылку на CSS-чанк в html боевого сайта - Next поменял разметку, правь regex")
    css_path = css_link.group(1)
    css = fetch(SITE + css_path).decode("utf-8")
    for font in sorted(set(re.findall(r"url\(\.\./media/([^)]+)\)", css))):
        (ASSETS / font).write_bytes(fetch(SITE + "/_next/static/media/" + font))
        css = css.replace("../media/" + font, font)
    (ASSETS / "site.css").write_text(css, encoding="utf-8")

    # ---- обложки книг ----
    for media in sorted(set(re.findall(r'(?:src|href|poster)="(/(?:covers|api/covers)/[^"]+)"', html))):
        html = html.replace('"' + media + '"', '"' + save_asset(media) + '"')

    # Обложка «Йода» на боевом отдаётся из админки исходным PNG на 4 МБ (там её ужимает
    # next/image). В статической копии оптимизатора нет - жмём сами под ширину вёрстки.
    yod = ASSETS / "yod.png"
    if yod.exists():
        from PIL import Image

        img = Image.open(yod).convert("RGB")
        img.thumbnail((900, 1400), Image.LANCZOS)
        img.save(ASSETS / "yod.jpg", quality=86, optimize=True, progressive=True)
        yod.unlink()
        html = html.replace("assets/yod.png", "assets/yod.jpg")

    # ---- вырезаем всё, что тянет Next: скрипты, префетчи, иконки с боевого ----
    html = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.S)
    html = re.sub(r'<link[^>]+rel="(?:preload|prefetch|modulepreload)"[^>]*>', "", html)
    html = html.replace(css_path, "assets/site.css")
    html = re.sub(r'<link[^>]+(?:apple-icon|/icon\.png)[^>]*>', "", html)

    # ---- внутренние ссылки ведут на боевой сайт новой вкладкой ----
    def relink(m: re.Match) -> str:
        tag, href = m.group(0), m.group(1)
        tag = tag.replace('href="' + href + '"', 'href="' + SITE + href + '" target="_blank" rel="noopener"')
        return tag

    html = re.sub(r'<a\b[^>]*href="(/[^"]*)"[^>]*>', relink, html)

    # На боевом видео-подложку обложки показывает и запускает React: в разметке она лежит
    # с opacity-0 и preload="none". Реакт мы вырезали - возвращаем тот же эффект вручную,
    # иначе обложка в копии на наведение не отзывается.
    hover = """
<script>
document.querySelectorAll('.cover-frame').forEach(function (frame) {
  var video = frame.querySelector('video');
  if (!video) return;
  var card = frame.closest('a') || frame;
  card.addEventListener('mouseenter', function () {
    video.style.opacity = '1';
    var p = video.play();
    if (p) p.catch(function () {});
  });
  card.addEventListener('mouseleave', function () {
    video.style.opacity = '0';
    video.pause();
    video.currentTime = 0;
  });
});
</script>
"""
    html = html.replace("</body>", hover + "</body>")

    marker = (
        "<!-- Копия главной bastard.world для витрины: статична, JS вырезан, "
        "ссылки уводят на боевой сайт. Пересобрать: _src/snapshot.py -->\n"
    )
    (OUT / "index.html").write_text(marker + html, encoding="utf-8")
    print("готово:", OUT / "index.html", len(html), "байт html,", len(list(ASSETS.iterdir())), "ресурсов")


if __name__ == "__main__":
    main()
