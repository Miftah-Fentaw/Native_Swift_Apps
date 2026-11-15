# Native Swift Apps — Explore Hub

A React website that showcases every project in this repository — apps, screenshots, features, technology, the learning path and the roadmap — plus the hand-picked open-source community apps from the root README's **Explore More** list, and pages built for learning: guided tracks, real code patterns, a page per framework and platform, comparisons, a glossary and more.

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
| **Home** | Animated hero with scrolling screenshot columns, stats, a scroll-driven "pile to row" story, a tabbed library (Apps, Screens, Features, Technology, Roadmap), community apps by level, *Ask the hub* search, learning path, technology and a *Keep learning* grid |
| **Explore** (`#/explore`) | Every project and community app, with source (`?source=repo` or `?source=community`), level, platform, technology and planned filters plus search |
| **Project** (`#/projects/<slug>`) | Repo apps: screenshot gallery with lightbox, features, what you'll learn, run steps with copy buttons, code patterns and learning tracks. Community apps: author, repository, license, live star count, what you'll learn, setup notes and clone command |
| **Learn** (`#/learn`) | Guided learning tracks that order repo and community apps by topic, with what to look at in each step (`?t=<track>` deep links) |
| **Patterns** (`#/patterns`) | Code excerpts from the apps with syntax highlighting, the reasoning behind them, glossary terms and links to the exact lines on GitHub (`?p=<pattern>`, `?app=<slug>`) |
| **Topics** (`#/topics`, `#/topics/<slug>`) | A page for every platform and technology: apps, patterns, tracks, terms and what it's often used with |
| **Compare** (`#/compare?apps=a,b,c`) | Up to three apps side by side, with a shareable link |
| **Gallery** (`#/gallery`) | Every screenshot, filterable by app and light or dark, with arrow-key navigation in the lightbox |
| **Glossary** (`#/glossary`) | Swift, SwiftUI, data, concurrency, architecture and testing terms, with examples and the apps that use them |
| **Resources** (`#/resources`) | Hand-picked docs, courses, writing and tools |
| **Roadmap** (`#/roadmap`) | Shipped and planned apps by level, progress and how a new app lands |
| **Changelog** (`#/changelog`) | Releases, built from the root `CHANGELOG.md` |
| **FAQ** (`#/faq`), **About** (`#/about`), **Contribute** (`#/contribute`) | Searchable answers; principles, numbers and how community apps are picked; ways to help and a form that opens a pre-filled community app suggestion on GitHub |
| **Docs** (`#/docs`) | Quick start, repository structure, projects, community apps, every page on the site, adding a project, suggesting a community app, deploying, contributing, FAQ and credits |
| **404** | Unknown addresses show a page with links to the main sections |

Extras:
- **Navigation:** Explore, Learn, Patterns, Topics and Docs in the bar, and a **More** menu with every page (on phones: Explore and More).
- **Command palette:** ⌘K / Ctrl+K searches projects, community apps, pages, platforms, technologies, learning tracks, code patterns, glossary terms and features.
- **Light and dark themes:** follows the system and can be toggled in the header.
- **Reduced motion:** respects the system's reduced-motion setting.
- **Ask the hub:** runs entirely in the browser, as keyword search over the project and community app data. No AI service is called.
- **Animated footer:**
  - a scrolling technology ticker
  - a floating Swift logo that links to the repository
  - link columns
  - a wordmark that rises in letter by letter

## SEO

- **Meta tags:** title, description, keywords and canonical URL in `index.html`, with `author` and `creator` set to **Miftah Fentaw**.
- **Link previews:** Open Graph and Twitter card tags, using the repository banner as the preview image.
- **Generated from the data:** `scripts/seo.ts` runs at build time (and in `npm run dev`) and fills these placeholders in `index.html` from `src/data/projects.ts`:
  - `<!--seo:jsonld-->` — JSON-LD for the website, its author, the repository and an `ItemList` of every project and community app as `SoftwareSourceCode`
  - `<!--seo:noscript-->` — a plain list of links to every app, for crawlers that don't run JavaScript
  - `{{COMMUNITY_COUNT}}` in the meta descriptions — the number of community apps
- **Search engine files:** `public/robots.txt`, `public/sitemap.xml` and `public/site.webmanifest`.
- **Icons:** the favicon and Apple touch icon are `public/swift.jpeg`.
- **Per-page titles:** each page sets its own browser title and description.

## Where the content comes from

| What | Source |
| :--- | :--- |
| Project text, features and technology | [`src/data/projects.ts`](src/data/projects.ts), written from each project's README and code |
| Community apps | `community` in [`src/data/projects.ts`](src/data/projects.ts), written from each app's own README; icons are the owners' GitHub avatars and star counts come from shields.io |
| Learning tracks, glossary, topics, resources and FAQ | [`src/data/learn.ts`](src/data/learn.ts) |
| Code patterns | [`src/data/patterns.ts`](src/data/patterns.ts) holds titles, explanations and **anchors**; the code itself is cut from the Swift files at build time |
| Changelog page | `../CHANGELOG.md` |
| Every page's title, description and icon | [`src/data/pages.ts`](src/data/pages.ts), used by the More menu, footer, palette and home page |
| Icons | `../assets/` |
| Screenshots | `../<project>/screenshots/` |

`npm run dev` and `npm run build` first run `scripts/sync-assets.mjs`. It copies the icons and screenshots into `public/repo/` (ignored by Git), shrinking screenshots with macOS `sips` when it's available. The site always shows the same images as the READMEs.

### Content read from the repository at build time

`vite.config.ts` serves two virtual modules from [`scripts/repo-content.ts`](scripts/repo-content.ts):

- `virtual:pattern-code` — each pattern's Swift excerpt. A pattern names a file and the text on its first line (`from`); the excerpt runs to the line containing `to`, or to the end of the block that starts there. `docs: true` includes the `///` comments above, and `omit` replaces spans with `// …`. Unclosed blocks are closed automatically. **If an anchor isn't found, the build fails**, so a renamed function can't silently break an excerpt.
- `virtual:changelog` — the releases in `../CHANGELOG.md`, each written as `## YYYY-MM-DD — Title`, a summary paragraph and `### Added` / `### Changed` / `### Fixed` lists.

[`scripts/validate.ts`](scripts/validate.ts) also runs at the start of every build and dev server. It fails on any broken cross-reference: a track step, glossary entry or pattern that names an app, pattern, term or technology that doesn't exist.

## Adding a project

1. Add an entry to `projects` in `src/data/projects.ts`, and remove it from `roadmap` if it was planned.
2. Add its icon to `../assets/` and its screenshots to `../<folder>/screenshots/`.
3. If the folder is new, add it to the `sources` list in `scripts/sync-assets.mjs`.
4. Optionally add code patterns to `src/data/patterns.ts` and steps to the tracks in `src/data/learn.ts`. Every technology in its `tech` list needs an entry in `techInfo` in `learn.ts` — the build says so if one is missing.
5. Run `npm run readme` and add a release to `../CHANGELOG.md`.

## Adding a community app

1. Add an `external({ … })` entry to `community` in `src/data/projects.ts`: name, `owner/repo`, level, platforms, license (SPDX id, or `Custom`), tagline, description, technologies, what it teaches, and a `note` if it needs a key, server or other setup.
2. Regenerate the root README's generated sections from the same data (needs Node.js 22.18 or later):

   ```bash
   npm run readme
   ```

   `npm run readme -- --check` exits with an error if the README is out of date.

The website, its structured data and the README all update from that one entry.

## Generated README sections

`npm run readme` rewrites every block in the root README between `<!-- name:start -->` and `<!-- name:end -->` markers. Everything outside the markers is hand-written.

| Marker | Contents |
| :--- | :--- |
| `hub-stats` | The row of counts under the title |
| `feature-matrix` | Which technologies each repo app uses |
| `learning-tracks` | Every learning track and its path |
| `code-patterns` | Every code pattern, linked to the website |
| `site-pages` | Every page on the website |
| `explore-more` | The community app tables |

## Checks

| Command | What it does |
| :--- | :--- |
| `npm run typecheck` | Type-checks the site |
| `npm run check` | Checks the README is current, then type-checks, validates the data and pattern anchors, and builds |

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs the same checks on every pull request that touches the website, the README, the changelog or any Swift file. Dependabot ([`.github/dependabot.yml`](../.github/dependabot.yml)) proposes weekly npm updates and monthly GitHub Actions updates.

## Project structure

```
website/
├── index.html                  SEO meta tags and placeholders for generated SEO
├── public/                     Favicon (swift.jpeg), robots.txt, sitemap, manifest
├── scripts/
│   ├── sync-assets.mjs         Copies icons and screenshots from the repo
│   ├── seo.ts                  Builds JSON-LD and the no-JS page list (used by vite.config.ts)
│   ├── repo-content.ts         Cuts code excerpts from Swift files; parses CHANGELOG.md
│   ├── validate.ts             Fails the build on broken data references
│   └── readme.ts               Writes the generated sections of the root README
└── src/
    ├── main.tsx                Router, theme and ⌘K handling
    ├── styles.css              Design tokens (light + dark) and all styles
    ├── virtual.d.ts            Types for the build-time virtual modules
    ├── data/
    │   ├── projects.ts         Projects, community apps, roadmap, levels and search
    │   ├── learn.ts            Tracks, glossary, topics, resources and FAQ
    │   ├── patterns.ts         Code pattern explanations and source anchors
    │   └── pages.ts            Every page, for menus, footer and palette
    ├── components/             Nav and More menu, footer, cards, palette, code blocks, icons
    ├── sections/               Home page sections
    └── pages/                  One file per page
```

## Credits

Created by [Miftah Fentaw](https://github.com/Miftah-Fentaw). MIT licensed.
