# Changelog

Notable changes to Native Swift Apps: new apps, new pages on the explore hub and changes to how the repository works. The [Changelog page](https://miftah-fentaw.github.io/Native_Swift_Apps/#/changelog) on the website is built from this file.

Each release is a `## YYYY-MM-DD — Title` heading, a one-paragraph summary, then `### Added`, `### Changed` or `### Fixed` lists.

## 2026-11-15 — Learning pages

The explore hub grows from four pages to more than a dozen, built around learning from the code: guided tracks, real excerpts from the apps, a page for every framework and platform, and side-by-side comparisons.

### Added
- **Learn:** guided learning tracks that order the repository's apps and the community apps from first step to advanced, with what to look at in each.
- **Patterns:** code patterns from SwiftCalc, Weather and Journal, cut from the Swift source at build time so they always match the repository.
- **Topics:** a page for every framework and platform, listing the apps, patterns and glossary terms for it.
- **Compare:** up to three apps side by side, with level, platforms, license, technology and what each teaches.
- **Gallery:** every screenshot, filterable by app and appearance, with keyboard navigation in the lightbox.
- **Glossary**, **Resources**, **Roadmap**, **FAQ**, **About**, **Contribute** and **Changelog** pages, plus a page for broken links.
- A form on the Contribute page that opens a pre-filled community app suggestion on GitHub.
- A **More** menu in the navigation, new footer links and new command palette groups for pages, patterns, topics and glossary terms.
- A continuous integration workflow that type-checks and builds the website and checks the README on every pull request.
- Dependabot updates for the website's npm packages and the GitHub Actions workflows.
- `.editorconfig`, a project README template in `docs/` and a documentation issue template.

### Changed
- The root README now shows screenshots, a learning path diagram, a feature matrix and a repository map.
- Technology tags link to their topic pages instead of the explore filter.
- Project pages link to the app's code patterns, learning tracks and the compare page.
- The deploy workflow also runs when Swift source changes, so code excerpts stay current.
- Journal's data now lists UserNotifications, Foundation and XCTest, matching its code and README.
- On phones, the navigation shows Explore and the More menu.

### Fixed
- Opening a page after scrolling a long one no longer leaves the new page scrolled to its footer.
- Unknown addresses show a "page not found" page instead of the home page.

## 2026-11-14 — Community apps

Thirty hand-picked open-source Swift apps by other developers join the hub, sorted by the same levels as the apps in this repository.

### Added
- **Community apps** on the website: project pages with author, repository, license, live star count, what you'll learn and setup notes.
- Source and platform filters on the Explore page, and a community section and search on the home page.
- The **Explore More** list in the root README, generated from the website's data by `npm run readme`.
- JSON-LD structured data and a no-JavaScript project list, generated at build time.
- An issue template for suggesting a community app.

### Changed
- The deploy workflow checks that the README lists the same community apps as the website.

## 2026-11-08 — Journal and the explore hub

The third app, Journal, lands alongside the explore hub website.

### Added
- **Journal:** a private journal with moods, checklists, photos, a calendar, insights, onboarding and a biometric lock, built with SwiftData and Swift Charts.
- **Explore hub website** in `website/`: home, explore, project and docs pages, a command palette, light and dark themes and a GitHub Pages deploy workflow.
- Journal screenshots in its README and on the website.

## 2026-11-08 — Weather

### Added
- **Weather:** live conditions, hourly, daily and 14-day forecasts, air quality and a map, powered by the free Open-Meteo APIs.
- Weather screenshots and README.

## 2026-11-08 — SwiftCalc and the repository

### Added
- **SwiftCalc:** a standard and scientific calculator with history, a tip splitter and an eight-category unit converter, with Swift Testing unit tests.
- MIT license, contributing guide, code of conduct, security policy, and issue and pull request templates.
- The repository banner and the root README.
