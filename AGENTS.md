## Maintaining Documentation

When making changes to the project (new APIs, architectural changes, updated conventions):

- `AGENTS.md` - Update with technical details, architecture, and best practices for AI agents
- `README.md` - Update with user-facing documentation (about, usage, installation) for end users

## Frontend Conventions

- Styling uses UnoCSS with the theme in `unocss.config.ts` and palette variables in `src/assets/base.css`.
- UI is dark-only. Favor Tailwind `neutral` tokens from preset Wind4.
- Design stays minimal: lowercase labels, simple lists, soft rounding, no gradients, no marketing copy.
- Layouts prioritize content with modest spacing and restrained borders/shadows.
- VueUse powers interactive helpers like clipboard handling and timestamps.
- Install dependencies with `pnpm add <package>` or `pnpm install`; do not edit `package.json` manually for dependency changes.
- Use conventional commits with no commit body.
