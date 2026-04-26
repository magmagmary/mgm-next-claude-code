# CLAUDE.md

We are building the app described in the @SPEC.MD. Read that file for general architectural tasks or to doucble-check the exact database structure.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

keep your response extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.


whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure theat we're working with up-to-date information.
use the DocsExplorer subagnet for efficient documentation lookup.

@AGENTS.md

## Commands

```bash
pnpm dev        # start dev server (Next.js on port 3000)
pnpm build      # production build
pnpm lint       # run ESLint
```

No test runner is configured yet.

## Architecture

This is a note-taking web app — **magmag** — built with Next.js 16 App Router, TypeScript, TailwindCSS 4, and Bun as the runtime.

**Package manager:** pnpm (use `pnpm`, not `npm` or `yarn`)

### App structure

- `app/` — Next.js App Router root (no `src/` directory)
  - `layout.tsx` — root layout with Geist fonts
  - `page.tsx` — landing page (`/`)
  - `(auth)/login`, `(auth)/register` — auth pages (to be built)
  - `dashboard/` — notes list (to be built)
  - `notes/[id]/` — TipTap editor (to be built)
  - `p/[slug]/` — public read-only note view (to be built)
  - `api/notes/` — REST route handlers (to be built)
- `lib/db.ts` — Bun SQLite singleton + query helpers (to be built)
- `lib/notes.ts` — note repository functions (to be built)
- `components/` — shared UI components (to be built)

### Key dependencies

| Package | Purpose |
|---------|---------|
| `next@16.2.4` | Framework (breaking changes vs older versions — see AGENTS.md) |
| `better-auth` | Authentication (session management, email+password) |
| `@tiptap/starter-kit` | Rich text editor |
| `zod@^4` | Schema validation |
| TailwindCSS 4 | Styling (configured via PostCSS, no `tailwind.config.ts` needed) |
| Bun SQLite | Database — accessed via `Bun.Database`, NOT a Node.js driver |

### Database

SQLite file at `data/app.db`. Access via Bun's built-in SQLite (`import { Database } from "bun:sqlite"`), using raw SQL — no ORM. All note queries must scope by `user_id` to prevent cross-user access. See `SPEC.MD` for the full schema.

### Auth

better-auth handles sessions. Use `getCurrentUser()` / `getSession()` server-side to protect API routes and pages. Unauthenticated requests to `/api/notes/*` must return `401`.

### TipTap content

Notes store editor state as `JSON.stringify(editor.getJSON())` in `content_json`. Parse with `JSON.parse` when loading. Never use `dangerouslySetInnerHTML` with note content.

### Public sharing

Notes get a `public_slug` (16+ char `nanoid()`) when sharing is enabled. Public URL: `/p/[slug]`. When sharing is disabled, `is_public = 0` and `public_slug = NULL` — public URL returns 404.

## Reference

Full feature spec, data model, API design, and component breakdown: `SPEC.MD`
