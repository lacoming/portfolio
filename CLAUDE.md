# Portfolio (RU/EN) — Claude Code Rules

## Goal
Build a modern minimal personal portfolio / business card site for a **Full-stack Developer**.
Style: **black/white**, premium, lots of whitespace, **rounded corners (14–20px)**, subtle shadows, subtle motion.
**Apple-like feel without copying** Apple visuals/components.

## Tech Stack (must)
- Next.js **14+** (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- next-intl with locale routes: **/ru** and **/en** (default: /ru)

## Content Source (hard rule)
- **All texts and data come ONLY from `content/profile.ts`**.
- `I18nText` shape: `{ ru: string; en: string }`.
- No hardcoded copy in components (except tiny UI words like “RU/EN” on the switcher if needed).
- Projects, highlights, skills, workflow, AI section: all from `profile.ts`.

## i18n (hard rule)
- Use next-intl with route segments `/ru` and `/en`.
- Implement a helper: `t(text: I18nText, locale) => string`.
- Do **NOT** store content translations in JSON dictionaries if the content already exists in `profile.ts`.
  (Dictionaries are allowed only for micro UI labels if strictly necessary.)

## UI / Design Rules
- Palette: monochrome (white/black + grays).  
- Accent color: allowed **very sparingly** for interactive states only (links/hover/active). Keep it subtle.
- Radius: 14–20px on cards/controls.
- Borders: thin, low-contrast.
- Shadows: soft, minimal.
- Typography: clear hierarchy (Hero / section titles / body).
- Motion: subtle hover/press/fade; avoid heavy animations and noisy effects.

## Performance & Architecture
- Minimize client components — prefer Server Components by default.
- Avoid unnecessary libraries. Use built-in Next features where possible.
- Keep components small and reusable. Prefer simple composition.
- Use `next/font` for fonts (no external blocking fonts).
- Images: use `next/image` when appropriate.

## Accessibility (must)
- Semantic headings (one H1).
- Keyboard navigation works everywhere.
- Visible focus states (`focus-visible`).
- Proper `aria-label` for icon buttons/links.
- Contrast must be acceptable (no ultra-light gray text).

## Quality Gates (must run)
After any meaningful change, run:
- `pnpm lint`
- `pnpm typecheck` (or `pnpm -s typecheck` if configured)
- `pnpm build`

Fix errors/warnings before moving on.

## Output Format (how you work)
When you start a task:
1) Brief plan (5–10 bullets max)
2) Make code changes
3) Report what changed + commands run + result

Do not dump huge explanations. Prefer clear, practical steps.

## Do / Don’t
**Do**
- Keep UI minimal and “expensive”.
- Use `content/profile.ts` as the single source of truth.
- Keep code strict and typed.
- Check build/lint often.

**Don’t**
- Don’t hardcode portfolio texts in JSX.
- Don’t add heavy animation frameworks beyond what is needed.
- Don’t introduce new styling systems (only Tailwind + shadcn/ui).
- Don’t over-design or use many colors.

## Project Structure
- `app/` — routes, layout, pages
- `components/` — UI and sections (Hero, Projects, etc.)
- `content/profile.ts` — all portfolio content (RU/EN)
- `lib/` — helpers (e.g., `t()`), utilities
- `styles/` — globals if needed
- `public/` — images, icons, OG assets
- `docs/` — notes, copy drafts, checklists