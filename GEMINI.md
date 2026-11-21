# Refeir Marketplace Project Rules

## UI & Design Guidelines

### Strict Rule: No Sparkles or Sparks
- **NEVER use sparkles or sparks anywhere on the website.**
- **No Sparkle Icons**: Do not import or use `Sparkles`, `Sparkle`, or any variant from `lucide-react` or other icon sets.
- **No Sparkle Emojis**: Do not use sparkle emojis (`✨`) or unicode spark symbols.
- **No Sparkle Animations / CSS**: Do not create or use animations, particles, or class names referencing sparkles or sparks (e.g. `rf-sparkle-...`, `spark`, etc.).
- **Approved Alternatives**: Use clean, modern, professional icons such as `Compass`, `ShieldCheck`, `Award`, `TrendingUp`, `CheckCircle2`, `Zap`, `Search`, etc., that fit the high-trust Pan-African fintech & talent marketplace aesthetic.

### Strict Rule: Always Enforce Mobile Responsiveness
- **Check Every Adjustment**: Any UI, page, component, or CSS change MUST be checked for and made fully responsive across all mobile viewports, including `< 360px` (`320px–360px`), `<= 640px`, and `<= 960px`.
- **No Horizontal Overflow**: Never use unguarded fixed widths (`width`/`min-width` >= `280px`) without `max-width: 100%` or `min(100%, Npx)`. Keep `min-width: 0` on grid/flex children, avoid forced mobile `<br />` breaks, and keep modals/drawers within `calc(100vw - 1rem)`.
- **Fluid Mobile Type Scale**: Keep mobile headings and body copy proportional (`h1` `23–31px`, `h2` `19.5–26px`, `h3` `16–20px`, body `14–15.5px`, inputs `16px` to prevent iOS zoom).
