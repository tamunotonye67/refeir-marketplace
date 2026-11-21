# Global Rule: Always Enforce Mobile Responsiveness

- **Check Every Adjustment on Mobile**: For any UI, layout, component, or styling change, always verify and ensure full responsiveness across all mobile viewports—especially **< 360px** (`320px–360px`), **<= 640px**, and **<= 960px** tablet breakpoints.
- **Zero Horizontal Bleed**: Never introduce fixed pixel widths (`width` or `min-width` >= `280px`) without `max-width: 100%` or `min(100%, Npx)`. Every grid/flex child that contains text or nested layouts must allow shrinking (`min-width: 0`).
- **Fluid Grids & Safe Wrapping**: Use `minmax(min(100%, Npx), 1fr)` for auto-fit grids, collapse multi-column layouts cleanly on mobile, avoid forced `<br />` line breaks on mobile (use `.rf-desktop-only` when desktop-only), and ensure modals/popovers fit within `calc(100vw - 1rem)`.
- **Orderly Mobile Typography**: Follow the fluid mobile type scale (`h1` `23–31px`, `h2` `19.5–26px`, `h3` `16–20px`, body `14–15.5px`, and `16px` on form inputs/textareas to prevent iOS Safari auto-zoom).
