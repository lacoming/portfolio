// content/profile.ts
export type I18nText = { ru: string; en: string };

export type Link = {
  label: I18nText;
  href: string;
  icon?: "github" | "email" | "telegram" | "hh";
};

export type Highlight = {
  title: I18nText;
  description: I18nText;
};

export type Project = {
  id: string;
  title: I18nText;
  subtitle: I18nText;
  role: I18nText;
  period?: string;
  stack: string[];
  tags: Array<"Fullstack" | "Frontend" | "Backend" | "SSR/SEO" | "Fintech/Data" | "DevOps" | "UI/UX">;
  bullets: I18nText[];
  links: Array<{ label: I18nText; href: string }>;
};

export type SkillGroup = {
  title: I18nText;
  items: string[];
};

export type AITool = {
  name: string;
  note: I18nText;
};

export const profile = {
  name: { ru: "Александр Вострухин", en: "Alexander Vostrukhin" } as I18nText,
  title: { ru: "Full-stack разработчик", en: "Full-stack Developer" } as I18nText,
  location: { ru: "Санкт-Петербург, РФ", en: "Saint Petersburg, Russia" } as I18nText,

  tagline: {
    ru: "Делаю быстрые и понятные веб-продукты: SSR/SEO, интеграции, базы данных и аккуратный UI.",
    en: "I build fast, maintainable web products: SSR/SEO, integrations, databases, and polished UI."
  } as I18nText,

  ctaPrimary: { ru: "Связаться", en: "Contact" } as I18nText,
  ctaSecondary: { ru: "Проекты", en: "Projects" } as I18nText,
  skillsTitle: { ru: "Навыки", en: "Skills" } as I18nText,

  links: [
    {
      label: { ru: "GitHub", en: "GitHub" },
      href: "https://github.com/lacoming",
      icon: "github"
    },
    {
      label: { ru: "Email", en: "Email" },
      href: "mailto:lacoming@yandex.ru",
      icon: "email"
    },
    {
      label: { ru: "Telegram", en: "Telegram" },
      href: "https://t.me/lacomingsoon",
      icon: "telegram"
    },
    {
      label: { ru: "HeadHunter", en: "HeadHunter" },
      href: "https://hh.ru/resume/3eae7ca8ff10065fa00039ed1f564a70664f59",
      icon: "hh"
    }
  ] as Link[],

  highlights: [
    {
      title: { ru: "Full-stack до прода", en: "Full-stack to production" },
      description: {
        ru: "Фронтенд + бэкенд + PostgreSQL + Docker. Умею доводить фичи до релиза и поддерживать дальше.",
        en: "Frontend + backend + PostgreSQL + Docker. I ship features to production and maintain them."
      }
    },
    {
      title: { ru: "SSR и SEO-миграции", en: "SSR & SEO migrations" },
      description: {
        ru: "Редиректы, мета, canonical, sitemap/robots, контроль индексации и перенос с Tilda/legacy на единый SSR-фронт.",
        en: "Redirects, meta, canonical, sitemap/robots, index control, and migrations from Tilda/legacy to a unified SSR frontend."
      }
    },
    {
      title: { ru: "Fintech/Data пайплайны", en: "Fintech/Data pipelines" },
      description: {
        ru: "Сбор → нормализация → БД → UI. Интеграции с разными источниками и стабильная доставка данных в продукт.",
        en: "Collect → normalize → store → present. Integrations across sources and reliable data delivery."
      }
    },
    {
      title: { ru: "Аккуратный UI и вкус", en: "Polished UI & taste" },
      description: {
        ru: "Minimal UI, типографика, анимации без шума, Pixel Perfect по макетам.",
        en: "Minimal UI, typography, subtle motion, and pixel-perfect implementation."
      }
    }
  ] as Highlight[],

  projects: [
    {
      id: "tokeon-site",
      title: { ru: "Токеон — официальный сайт", en: "Tokeon — Official Website" },
      subtitle: {
        ru: "SSR + SEO-миграции, интеграция с API, прод-выкаты",
        en: "SSR + SEO migrations, API integration, production releases"
      },
      role: { ru: "Frontend-разработчик (команда/прод)", en: "Frontend Developer (team/production)" },
      stack: ["TypeScript", "Nuxt/Vue (SSR)", "REST API", "HTML/CSS", "Git"],
      tags: ["Frontend", "SSR/SEO", "UI/UX"],
      bullets: [
        {
          ru: "Делал SEO-миграции на SSR: редиректы, meta, canonical, sitemap/robots, контроль индексации.",
          en: "Delivered SSR SEO migrations: redirects, meta, canonical, sitemap/robots, index control."
        },
        {
          ru: "Переносил страницы/разделы с Tilda/legacy на единый фронтенд без временных костылей.",
          en: "Migrated sections from Tilda/legacy to a unified frontend without temporary hacks."
        },
        {
          ru: "Интегрировал фронтенд с API + участвовал в прод-выкатах и post-release фиксах.",
          en: "Integrated the frontend with APIs and handled production rollouts & post-release fixes."
        }
      ],
      links: [
        { label: { ru: "Сайт", en: "Website" }, href: "https://tokeon.ru/" }
      ]
    },
    {
      id: "tokeon-bot",
      title: { ru: "Токеон — Telegram-бот", en: "Tokeon — Telegram Bot" },
      subtitle: {
        ru: "Бизнес-логика, хранилище, фоновые задачи и рассылки",
        en: "Business logic, storage, background jobs, and notifications"
      },
      role: { ru: "Разработчик (в команде)", en: "Developer (team)" },
      period: "09.2024–01.2025",
      stack: ["Node.js", "Telegraf", "PostgreSQL", "SQL", "Docker"],
      tags: ["Backend", "Fullstack", "DevOps"],
      bullets: [
        {
          ru: "Реализовал сценарии, меню, уведомления, обработку ошибок и устойчивое поведение бота.",
          en: "Implemented flows, menus, notifications, error handling, and bot reliability."
        },
        {
          ru: "Спроектировал хранение в PostgreSQL (таблицы/запросы) под уведомления и историю действий.",
          en: "Designed PostgreSQL storage (tables/queries) for notifications and action history."
        },
        {
          ru: "Добавил планировщик/фоновые задачи для автоматических проверок и рассылок.",
          en: "Added a scheduler/background jobs for automated checks and outbound messages."
        }
      ],
      links: [
        { label: { ru: "Бот", en: "Bot" }, href: "https://t.me/tokeon_bot" }
      ]
    },
    {
      id: "cfa-radar-app",
      title: { ru: "CFA Radar", en: "CFA Radar" },
      subtitle: {
        ru: "Продукт и интерфейс: карточки, фильтры, SSR/SEO, типизация",
        en: "Product & UI: cards, filters, SSR/SEO, strong typing"
      },
      role: { ru: "Автор и разработчик (product/dev)", en: "Creator & Developer (product/dev)" },
      period: "05.2025–09.2025",
      stack: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
      tags: ["Fullstack", "Fintech/Data", "SSR/SEO", "DevOps", "UI/UX"],
      bullets: [
        {
          ru: "Собрал интерфейс на React/Next: карточки выпусков, фильтры/сортировки, состояния loading/error/empty.",
          en: "Built a React/Next UI: issuance cards, filters/sorting, loading/error/empty states."
        },
        {
          ru: "Настроил SSR/SEO-структуру страниц и строгую типизацию данных на TypeScript.",
          en: "Implemented SSR/SEO page structure and strict TypeScript data typing."
        },
        {
          ru: "Поднял пайплайн данных (сбор → нормализация → БД), окружение и деплой через Docker.",
          en: "Shipped the data pipeline (collect → normalize → DB) and Dockerized env/deploy."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/cfa-radar" }
      ]
    },
    {
      id: "cfa-radar-parser",
      title: { ru: "CFA Radar — парсинг и планировщик", en: "CFA Radar — Parsing & Scheduler" },
      subtitle: {
        ru: "Сбор данных, cron-задачи, БД-модель статусов и уведомления",
        en: "Data collection, cron jobs, DB status model and notifications"
      },
      role: { ru: "Автор и разработчик", en: "Creator & Developer" },
      stack: ["Node.js", "PostgreSQL", "SQL", "Docker", "cron/scheduler"],
      tags: ["Backend", "Fintech/Data", "DevOps"],
      bullets: [
        {
          ru: "Оркестрация задач по расписанию: повторные попытки, устойчивость к сбоям, контроль статусов.",
          en: "Scheduled orchestration: retries, failure resilience, and status control."
        },
        {
          ru: "Модель данных под этапы выпусков и фильтрацию по состояниям (например, ‘идёт сбор заявок’).",
          en: "Data model for issuance lifecycle and state filtering (e.g., ‘subscription open’)."
        },
        {
          ru: "Подготовка окружения через Docker для воспроизводимого запуска.",
          en: "Dockerized environment for reproducible execution."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/cfa-radar" }
      ]
    },
    {
      id: "terskarabian",
      title: { ru: "Официальный сайт конного завода", en: "Horse Stud — Official Website" },
      subtitle: {
        ru: "Сайт под ключ: адаптив, Pixel Perfect, SEO-база",
        en: "Turnkey website: responsive, pixel-perfect, SEO basics"
      },
      role: { ru: "Frontend-разработчик (проектная работа)", en: "Frontend Developer (contract)" },
      period: "10.2024–04.2025",
      stack: ["HTML5", "CSS3", "JavaScript", "Git", "Figma", "Basic SEO"],
      tags: ["Frontend", "UI/UX", "SSR/SEO"],
      bullets: [
        {
          ru: "Сделал сайт под ключ: адаптив, Pixel Perfect по Figma, кроссбраузерность.",
          en: "Delivered a turnkey site: responsive, pixel-perfect to Figma, cross-browser."
        },
        {
          ru: "Подготовил базовое SEO: структура, мета, оптимизация изображений.",
          en: "Handled SEO basics: structure, meta, image optimization."
        },
        {
          ru: "Подготовил проект к поддержке: структура и инструкция по запуску/обновлениям.",
          en: "Prepared the project for maintenance: structure and run/update docs."
        }
      ],
      links: [
        { label: { ru: "Сайт", en: "Website" }, href: "https://terskarabian.com/" }
      ]
    },
    {
      id: "art",
      title: { ru: "Art — сайт для музыкальной группы", en: "Art — Music Band Website" },
      subtitle: {
        ru: "Nuxt/Vue + Strapi CMS: контент, анимации, адаптив, оптимизация",
        en: "Nuxt/Vue + Strapi CMS: content, motion, responsive layout, optimization"
      },
      role: { ru: "Frontend-разработчик", en: "Frontend Developer" },
      stack: ["Nuxt/Vue (SSR)", "TypeScript", "Strapi", "HTML/CSS", "Git"],
      tags: ["Frontend", "UI/UX"],
      bullets: [
        {
          ru: "Собрал современный сайт на Nuxt/Vue: секции, анимации, адаптив.",
          en: "Built a modern Nuxt/Vue site: sections, motion, and responsive layout."
        },
        {
          ru: "Интегрировал Strapi как CMS: структура контента, получение данных, удобное расширение.",
          en: "Integrated Strapi as a CMS: content structure, data fetching, and easy extensibility."
        },
        {
          ru: "Оптимизировал ассеты и загрузку для быстрого рендера и стабильного UX.",
          en: "Optimized assets and loading for faster rendering and a stable UX."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/art" }
      ]
    },
    {
      id: "demonslayer",
      title: { ru: "DemonSlayer — обучение React", en: "DemonSlayer — React Learning Site" },
      subtitle: {
        ru: "Next.js App Router + Prisma/SQLite: учебный продукт с анимациями",
        en: "Next.js App Router + Prisma/SQLite: a learning product with motion"
      },
      role: { ru: "Автор и разработчик", en: "Creator & Developer" },
      stack: [
        "Next.js 14+ (App Router)",
        "TypeScript",
        "Tailwind CSS",
        "Prisma",
        "SQLite",
        "shadcn/ui",
        "framer-motion",
        "lucide-react",
        "Git"
      ],
      tags: ["Frontend", "UI/UX"],
      bullets: [
        {
          ru: "Сформировал структуру учебного продукта под ключевые темы React/Frontend.",
          en: "Designed a learning product structure around key React/Frontend topics."
        },
        {
          ru: "Реализовал страницы, компоненты и навигацию на Next.js App Router.",
          en: "Implemented pages, components, and navigation with the Next.js App Router."
        },
        {
          ru: "Добавил локальную БД через Prisma + SQLite для хранения прогресса/данных.",
          en: "Added a local database via Prisma + SQLite to store progress/data."
        },
        {
          ru: "Использовал framer-motion для аккуратных анимаций и улучшения восприятия интерфейса.",
          en: "Used framer-motion for subtle animations and improved UI feel."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/demonslayer" }
      ]
    }
  ] as Project[],

  skills: [
    {
      title: { ru: "Frontend", en: "Frontend" },
      items: ["TypeScript", "Vue 3 / Nuxt (SSR)", "React / Next.js", "HTML5", "CSS3", "Accessibility", "Responsive UI"]
    },
    {
      title: { ru: "Backend & Data", en: "Backend & Data" },
      items: ["Node.js", "REST API", "PostgreSQL", "SQL", "Schedulers (cron)", "Data normalization"]
    },
    {
      title: { ru: "DevOps", en: "DevOps" },
      items: ["Docker", "CI basics", "Production troubleshooting", "Release routines"]
    },
    {
      title: { ru: "Product & Design", en: "Product & Design" },
      items: ["Pixel Perfect", "Figma handoff", "Minimal UI", "Motion/UI polish"]
    }
  ] as SkillGroup[],

  workflow: {
    title: { ru: "Как работаю", en: "How I work" } as I18nText,
    bullets: [
      {
        ru: "Сначала формулирую задачу и ограничения, потом делаю план и только затем код.",
        en: "I clarify goals and constraints, make a plan, then implement."
      },
      {
        ru: "Думаю про прод: мониторинг ошибок, крайние кейсы, поддерживаемость.",
        en: "I think production-first: edge cases, stability, maintainability."
      },
      {
        ru: "Люблю чистую типизацию, понятные интерфейсы данных и предсказуемые сценарии.",
        en: "I prefer strict typing, clear data contracts, and predictable flows."
      },
      {
        ru: "Всегда довожу до “готово”: lint/typecheck/build, проверка UX и адаптива.",
        en: "I ship ‘done’: lint/typecheck/build plus UX and responsive checks."
      }
    ] as I18nText[]
  },

  ai: {
    title: { ru: "AI toolkit", en: "AI toolkit" } as I18nText,
    intro: {
      ru: "Использую ИИ как часть инженерного процесса: быстрее прототипирую, ревьюю и повышаю качество.",
      en: "I use AI as an engineering workflow: faster prototyping, review, and quality improvements."
    } as I18nText,
    bullets: [
      {
        ru: "Генерация черновиков и вариантов реализации, затем ручная проверка и доводка под прод.",
        en: "Generate implementation options, then manually validate and harden for production."
      },
      {
        ru: "Быстрое ревью кода, поиск багов, улучшение читаемости и архитектуры.",
        en: "Fast code review, bug hunting, improving readability and architecture."
      },
      {
        ru: "Прототипирование UI/копирайта и сборка документации/инструкций.",
        en: "Prototyping UI/copy and producing clear documentation and guides."
      }
    ] as I18nText[],
    tools: [
      { name: "Claude Code (Opus 4.6)", note: { ru: "Разработка в VSCode, рефакторинг, архитектура", en: "VSCode development, refactoring, architecture" } },
      { name: "ChatGPT (GPT-5.2 Thinking)", note: { ru: "Планирование, ревью, генерация вариантов", en: "Planning, review, generating alternatives" } },
      { name: "Cursor", note: { ru: "Быстрые правки, навигация по кодовой базе", en: "Fast edits, codebase navigation" } }
    ] as AITool[]
  },

  footerNote: {
    ru: "Открыт к предложениям: full-time / проектная работа / консультации.",
    en: "Open to opportunities: full-time / contract / consulting."
  } as I18nText
};