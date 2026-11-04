# Sooraj M S — Editable Portfolio

Your original design, rebuilt as **React + TypeScript + Vite** with a built-in editor.
Everything on the page is data, so you can change it from the browser — no code.

## What you can edit (after logging in)

| Want to… | How |
|---|---|
| Change any text (headings, paragraphs, labels, nav brand, footer…) | Click it and type. It saves automatically. |
| Hero headline colour/line breaks | Wrap a word in `*stars*` for brass; press Enter for a new line |
| Bold text in paragraphs | Wrap in `**double stars**` |
| Add a whole new section (e.g. **Certificates**) | Bottom bar → **+ Add section** |
| Delete / reorder a section | Toolbar at the top-right of each section (↑ ↓ Delete) |
| Rename / hide a section in the top nav | Same toolbar → "Nav label" (empty = hidden) |
| Add / delete / reorder items (cards, projects, timeline entries, chips, stats, links…) | Hover an item → ↑ ↓ ✕ ; use the dashed **+ add** buttons |
| Add / replace / remove images | **Upload / Replace / Remove** buttons on the about photo, each project, and each card |
| Undo a mistake | Bottom bar → **↶ Undo** |
| See the site as visitors do | Bottom bar → **Preview** |
| Back up / restore | **Export** / **Import** (JSON) |

Open the editor with the small **Admin** link in the footer (or `Ctrl/Cmd + Shift + E`).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

With no config it runs in **local mode**: edits are stored in *this browser only* — great for trying it out.
To let edits go live for every visitor, connect Supabase (below).

## Go live with Supabase (free tier is enough)

1. Create a project at <https://supabase.com>.
2. **SQL Editor** → paste `supabase/schema.sql` → Run. (Creates the content table + public image bucket + security rules.)
3. **Authentication → Users → Add user** → create your email + password.
4. **Authentication → Providers → Email → turn OFF "Allow new users to sign up".**
   (Important: the rules let any logged-in user edit, so only you should exist.)
5. **Project Settings → API** → copy the *Project URL* and *anon public* key.
6. `cp .env.example .env` and fill in:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
7. `npm run dev`, click **Admin**, sign in. Edits now save to Supabase and appear for all visitors.

## Deploy

`npm run build` → upload the `dist/` folder to Vercel / Netlify / Cloudflare Pages.
Set the same two `VITE_…` variables in the host's environment settings.

## Project layout

```
src/
  types.ts            content model (all section types)
  defaultContent.ts   your original portfolio content
  storage.ts          Supabase (or localStorage) load/save, image upload, auth
  store.tsx           app state, autosave, undo, section actions
  App.tsx             nav, section router, edit bar, login, "add section" templates
  components/
    ui.tsx            Text (click-to-edit), Chips, ImageSlot, ItemBar, SectionBar…
    sections.tsx      Hero, About, Skills, Timeline, Projects, Education, Cards, Text, Contact
    Visuals.tsx       the original project SVG illustrations (used until you upload an image)
    effects.tsx       scroll progress, custom cursor, topographic hero background
  base.css            your original styles
  edit.css            editor-only styles
```

## Adding a brand-new kind of section later

1. Add an interface to `src/types.ts` and include it in the `Section` union.
2. Create a component in `components/sections.tsx` (copy `TextBlock` as a starting point).
3. Add a `case` in `SectionRenderer` and a template in `TEMPLATES` (both in `App.tsx`).

## Notes

- Local mode embeds images in browser storage (~5 MB limit). Images are auto-resized to ≤1600 px; for lots of images use Supabase.
- The original "fake smooth-scroll" wrapper was replaced with native smooth scrolling, because it breaks when content height changes while editing.
