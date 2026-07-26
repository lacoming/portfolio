/**
 * Сбор событий витрины. Подключается обычным <script> в head.
 * Наружу отдаёт window.vzTrack(type, target, context, value) — обработчики
 * витрины дёргают её напрямую. Просмотры, скролл, секции и длительность
 * визита считаются здесь сами.
 *
 * Отключить счётчик для своего браузера: открыть страницу с ?vz_notrack=1
 * Включить обратно: ?vz_track=1
 */
(function () {
  'use strict';

  var API = '/api/track';
  var noop = function () {};

  var ls = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} },
  };

  var qs = location.search || '';
  if (qs.indexOf('vz_track=1') !== -1) ls.del('vz_notrack');
  if (qs.indexOf('vz_notrack=1') !== -1) ls.set('vz_notrack', '1');
  if (ls.get('vz_notrack') === '1') { window.vzTrack = noop; return; }

  // ---------- идентификатор визита ----------
  // Живёт в sessionStorage: новая вкладка — новый визит, перезагрузка — тот же.
  var sid;
  try {
    sid = sessionStorage.getItem('vz_sid');
    if (!sid) {
      sid = (Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
      sessionStorage.setItem('vz_sid', sid);
    }
  } catch (e) {
    sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  // ---------- метки источника ----------
  var params = new URLSearchParams(qs);
  var utm = {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
  };
  // Реферер запоминаем на весь визит: после навигации по якорям он теряется.
  var referrer = document.referrer || '';
  if (referrer && referrer.indexOf(location.host) !== -1) referrer = '';

  // ---------- отправка ----------
  function send(type, target, context, value) {
    var body = JSON.stringify({
      t: type,
      k: target == null ? null : String(target),
      c: context == null ? null : String(context),
      v: value == null ? null : value,
      s: sid,
      p: location.pathname,
      r: referrer,
      l: (window.vzLocale || document.documentElement.lang || navigator.language || '').slice(0, 8),
      q: utm,
    });
    // sendBeacon переживает закрытие вкладки — для session_end это критично.
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(API, new Blob([body], { type: 'application/json' }))) return;
    } catch (e) {}
    try {
      fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true }).catch(noop);
    } catch (e) {}
  }

  window.vzTrack = send;

  // ---------- просмотр страницы ----------
  send('pageview');

  // ---------- глубина скролла ----------
  var marks = [25, 50, 75, 100];
  var sent = {};
  var ticking = false;

  function checkScroll() {
    ticking = false;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    var pct = Math.min(100, Math.round((window.scrollY / h) * 100));
    for (var i = 0; i < marks.length; i++) {
      if (pct >= marks[i] && !sent[marks[i]]) {
        sent[marks[i]] = true;
        send('scroll', null, null, marks[i]);
      }
    }
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(checkScroll);
  }, { passive: true });

  // ---------- показы секций ----------
  // Разметку витрины рисует рантайм из support.js, поэтому секций может ещё
  // не быть в момент запуска скрипта — пробуем несколько раз, потом сдаёмся.
  if (window.IntersectionObserver) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || seen[en.target.id]) return;
        seen[en.target.id] = true;
        send('section_view', en.target.id);
      });
    }, { threshold: 0.25 });

    var tries = 0;
    (function watchSections() {
      var found = 0;
      ['works', 'about', 'contact'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el && !el.dataset.vzWatched) { el.dataset.vzWatched = '1'; io.observe(el); found++; }
      });
      if (found < 3 && ++tries < 20) setTimeout(watchSections, 250);
    })();
  }

  // ---------- длительность визита ----------
  // Считаем только время с открытой вкладкой: свёрнутое окно не должно
  // превращаться в «посетитель читал два часа».
  var active = 0;
  var since = Date.now();
  var closed = false;

  function pause() {
    if (since) { active += Date.now() - since; since = 0; }
  }
  function resume() {
    if (!since) since = Date.now();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { pause(); finish(); } else resume();
  });

  function finish() {
    if (closed) return;
    pause();
    var sec = Math.round(active / 1000);
    if (sec < 1) return;
    closed = true;
    send('session_end', null, null, sec);
  }

  window.addEventListener('pagehide', finish);
})();
