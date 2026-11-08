# Native Swift Apps — Explore Hub

A React website that showcases every project in this repository: apps, screenshots, features, technology, the learning path and the roadmap.

Built with **React 19**, **Vite**, **TypeScript**, **React Router** and **Motion** for animations. No backend — everything is static.

## Run it

Requires Node.js 20 or later.

```bash
cd website
```

```bash
npm install
```

```bash
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build a static site into `dist/`:

```bash
npm run build
```

The build uses relative paths and hash routing, so `dist/` can be hosted anywhere, including GitHub Pages.

## Deploy to GitHub Pages

The workflow [`.github/workflows/deploy-website.yml`](../.github/workflows/deploy-website.yml) builds this folder and publishes it. It runs on every push to `main` that changes the site, icons or screenshots, and can also be started by hand from the **Actions** tab.

One-time setup: in the repository on GitHub, go to **Settings → Pages** and set **Source** to **GitHub Actions**.

The site is then served at **https://miftah-fentaw.github.io/Native_Swift_Apps/**.

What makes it work on Pages:
- **Paths:** relative asset paths (`base: './'`) and hash routing (`#/explore`). Refreshing any page works, with no `404.html` trick.
- **Images:** screenshots are shrunk during the build, with ImageMagick on GitHub's runners or `sips` on a Mac.
- **Caching:** React and Motion ship as separate vendor chunks, and secondary pages load only when visited.

## What's on the site

| Page | Contents |
| :--- | :--- |
| **Home** | Animated hero with scrolling screenshot columns, stats, a scroll-driven "pile to row" story, a tabbed library (Apps, Screens, Features, Technology, Roadmap), *Ask the hub* search, learning path and clone command |
| **Explore** (`#/explore`) | All projects with level, technology and planned filters plus search |
| **Project** (`#/projects/<slug>`) | Screenshot gallery with lightbox, features, what you'll learn, run steps with copy buttons, links to GitHub |
| **Docs** (`#/docs`) | Quick start, repository structure, projects, using the site, adding a project, deploying, contributing, FAQ and credits, with a sidebar that tracks the section you're reading |

Extras:
- **Command palette:** ⌘K / Ctrl+K searches projects, features and technology.
- **Light and dark themes:** follows the system and can be toggled in the header.
- **Reduced motion:** respects the system's reduced-motion setting.
- **Ask the hub:** runs entirely in the browser, as keyword search over the project data. No AI service is called.
- **Animated footer:**
  - a scrolling technology ticker
  - a floating Swift logo that links to the repository
  - link columns
  - a wordmark that rises in letter by letter

## SEO

- **Meta tags:** title, description, keywords and canonical URL in `index.html`, with `author` and `creator` set to **Miftah Fentaw**.
- **Link previews:** Open Graph and Twitter card tags, using the repository banner as the preview image.
- **Structured data:** JSON-LD describing the website, the source code repository and its author.
- **Search engine files:** `public/robots.txt`, `public/sitemap.xml` and `public/site.webmanifest`.
- **Icons:** the favicon and Apple touch icon are `public/swift.jpeg`.
- **Per-page titles:** each page sets its own browser title and description.

## Where the content comes from

| What | Source |
| :--- | :--- |
| Project text, features and technology | [`src/data/projects.ts`](src/data/projects.ts), written from each project's README and code |
| Icons | `../assets/` |
| Screenshots | `../<project>/screenshots/` |

`npm run dev` and `npm run build` first run `scripts/sync-assets.mjs`. It copies the icons and screenshots into `public/repo/` (ignored by Git), shrinking screenshots with macOS `sips` when it's available. The site always shows the same images as the READMEs.

## Adding a project

1. Add an entry to `projects` in `src/data/projects.ts`, and remove it from `roadmap` if it was planned.
2. Add its icon to `../assets/` and its screenshots to `../<folder>/screenshots/`.
3. If the folder is new, add it to the `sources` list in `scripts/sync-assets.mjs`.

## Project structure

```
website/
├── index.html                  SEO meta tags and structured data
├── public/                     Favicon (swift.jpeg), robots.txt, sitemap, manifest
├── scripts/sync-assets.mjs     Copies icons and screenshots from the repo
└── src/
    ├── main.tsx                Router, theme and ⌘K handling
    ├── styles.css              Design tokens (light + dark) and all styles
    ├── data/projects.ts        Projects, roadmap, levels and search
    ├── components/             Nav, footer, cards, palette, shared UI
    ├── sections/               Home page sections
    └── pages/                  Home, Explore, Project and Docs pages
```

## Credits

Created by [Miftah Fentaw](https://github.com/Miftah-Fentaw). MIT licensed.
