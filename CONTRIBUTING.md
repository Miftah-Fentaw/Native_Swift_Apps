# Contributing to Native Swift Apps

Thanks for your interest in improving Native Swift Apps. Contributions of every size are welcome — fixing a typo, improving a project's README, resolving a bug, or proposing a new feature.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to Contribute

- **Report a bug** — open an issue using the *Bug report* template.
- **Suggest an improvement** — open an issue using the *Feature request* template.
- **Improve documentation** — clarify a project README, fix errors, or add missing setup notes.
- **Submit code** — fix a bug or implement an agreed-upon improvement in one of the projects.

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
4. Be responsive to review feedback — small follow-up commits are fine.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
