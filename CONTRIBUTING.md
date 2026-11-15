# Contributing to Native Swift Apps

Thanks for your interest in improving Native Swift Apps. Contributions of every size are welcome — fixing a typo, improving a project's README, resolving a bug, or proposing a new feature.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to Contribute

- **Report a bug** — open an issue using the *Bug report* template.
- **Suggest an improvement** — open an issue using the *Feature request* template.
- **Improve documentation** — clarify a project README, fix errors, or add missing setup notes. The *Documentation* issue template helps.
- **Submit code** — fix a bug or implement an agreed-upon improvement in one of the projects.
- **Suggest a community app** — recommend an open-source Swift app for the [Explore More](README.md#explore-more) list. See [Suggesting a Community App](#suggesting-a-community-app).

For larger changes, such as a new feature or significant refactor, please open an issue first so the approach can be discussed before you invest time in it.

## Repository Layout

Each application lives in its own top-level folder (for example `calculator/`) and is a self-contained Xcode project with its own README. Shared images used by the root README live in `assets/`.

Please keep changes scoped to the project you are working on.

## Development Setup

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/Native_Swift_Apps.git
   ```

2. Open the project folder you want to work on in Xcode.
3. Follow the requirements and setup steps in that project's README.

## Making Changes

1. Create a branch from `main`:

   ```bash
   git checkout -b fix/short-description
   ```

   Suggested prefixes: `fix/`, `feature/`, `docs/`, `refactor/`.

2. Make focused changes. One logical change per pull request is easiest to review.
3. Build and run the project on every platform it supports (listed in its README).
4. Run the project's tests in Xcode (**Product → Test**, or `⌘U`) and make sure they pass.
5. Update the project's README if your change affects features, requirements or setup.

## Suggesting a Community App

The [Explore More](README.md#explore-more) list links to open-source Swift apps by other developers. A good candidate:

- is written in Swift for an Apple platform, with its source on GitHub;
- has a clear open-source license;
- still builds with a recent Xcode, or is well worth reading as a reference;
- teaches something a learner can take away — a framework, a pattern or an architecture.

To suggest one, fill in the [form on the website](https://miftah-fentaw.github.io/Native_Swift_Apps/#/contribute), which opens a pre-filled issue for you, or open an issue with the *Community app suggestion* template. To add it yourself:

1. Add an entry to `community` in [`website/src/data/projects.ts`](website/src/data/projects.ts) with its name, `owner/repo`, level, platforms, license, tagline, description, technologies and what it teaches. Write the text from the app's own README.
2. Regenerate the README tables from that data (needs Node.js 22.18 or later):

   ```bash
   cd website && npm run readme
   ```

3. Open a pull request. Never copy another project's code or screenshots into this repository — link to them.

## Adding a New App

New apps are welcome, but please open a feature request first so the idea and scope can be agreed. Then:

1. Create a top-level folder with the Xcode project, unit and UI test targets.
2. Write its README from [`docs/PROJECT_README_TEMPLATE.md`](docs/PROJECT_README_TEMPLATE.md), with screenshots in `<folder>/screenshots/` and the icon in `assets/`.
3. Add it to `projects` in [`website/src/data/projects.ts`](website/src/data/projects.ts) (removing it from `roadmap`) and its screenshots folder to `website/scripts/sync-assets.mjs`.
4. Optionally add code patterns to [`website/src/data/patterns.ts`](website/src/data/patterns.ts) and steps to the learning tracks in [`website/src/data/learn.ts`](website/src/data/learn.ts).
5. Run `npm run readme` in `website/`, add a card to the root README's **The apps** section and a release to [`CHANGELOG.md`](CHANGELOG.md).

## Working on the Website

The explore hub in [`website/`](website/) is generated from data, so most changes are data changes:

| To change… | Edit |
| :--- | :--- |
| An app's text, features or technology | `website/src/data/projects.ts` |
| Learning tracks, glossary, topics, resources or FAQ | `website/src/data/learn.ts` |
| Code patterns | `website/src/data/patterns.ts` (anchors into the Swift source) |
| The Changelog page | [`CHANGELOG.md`](CHANGELOG.md) |

Code patterns point at Swift code by anchor text rather than copying it, and the build fails if an anchor can't be found — so if you rename or move Swift code that a pattern quotes, update its anchors. Before opening a pull request, run:

```bash
cd website && npm run check
```

This checks that the README's generated sections are current, type-checks the site, validates every cross-reference in the data and builds it. The same checks run in CI on every pull request.

## Code Style

- Follow the [Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/).
- Prefer SwiftUI and native Apple frameworks; avoid adding third-party dependencies unless they are clearly justified.
- Use clear, descriptive names and keep views small and composable.
- Match the existing structure and conventions of the project you are editing.
- Do not commit user-specific files such as `xcuserdata/`, `DerivedData/` or `.DS_Store` (these are covered by `.gitignore`).
- Never commit API keys, tokens or other secrets.

## Commit Messages

Write short, imperative commit messages that describe the change:

```
Fix rounding error in percentage calculation
Clarify setup steps in calculator README
```

## Pull Requests

1. Push your branch to your fork and open a pull request against `main`.
2. Fill in the pull request template, including which project is affected and how you tested it.
3. Add screenshots for any visual change.
4. Add a line to [`CHANGELOG.md`](CHANGELOG.md) for anything users would notice.
5. Be responsive to review feedback — small follow-up commits are fine.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
