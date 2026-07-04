"use client";

import { useEffect } from "react";

/**
 * Поведенческий слой, перенесённый из движка Claude Design (DCLogic в .dc.html).
 * Повторяет ОРИГИНАЛ один в один: эффект появления (data-reveal), смена стиля
 * шапки при прокрутке, тень заголовка hero (heroEmphasis='shadow', по умолчанию),
 * интерактивный калькулятор доходности и форма заявки.
 *
 * Разметка лежит статикой в components/site/markup.ts (dangerouslySetInnerHTML),
 * этот компонент только навешивает поведение на готовый DOM по id - как делал
 * исходный <script> макета. Ничего во внешнем виде не меняет.
 */
export default function SiteRuntime() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const on = (
      target: Window | HTMLElement,
      type: string,
      fn: EventListenerOrEventListenerObject,
      opts?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, fn, opts);
      cleanups.push(() => target.removeEventListener(type, fn, opts));
    };
    const $ = (id: string) => document.getElementById(id);

    // ---- hero: тень заголовка (heroEmphasis = 'shadow' по умолчанию) ----
    const h1 = $("heroH1");
    const gold = $("heroGold");
    if (h1) {
      h1.style.fontWeight = "600";
      h1.style.textShadow =
        "0 3px 24px rgba(12,18,14,.7), 0 1px 5px rgba(12,18,14,.65)";
    }
    if (gold) {
      gold.style.fontWeight = "600";
      gold.style.textShadow = "0 3px 22px rgba(12,18,14,.7)";
    }

    // ---- калькулятор доходности ----
    const CALC = [
      { name: "Город Гор", short: "SelfStroit", yield: 24, min: 9.9, max: 30 },
      { name: "Карлуу", short: "Мой Дом", yield: 18, min: 12.1, max: 35 },
      { name: "Белогорье", short: "Резиденция-парк", yield: 28, min: 12.6, max: 40 },
    ];
    const segBase =
      "flex:1;padding:14px 8px;text-align:center;font-weight:600;font-size:13.5px;cursor:pointer;transition:all .22s;border:1px solid ";
    const segOn = segBase + "var(--bronze);background:var(--bronze);color:#fff";
    const segOff =
      segBase +
      "rgba(255,255,255,.22);background:rgba(255,255,255,.04);color:rgba(255,255,255,.78)";
    const fmt = (n: number) =>
      n.toLocaleString("ru-RU", { maximumFractionDigits: 1 });

    let calcObj = 2;
    let calcPrice = 12.6;

    const btnGG = $("calcBtnGG");
    const btnKA = $("calcBtnKA");
    const btnBE = $("calcBtnBE");
    const range = $("calcRange") as HTMLInputElement | null;
    const priceLabel = $("calcPriceLabel");
    const minLabel = $("calcMinLabel");
    const maxLabel = $("calcMaxLabel");
    const yieldDisc = $("calcYieldDisc");
    const nameEl = $("calcName");
    const incomeYearEl = $("calcIncomeYear");
    const incomeMonthEl = $("calcIncomeMonth");
    const paybackEl = $("calcPayback");
    const yieldCardEl = $("calcYieldCard");

    const updateCalc = () => {
      const o = CALC[calcObj];
      if (btnGG) btnGG.setAttribute("style", calcObj === 0 ? segOn : segOff);
      if (btnKA) btnKA.setAttribute("style", calcObj === 1 ? segOn : segOff);
      if (btnBE) btnBE.setAttribute("style", calcObj === 2 ? segOn : segOff);
      if (range) {
        range.min = String(o.min);
        range.max = String(o.max);
        range.value = String(calcPrice);
      }
      if (minLabel) minLabel.textContent = o.min + " млн ₽";
      if (maxLabel) maxLabel.textContent = o.max + " млн ₽";
      if (priceLabel) priceLabel.textContent = fmt(calcPrice) + " млн ₽";
      if (yieldDisc) yieldDisc.textContent = o.yield + "% в год";
      if (nameEl) nameEl.textContent = o.name;

      const incomeYear = (calcPrice * o.yield) / 100; // млн ₽
      const incomeMonth = (incomeYear / 12) * 1000; // тыс ₽
      const payback = Math.round((100 / o.yield) * 10) / 10;
      if (incomeYearEl)
        incomeYearEl.textContent =
          fmt(Math.round(incomeYear * 10) / 10) + " млн ₽";
      if (incomeMonthEl)
        incomeMonthEl.textContent =
          "≈ " + fmt(Math.round(incomeMonth)) + " тыс ₽/мес";
      if (paybackEl) paybackEl.textContent = fmt(payback) + " лет";
      if (yieldCardEl) yieldCardEl.textContent = o.yield + "%";
    };

    const setCalcObj = (i: number) => {
      calcObj = i;
      calcPrice = CALC[i].min;
      updateCalc();
    };
    if (btnGG) on(btnGG, "click", () => setCalcObj(0));
    if (btnKA) on(btnKA, "click", () => setCalcObj(1));
    if (btnBE) on(btnBE, "click", () => setCalcObj(2));
    if (range)
      on(range, "input", (e) => {
        calcPrice = parseFloat((e.target as HTMLInputElement).value);
        updateCalc();
      });
    updateCalc();

    // ---- форма заявки ----
    const formEl = $("leadForm") as HTMLFormElement | null;
    const formWrap = $("formWrap");
    const formDone = $("formDone");
    const fName = $("fName") as HTMLInputElement | null;
    const fPhone = $("fPhone") as HTMLInputElement | null;
    const fAgree = $("fAgree") as HTMLInputElement | null;
    const fObj = $("fObj") as HTMLSelectElement | null;
    const submitBtn = $("fSubmit") as HTMLButtonElement | null;

    const valid = () =>
      !!fName &&
      fName.value.trim().length > 1 &&
      !!fPhone &&
      fPhone.value.replace(/\D/g, "").length >= 10 &&
      !!fAgree &&
      fAgree.checked;

    const refreshBtn = () => {
      if (!submitBtn) return;
      const ok = valid();
      submitBtn.style.opacity = ok ? "1" : ".5";
      submitBtn.style.cursor = ok ? "pointer" : "not-allowed";
    };
    if (fName) on(fName, "input", refreshBtn);
    if (fPhone) on(fPhone, "input", refreshBtn);
    if (fAgree) on(fAgree, "change", refreshBtn);
    if (fObj) on(fObj, "change", refreshBtn);
    if (formEl)
      on(formEl, "submit", (e) => {
        e.preventDefault();
        if (!valid()) return;
        if (formWrap) formWrap.style.display = "none";
        if (formDone) formDone.style.display = "";
      });
    refreshBtn();

    // ---- эффект появления (data-reveal) ----
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let revealTimeout: ReturnType<typeof setTimeout> | undefined;
    if (reduce) {
      els.forEach((e) => {
        e.style.opacity = "1";
        e.style.transform = "none";
      });
    } else {
      const revealed = new WeakSet<HTMLElement>();
      els.forEach((e) => {
        e.style.opacity = "0";
        e.style.transform = "translateY(30px)";
        e.style.willChange = "opacity, transform";
      });
      const reveal = (e: HTMLElement) => {
        if (revealed.has(e)) return;
        revealed.add(e);
        const d = parseInt(e.getAttribute("data-reveal-delay") || "0", 10);
        e.style.transition =
          "opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1)";
        e.style.transitionDelay = d + "ms";
        e.style.opacity = "1";
        e.style.transform = "translateY(0)";
      };
      const check = () => {
        const trigger = window.innerHeight * 0.88;
        els.forEach((e) => {
          if (!revealed.has(e) && e.getBoundingClientRect().top < trigger)
            reveal(e);
        });
      };
      let rafFired = false;
      requestAnimationFrame(() => {
        rafFired = true;
        check();
        requestAnimationFrame(check);
      });
      on(window, "scroll", check, { passive: true });
      on(window, "resize", check, { passive: true });
      revealTimeout = setTimeout(() => {
        if (!rafFired) {
          els.forEach((e) => {
            e.style.transition = "none";
            e.style.opacity = "1";
            e.style.transform = "none";
          });
        } else {
          check();
        }
      }, 1600);
    }

    // ---- смена стиля шапки при прокрутке ----
    const header = $("siteHeader");
    if (header) {
      const onScroll = () => {
        if (window.scrollY > 60) {
          header.style.background = "rgba(246,242,234,.92)";
          header.style.backdropFilter = "blur(12px)";
          header.style.setProperty("-webkit-backdrop-filter", "blur(12px)");
          header.style.color = "#1B2620";
          header.style.boxShadow = "0 1px 0 rgba(27,38,32,.10)";
        } else {
          header.style.background = "transparent";
          header.style.backdropFilter = "none";
          header.style.color = "#fff";
          header.style.boxShadow = "none";
        }
      };
      on(window, "scroll", onScroll, { passive: true });
      onScroll();
    }

    // ---- мобильное меню (бургер) ----
    // Бургер и оверлей-меню добавлены в макете Claude Design только для мобильного
    // адаптива. В выгрузке они были на движке Claude Design ({{ toggleMenu }} / sc-if);
    // здесь переведены на тот же id/data-атрибутный подход, что и остальной интерактив.
    const burger = $("burgerBtn");
    const menu = $("mobileMenu");
    const closeMenu = () => {
      if (menu) menu.style.display = "none";
      document.body.style.overflow = "";
    };
    const openMenu = () => {
      if (menu) menu.style.display = "";
      document.body.style.overflow = "hidden";
    };
    if (burger) on(burger, "click", openMenu);
    if (menu) {
      Array.from(
        menu.querySelectorAll<HTMLElement>("[data-menu-close],[data-menu-link]"),
      ).forEach((el) => on(el, "click", closeMenu));
    }
    on(window, "keydown", (e) => {
      if ((e as KeyboardEvent).key === "Escape") closeMenu();
    });

    // ---- мобильное сравнение (гармошка) ----
    // На <=760px широкая таблица сравнения скрывается (data-r="cmp"), вместо неё
    // показываются карточки-аккордеоны (data-r="cmp-mobile"). По умолчанию свёрнуты.
    Array.from(
      document.querySelectorAll<HTMLElement>("[data-cmpm-head]"),
    ).forEach((head) => {
      on(head, "click", () => {
        const panel = head.nextElementSibling as HTMLElement | null;
        const chev = head.querySelector<HTMLElement>("[data-cmpm-chev]");
        if (!panel) return;
        const willOpen = panel.style.display === "none";
        panel.style.display = willOpen ? "block" : "none";
        if (chev) chev.style.transform = willOpen ? "rotate(180deg)" : "rotate(0deg)";
      });
    });

    return () => {
      if (revealTimeout) clearTimeout(revealTimeout);
      document.body.style.overflow = "";
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
