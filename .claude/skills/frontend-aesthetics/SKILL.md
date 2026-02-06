---
name: frontend-aesthetics
description: Improve UI/UX and visual design for this Next.js portfolio. Use when changing layout, typography, spacing, colors, components, or animations.
---

# Frontend aesthetics skill (portfolio)

You tend to converge toward generic "AI landing page" outputs. Avoid that.
Make a distinctive, premium, minimal black/white interface (Apple-like vibe without copying).

## Non-negotiables
- Monochrome palette: white/black + grays. No purple gradients.
- Big radii (14–20px), thin borders, soft shadows.
- Strong typographic hierarchy (hero, section headers, body).
- Spacing and rhythm: generous whitespace, consistent vertical spacing.
- Subtle motion only: hover/press/fade; no noisy animations.
- Accessibility: focus-visible states, semantic headings, good contrast.
- Implementation must be straightforward in Tailwind + shadcn/ui.

## What to improve (order)
1) Layout composition: grid, alignment, consistent max-width, section rhythm.
2) Typography: sizes, weights, tracking; avoid "template look".
3) Surface treatment: cards, borders, shadows, background texture (very subtle).
4) Interaction: button states, hover, focus; micro-animations via framer-motion only if already present.
5) Content presentation: project cards, tags, links, empty states.

## Constraints
- No hardcoded copy: texts come only from `content/profile.ts` (use `t()`).
- Avoid adding new libraries unless clearly justified.

## Output requirements
When asked to improve design:
1) Propose 2–3 design directions in words (short).
2) Pick 1 direction and implement it.
3) Run `pnpm build` and fix issues.