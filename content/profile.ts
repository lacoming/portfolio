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

export type Stat = {
  value: string;
  label: I18nText;
};

export type Project = {
  id: string;
  title: I18nText;
  subtitle: I18nText;
  role: I18nText;
  period?: string;
  image?: string;
  stack: string[];
  tags: Array<"Fullstack" | "Frontend" | "Backend" | "SSR/SEO" | "Fintech/Data" | "DevOps" | "UI/UX" | "Mobile" | "AI/Automation">;
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
    ru: "Создаю веб-продукты, мобильные приложения и AI-автоматизации — от идеи до работающего сервиса. На меня работает собственный AI-офис.",
    en: "I build web products, mobile apps, and AI automations — from idea to working service. Powered by my own AI office."
  } as I18nText,

  ctaPrimary: { ru: "Связаться", en: "Get in touch" } as I18nText,
  ctaSecondary: { ru: "Проекты", en: "Projects" } as I18nText,
  skillsTitle: { ru: "Навыки", en: "Skills" } as I18nText,

  stats: [
    {
      value: "15+",
      label: { ru: "проектов", en: "projects" }
    },
    {
      value: "3+",
      label: { ru: "года опыта", en: "years experience" }
    },
    {
      value: "5",
      label: { ru: "стеков", en: "tech stacks" }
    },
    {
      value: "24/7",
      label: { ru: "AI-офис", en: "AI office" }
    }
  ] as Stat[],

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
      title: { ru: "Полный цикл: идея → продукт", en: "Full cycle: idea → product" },
      description: {
        ru: "Беру задачу от концепции до работающего сервиса — фронтенд, бэкенд, база данных, деплой. Не нужна команда из пяти человек.",
        en: "I take a task from concept to working service — frontend, backend, database, deploy. No need for a team of five."
      }
    },
    {
      title: { ru: "AI-усиленная разработка", en: "AI-augmented development" },
      description: {
        ru: "Построил собственный AI-офис: агенты для code review, тестирования, документации и автоматизации. Это ускоряет работу в разы.",
        en: "Built my own AI office: agents for code review, testing, documentation, and automation. This multiplies my output."
      }
    },
    {
      title: { ru: "Web + Mobile + Автоматизации", en: "Web + Mobile + Automations" },
      description: {
        ru: "Next.js, React, Vue, Flutter, n8n — выбираю инструмент под задачу. Не привязан к одному стеку.",
        en: "Next.js, React, Vue, Flutter, n8n — I pick the right tool for the job. Not locked into one stack."
      }
    },
    {
      title: { ru: "Качество без компромиссов", en: "Quality without compromise" },
      description: {
        ru: "Строгая типизация, чистый UI, SEO, тесты, мониторинг. Делаю так, чтобы продукт жил долго и не ломался.",
        en: "Strict typing, clean UI, SEO, tests, monitoring. I build products that last and don't break."
      }
    }
  ] as Highlight[],

  projects: [
    {
      id: "openclaw",
      image: "/projects/ai-office.png",
      title: { ru: "OpenClaw — персональный AI-офис", en: "OpenClaw — Personal AI Office" },
      subtitle: {
        ru: "Командный центр с оркестратором агентов, пиксельным офисом и автоматизацией фриланса",
        en: "Command center with agent orchestrator, pixel office UI, and freelance automation"
      },
      role: { ru: "Автор и разработчик", en: "Creator & Developer" },
      period: "03.2026",
      stack: ["React 19", "TypeScript", "PixiJS 8", "Vite", "FastAPI", "Anthropic API", "WebSocket", "Docker"],
      tags: ["Fullstack", "AI", "Automation"],
      bullets: [
        {
          ru: "LLM-оркестратор маршрутизирует задачи по отделам агентов: продажи, клиенты, архитектура, финансы, разработка.",
          en: "LLM orchestrator routes tasks across agent departments: sales, clients, architecture, finance, development."
        },
        {
          ru: "Пиксельный офис на PixiJS — визуализация работы агентов в реальном времени через WebSocket.",
          en: "Pixel office on PixiJS — real-time agent activity visualization via WebSocket."
        },
        {
          ru: "Интеграция с gstack (28 Claude Code скиллов) для полного цикла разработки: plan → build → review → QA → ship.",
          en: "Integration with gstack (28 Claude Code skills) for full dev cycle: plan → build → review → QA → ship."
        }
      ],
      links: []
    },
    {
      id: "n8n-orchestrator",
      image: "/projects/n8n.png",
      title: { ru: "AI-офис — n8n Orchestrator", en: "AI Office — n8n Orchestrator" },
      subtitle: {
        ru: "Модульная AI/автоматизация: orchestrator + worker, PostgreSQL, JSON-контракты, retry, logging",
        en: "Modular AI/automation: orchestrator + worker, PostgreSQL, JSON contracts, retry, logging"
      },
      role: { ru: "Автор и архитектор", en: "Creator & Architect" },
      period: "03.2026",
      stack: ["n8n", "PostgreSQL", "Supabase", "JSON Contracts", "AI Agents"],
      tags: ["AI/Automation", "Backend", "DevOps"],
      bullets: [
        {
          ru: "Спроектировал архитектуру orchestrator/worker с разделением ответственности и независимым тестированием.",
          en: "Designed orchestrator/worker architecture with separation of concerns and independent testing."
        },
        {
          ru: "Реализовал session state в PostgreSQL, структурированные JSON-контракты и error handling с retry.",
          en: "Implemented session state in PostgreSQL, structured JSON contracts, and error handling with retry."
        },
        {
          ru: "Система принимает запросы на естественном языке, парсит параметры и выполняет бизнес-логику автоматически.",
          en: "The system accepts natural language requests, parses parameters, and executes business logic automatically."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/n8n-mini-orchestrator" }
      ]
    },
    {
      id: "sport-scout",
      image: "/projects/sport-scout.png",
      title: { ru: "Sport Scout — платформа скаутинга", en: "Sport Scout — Scouting Platform" },
      subtitle: {
        ru: "Платформа для спортивного скаутинга с аналитикой, кастомными SVG-графиками и Docker-деплоем",
        en: "Sports scouting platform with analytics, custom SVG charts, and Docker deployment"
      },
      role: { ru: "Автор и разработчик", en: "Creator & Developer" },
      period: "03.2026",
      stack: ["React", "TypeScript", "Vite", "SVG", "Docker", "Nginx"],
      tags: ["Fullstack", "Frontend", "DevOps", "UI/UX"],
      bullets: [
        {
          ru: "Разработал интерактивные SVG-компоненты для визуализации данных без сторонних библиотек графиков.",
          en: "Developed interactive SVG components for data visualization without any charting libraries."
        },
        {
          ru: "Настроил Docker + Nginx для продакшен-деплоя и Vercel для демо-версии.",
          en: "Configured Docker + Nginx for production deployment and Vercel for demo."
        },
        {
          ru: "Строгая типизация данных, модульная архитектура компонентов.",
          en: "Strict data typing, modular component architecture."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/sport-scout" },
        { label: { ru: "Demo", en: "Demo" }, href: "https://github.com/lacoming/web-sport-scout-demo" }
      ]
    },
    {
      id: "mini-booking",
      image: "/projects/hotel-booking.png",
      title: { ru: "Mini Booking — система бронирования", en: "Mini Booking — Hotel Booking System" },
      subtitle: {
        ru: "Бронирование номеров с GraphQL API, защитой от пересечений и мульти-клиентами: Web + Flutter",
        en: "Room booking with GraphQL API, overlap protection, and multi-client: Web + Flutter"
      },
      role: { ru: "Автор и разработчик", en: "Creator & Developer" },
      period: "02.2026",
      stack: ["Node.js", "TypeScript", "Apollo GraphQL", "PostgreSQL", "Prisma", "React", "Flutter/Dart", "Docker"],
      tags: ["Fullstack", "Backend", "Mobile"],
      bullets: [
        {
          ru: "Реализовал GraphQL API с Apollo Server, Prisma ORM и защитой от race condition через Serializable-транзакции.",
          en: "Built GraphQL API with Apollo Server, Prisma ORM, and race condition protection via Serializable transactions."
        },
        {
          ru: "Три клиента: React Web, Flutter Web, Flutter Desktop — единый бэкенд.",
          en: "Three clients: React Web, Flutter Web, Flutter Desktop — single backend."
        },
        {
          ru: "DB exclusion constraint (daterange + btree_gist) для гарантии непересечения бронирований.",
          en: "DB exclusion constraint (daterange + btree_gist) guarantees no booking overlaps."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/hotelBooking" }
      ]
    },
    {
      id: "bitrix24-warehouse",
      image: "/projects/bitrix24-warehouse.png",
      title: { ru: "Bitrix24 Warehouse GUI", en: "Bitrix24 Warehouse GUI" },
      subtitle: {
        ru: "Кастомный GUI для виртуального склада Битрикс24 с ролевой моделью и экспортом в Excel",
        en: "Custom GUI for Bitrix24 virtual warehouse with role-based access and Excel export"
      },
      role: { ru: "Автор и разработчик", en: "Creator & Developer" },
      period: "03.2026",
      stack: ["Vue", "TypeScript", "Vite", "Bitrix24 REST API", "HTML"],
      tags: ["Frontend", "Enterprise"],
      bullets: [
        {
          ru: "Кастомная таблица с фильтрацией, сортировкой и редактированием ячеек, заменяющая стандартный интерфейс Битрикс24.",
          en: "Custom table with filtering, sorting, and cell editing, replacing the standard Bitrix24 interface."
        },
        {
          ru: "Ролевая модель доступа, история изменений и экспорт данных в Excel.",
          en: "Role-based access model, change history, and Excel data export."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/bitrix24-warehouse-gui" }
      ]
    },
    {
      id: "web-landscape-2d",
      image: "/projects/dark.png",
      title: { ru: "Конструктор дорожек из плитки", en: "Tile Path Constructor" },
      subtitle: {
        ru: "Интерактивный 2D-конструктор дорожек из модульных плит с экспортом в DXF/PDF",
        en: "Interactive 2D tile path designer with DXF/PDF export"
      },
      role: { ru: "Автор и разработчик", en: "Creator & Developer" },
      period: "03.2026",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "Konva.js", "Python", "FastAPI", "Supabase", "Docker"],
      tags: ["Fullstack", "Frontend", "Backend"],
      bullets: [
        {
          ru: "Интерактивный Canvas-редактор на Konva.js: размещение объектов, проектирование дорожек из плиток разных форм.",
          en: "Interactive Canvas editor with Konva.js: object placement, path design with various tile shapes."
        },
        {
          ru: "Python-бэкенд (FastAPI) для генерации DXF-чертежей и PDF-экспорта готового проекта.",
          en: "Python backend (FastAPI) for DXF drawing generation and PDF export of finished projects."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/web_landscape-2D" }
      ]
    },
    {
      id: "parser-nb-bet",
      image: "/projects/parser-nb-bet.png",
      title: { ru: "NB-Bet Parser", en: "NB-Bet Parser" },
      subtitle: {
        ru: "Автоматический парсер спортивных матчей с фильтрацией по лигам и Telegram-уведомлениями",
        en: "Automated sports match parser with league filtering and Telegram notifications"
      },
      role: { ru: "Автор и разработчик", en: "Creator & Developer" },
      period: "03.2026",
      stack: ["Python", "Requests", "BeautifulSoup", "Tkinter", "Telegram API", "VK API", "Excel"],
      tags: ["Backend", "Automation", "Desktop"],
      bullets: [
        {
          ru: "Парсинг матчей через JSON API, автоматическая фильтрация по лигам и принятие решений по ставкам.",
          en: "Match parsing via JSON API, automatic league filtering, and automated betting decisions."
        },
        {
          ru: "Интеграция с kushvsporte.ru, уведомления в Telegram и VK, экспорт результатов в Excel.",
          en: "Integration with kushvsporte.ru, Telegram & VK notifications, Excel results export."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/parser_nb-bet" }
      ]
    },
    {
      id: "scaner-nb-bet",
      image: "/projects/parser-nb-bet.png",
      title: { ru: "NB-Bet Live Scanner", en: "NB-Bet Live Scanner" },
      subtitle: {
        ru: "Live-сканер коэффициентов с обнаружением прогрузов и сигналами в Telegram",
        en: "Live odds scanner with coefficient drop detection and Telegram signals"
      },
      role: { ru: "Автор и разработчик", en: "Creator & Developer" },
      period: "03.2026",
      stack: ["Python", "Playwright", "aiogram 3", "VK API", "SQLite", "Excel"],
      tags: ["Backend", "Automation", "Parsing"],
      bullets: [
        {
          ru: "Headless-браузер (Playwright) для авторизации и параллельного обхода шаблонов сканера коэффициентов.",
          en: "Headless browser (Playwright) for authentication and parallel odds scanner template traversal."
        },
        {
          ru: "Обнаружение прогрузов (падение коэффициентов), сбор live-статистики, сигналы в Telegram и VK.",
          en: "Coefficient drop detection, live stats collection, Telegram & VK signals."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/scaner_nb-bet" }
      ]
    },
    {
      id: "cfa-radar",
      title: { ru: "CFA Radar", en: "CFA Radar" },
      subtitle: {
        ru: "Сервис мониторинга активных выпусков ЦФА с калькулятором доходности",
        en: "Monitoring service for active CFA issuances with yield calculator"
      },
      role: { ru: "Автор и разработчик", en: "Creator & Developer" },
      period: "05.2025–09.2025",
      image: "/projects/cfa-radar.png",
      stack: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker", "cron"],
      tags: ["Fullstack", "Fintech/Data", "SSR/SEO", "DevOps"],
      bullets: [
        {
          ru: "Пайплайн данных: сбор → нормализация → БД с cron-планировщиком и retry.",
          en: "Data pipeline: collect → normalize → DB with cron scheduler and retry."
        },
        {
          ru: "SSR/SEO-структура страниц, карточки выпусков, фильтры/сортировки.",
          en: "SSR/SEO page structure, issuance cards, filters/sorting."
        },
        {
          ru: "Строгая типизация данных на TypeScript, модель под жизненный цикл выпусков.",
          en: "Strict TypeScript data typing, model for issuance lifecycle."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/cfa-radar" }
      ]
    },
    {
      id: "tokeon-site",
      title: { ru: "Токеон — официальный сайт", en: "Tokeon — Official Website" },
      subtitle: {
        ru: "Корпоративный сайт финтех-платформы для цифровых финансовых активов",
        en: "Corporate website for a fintech platform focused on digital financial assets"
      },
      role: { ru: "Frontend-разработчик (команда/прод)", en: "Frontend Developer (team/production)" },
      image: "/projects/tokeon-site.png",
      stack: ["TypeScript", "Nuxt/Vue (SSR)", "REST API", "HTML/CSS"],
      tags: ["Frontend", "SSR/SEO", "UI/UX"],
      bullets: [
        {
          ru: "SEO-миграции на SSR: редиректы, meta, canonical, sitemap/robots.",
          en: "SSR SEO migrations: redirects, meta, canonical, sitemap/robots."
        },
        {
          ru: "Перенос страниц с Tilda/legacy на единый фронтенд без потери позиций.",
          en: "Migrated sections from Tilda/legacy to unified frontend without losing rankings."
        },
        {
          ru: "Интеграция с API, прод-выкатки и post-release фиксы.",
          en: "API integration, production rollouts, and post-release fixes."
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
        ru: "Бот уведомлений с калькулятором доходности и ИИ-помощником",
        en: "Notification bot with yield calculator and AI assistant"
      },
      role: { ru: "Разработчик (в команде)", en: "Developer (team)" },
      period: "09.2024–01.2025",
      image: "/projects/tokeon-bot.png",
      stack: ["Node.js", "Telegraf", "PostgreSQL", "Docker"],
      tags: ["Backend", "Fullstack", "DevOps"],
      bullets: [
        {
          ru: "Сценарии, меню, уведомления, обработка ошибок и устойчивое поведение бота.",
          en: "Flows, menus, notifications, error handling, and bot reliability."
        },
        {
          ru: "PostgreSQL-хранение для уведомлений и истории действий.",
          en: "PostgreSQL storage for notifications and action history."
        },
        {
          ru: "Планировщик фоновых задач для автоматических проверок и рассылок.",
          en: "Background job scheduler for automated checks and outbound messages."
        }
      ],
      links: [
        { label: { ru: "Бот", en: "Bot" }, href: "https://t.me/tokeon_bot" }
      ]
    },
    {
      id: "limb",
      image: "/projects/limb.png",
      title: { ru: "Limb — игровая библиотека", en: "Limb — Game Library" },
      subtitle: {
        ru: "Next.js-проект с 2.5D turntable-спрайтами и управлением фреймами",
        en: "Next.js project with 2.5D turntable sprites and frame management"
      },
      role: { ru: "Автор и разработчик", en: "Creator & Developer" },
      period: "01–02.2026",
      stack: ["Next.js", "TypeScript", "2.5D Sprites", "Canvas"],
      tags: ["Frontend", "UI/UX"],
      bullets: [
        {
          ru: "2.5D turntable-рендеринг спрайтов с четырьмя направлениями движения.",
          en: "2.5D turntable sprite rendering with four movement directions."
        },
        {
          ru: "Автоматизация переименования и нормализации фреймов через CLI-скрипты.",
          en: "Automated frame renaming and normalization via CLI scripts."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/limb" }
      ]
    },
    {
      id: "demonslayer",
      title: { ru: "DemonSlayer — обучение React", en: "DemonSlayer — React Learning" },
      subtitle: {
        ru: "Интерактивная платформа для изучения React с ИИ-собеседованиями",
        en: "Interactive React learning platform with AI mock interviews"
      },
      role: { ru: "Автор и разработчик", en: "Creator & Developer" },
      image: "/projects/demon.png",
      stack: ["Next.js 14+", "TypeScript", "Tailwind CSS", "Prisma", "SQLite", "shadcn/ui", "framer-motion"],
      tags: ["Frontend", "UI/UX"],
      bullets: [
        {
          ru: "Структура учебного продукта под ключевые темы React/Frontend.",
          en: "Learning product structure around key React/Frontend topics."
        },
        {
          ru: "Локальная БД через Prisma + SQLite для хранения прогресса.",
          en: "Local database via Prisma + SQLite for progress tracking."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/demonslayer" }
      ]
    },
    {
      id: "art",
      title: { ru: "Art — сайт музыкальной группы", en: "Art — Music Band Website" },
      subtitle: {
        ru: "Промо-сайт с CMS, медиа и событиями",
        en: "Promo website with CMS, media, and events"
      },
      role: { ru: "Frontend-разработчик", en: "Frontend Developer" },
      image: "/projects/art.png",
      stack: ["Nuxt/Vue (SSR)", "TypeScript", "Strapi CMS"],
      tags: ["Frontend", "UI/UX"],
      bullets: [
        {
          ru: "Современный сайт на Nuxt/Vue: секции, анимации, адаптив.",
          en: "Modern Nuxt/Vue site: sections, motion, responsive layout."
        },
        {
          ru: "Интеграция Strapi как CMS для удобного управления контентом.",
          en: "Integrated Strapi CMS for easy content management."
        }
      ],
      links: [
        { label: { ru: "GitHub", en: "GitHub" }, href: "https://github.com/lacoming/art" }
      ]
    },
    {
      id: "terskarabian",
      title: { ru: "Терский конный завод", en: "Tersk Horse Stud" },
      subtitle: {
        ru: "Представительский сайт конного завода с каталогом",
        en: "Showcase website for a horse stud with catalog"
      },
      role: { ru: "Frontend-разработчик (проект)", en: "Frontend Developer (contract)" },
      period: "10.2024–04.2025",
      image: "/projects/tersk.png",
      stack: ["HTML5", "CSS3", "JavaScript", "Figma", "SEO"],
      tags: ["Frontend", "UI/UX", "SSR/SEO"],
      bullets: [
        {
          ru: "Сайт под ключ: адаптив, Pixel Perfect по Figma, кроссбраузерность.",
          en: "Turnkey site: responsive, pixel-perfect to Figma, cross-browser."
        },
        {
          ru: "Базовое SEO: структура, мета, оптимизация изображений.",
          en: "SEO basics: structure, meta, image optimization."
        }
      ],
      links: [
        { label: { ru: "Сайт", en: "Website" }, href: "https://terskarabian.com/" }
      ]
    }
  ] as Project[],

  skills: [
    {
      title: { ru: "Frontend", en: "Frontend" },
      items: ["TypeScript", "React / Next.js", "Vue 3 / Nuxt (SSR)", "Tailwind CSS", "HTML5/CSS3", "SVG/Canvas", "Responsive UI", "Accessibility"]
    },
    {
      title: { ru: "Backend & Data", en: "Backend & Data" },
      items: ["Node.js", "REST API", "GraphQL (Apollo)", "PostgreSQL", "SQLite", "Prisma", "Schedulers (cron)", "Data pipelines"]
    },
    {
      title: { ru: "Mobile", en: "Mobile" },
      items: ["Flutter / Dart", "Offline-first", "Cross-platform (Web + Desktop)"]
    },
    {
      title: { ru: "DevOps & Infra", en: "DevOps & Infra" },
      items: ["Docker", "Nginx", "CI/CD", "Supabase", "Vercel", "Production monitoring"]
    },
    {
      title: { ru: "AI & Автоматизация", en: "AI & Automation" },
      items: ["n8n workflows", "AI Agents", "Claude Code", "Prompt engineering", "AI-assisted development"]
    }
  ] as SkillGroup[],

  workflow: {
    title: { ru: "Как работаю", en: "How I work" } as I18nText,
    bullets: [
      {
        ru: "Формулирую задачу, ограничения и метрики успеха — потом делаю план и код.",
        en: "I define the task, constraints, and success metrics — then plan and code."
      },
      {
        ru: "AI-офис ускоряет рутину: ревью, тесты, документация — автоматизированы.",
        en: "My AI office handles routine: reviews, tests, docs — all automated."
      },
      {
        ru: "Думаю про прод: edge cases, мониторинг, поддерживаемость.",
        en: "Production-first thinking: edge cases, monitoring, maintainability."
      },
      {
        ru: "Всегда довожу до «готово»: lint/typecheck/build + UX-проверка + адаптив.",
        en: "I ship 'done': lint/typecheck/build + UX check + responsive."
      }
    ] as I18nText[]
  },

  ai: {
    title: { ru: "AI-офис", en: "AI Office" } as I18nText,
    intro: {
      ru: "Я построил собственный AI-офис — набор агентов и автоматизаций, которые работают на меня 24/7. Полноценная AI-инфраструктура, встроенная в рабочий процесс — от идеи до деплоя.",
      en: "I built my own AI office — a set of agents and automations working for me 24/7. This isn't just 'using ChatGPT' — it's a full infrastructure for accelerating development."
    } as I18nText,
    bullets: [
      {
        ru: "n8n-оркестратор: принимает задачи, парсит, маршрутизирует по воркерам, хранит состояние.",
        en: "n8n orchestrator: receives tasks, parses, routes to workers, stores state."
      },
      {
        ru: "Автоматический code review, поиск багов, генерация тестов и документации.",
        en: "Automated code review, bug hunting, test generation, and documentation."
      },
      {
        ru: "Прототипирование: от идеи до рабочего MVP за часы, не за недели.",
        en: "Prototyping: from idea to working MVP in hours, not weeks."
      }
    ] as I18nText[],
    tools: [
      { name: "Claude Code (Opus 4.6)", note: { ru: "Основной инструмент разработки, рефакторинг, архитектура", en: "Primary dev tool, refactoring, architecture" } },
      { name: "n8n Orchestrator", note: { ru: "AI-агенты, автоматизация рабочих процессов", en: "AI agents, workflow automation" } },
      { name: "Cursor", note: { ru: "Быстрые правки, навигация по кодовой базе", en: "Fast edits, codebase navigation" } },
      { name: "ChatGPT", note: { ru: "Планирование, ревью, генерация вариантов", en: "Planning, review, generating alternatives" } }
    ] as AITool[]
  },

  footerNote: {
    ru: "Открыт к предложениям: full-time / проектная работа / консультации.",
    en: "Open to opportunities: full-time / contract / consulting."
  } as I18nText
};
