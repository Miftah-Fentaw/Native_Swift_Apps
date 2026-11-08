<p align="center">
  <img src="assets/banner.png" alt="Native Swift Apps — Build. Learn. Explore." width="100%">
</p>

<h1 align="center">Native Swift Apps</h1>

<p align="center">
  <strong>Build. Learn. Explore.</strong>
</p>

<p align="center">
  An open-source collection of native Swift and SwiftUI applications for Apple platforms,<br>
  built to help developers learn Apple development through practical projects.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Swift-F05138?style=flat-square&logo=swift&logoColor=white" alt="Swift">
  <img src="https://img.shields.io/badge/SwiftUI-0A84FF?style=flat-square&logo=swift&logoColor=white" alt="SwiftUI">
  <img src="https://img.shields.io/badge/iOS%20·%20iPadOS-000000?style=flat-square&logo=apple&logoColor=white" alt="iOS and iPadOS">
  <img src="https://img.shields.io/badge/Open%20Source-30D158?style=flat-square&logo=github&logoColor=white" alt="Open Source">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-8E8E93?style=flat-square" alt="MIT License"></a>
</p>

<p align="center">
  <a href="#overview">Overview</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#projects">Projects</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#roadmap">Roadmap</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#technology">Technology</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#getting-started">Getting Started</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#contributing">Contributing</a>
</p>

<br>

## Overview

Native Swift Apps is a growing collection of self-contained apps built with Swift and SwiftUI. Each project is a complete Xcode project with its own README, so you can learn by reading, running and extending working code.

- **Purpose** — Turn Apple platform concepts into practical, hands-on projects.
- **Audience** — Developers new to Swift, developers moving to Apple platforms from web or Android, and experienced engineers exploring specific frameworks.
- **Focus** — Native Apple development only: Swift, SwiftUI and first-party frameworks, with no third-party dependencies unless a project needs them.

Projects are grouped by difficulty — **Beginner**, **Intermediate** and **Advanced** — so you can start where you are and move up at your own pace.

<br>

## Projects

<table>
  <tr>
    <td width="72" align="center"><a href="calculator/"><img src="assets/calculator.jpg" width="56" height="56" alt="SwiftCalc icon"></a></td>
    <td>
      <a href="calculator/"><strong>SwiftCalc</strong></a><br>
      <sub>A calculator, tip splitter and unit converter in one app, with scientific functions, history and light and dark themes.</sub><br>
      <img src="https://img.shields.io/badge/Beginner-34C759?style=flat-square" alt="Beginner">
      <img src="https://img.shields.io/badge/iOS%20·%20iPadOS%2027.2%2B-1C1C1E?style=flat-square&logo=apple&logoColor=white" alt="iOS and iPadOS 27.2+">
    </td>
    <td width="96" align="right"><a href="calculator/README.md"><sub>README&nbsp;→</sub></a></td>
  </tr>
</table>

<sub>SwiftCalc covers SwiftUI layout, <code>@Observable</code> state, <code>@AppStorage</code> settings, a hand-written expression parser, Foundation's <code>Measurement</code> units and Swift Testing.</sub>

<br>

## Roadmap

These projects are planned and **not yet in the repository**. Names and scope may change; each will get its own folder and README when it lands.

<table>
  <tr>
    <th width="33%" align="left">
      <img src="https://img.shields.io/badge/Beginner-34C759?style=flat-square" alt="Beginner"><br>
      <sub>SwiftUI fundamentals · Layouts · State</sub>
    </th>
    <th width="33%" align="left">
      <img src="https://img.shields.io/badge/Intermediate-FF9F0A?style=flat-square" alt="Intermediate"><br>
      <sub>Persistence · Networking · Native frameworks</sub>
    </th>
    <th width="33%" align="left">
      <img src="https://img.shields.io/badge/Advanced-FF453A?style=flat-square" alt="Advanced"><br>
      <sub>Concurrency · Multimedia · Architecture</sub>
    </th>
  </tr>
  <tr>
    <td valign="top">
      <b>TaskFlow</b><br><sub>Task management</sub><br><br>
      <b>QuickNotes</b><br><sub>Notes and organization</sub><br><br>
      <b>FocusTimer</b><br><sub>Pomodoro timer</sub><br><br>
      <b>Weatherly</b><br><sub>Weather and forecasts</sub>
    </td>
    <td valign="top">
      <b>Spendly</b><br><sub>Expense tracking</sub><br><br>
      <b>HabitKit</b><br><sub>Habit tracking</sub><br><br>
      <b>QRStudio</b><br><sub>QR scanner and generator</sub><br><br>
      <b>VaultKey</b><br><sub>Local password manager</sub><br><br>
      <b>Markdown Studio</b><br><sub>Markdown editor with live preview</sub>
    </td>
    <td valign="top">
      <b>SwiftChat</b><br><sub>AI chat</sub><br><br>
      <b>PixelLab</b><br><sub>Image editing</sub><br><br>
      <b>AudioWave</b><br><sub>Music player and visualizer</sub><br><br>
      <b>FileNest</b><br><sub>File management</sub><br><br>
      <b>Bookly</b><br><sub>Appointment booking</sub>
    </td>
  </tr>
</table>

<br>

## Technology

What the projects in this repository use today:

| Technology | Used for |
| :--- | :--- |
| **Swift** | All app and test code |
| **SwiftUI** | User interfaces |
| **Observation** | `@Observable` app state |
| **Foundation** | Formatting, `Measurement` unit conversion, `UserDefaults` storage, JSON coding |
| **Swift Testing** | Unit tests |
| **XCTest** | UI and launch tests |

Each project's README lists its exact requirements. New frameworks will be added here as projects that use them are added.

<br>

## Getting Started

Clone the repository, then open a project folder in Xcode.

```bash
git clone https://github.com/Miftah-Fentaw/Native_Swift_Apps.git
```

Each project's README covers its requirements, setup, features and architecture. Start with [SwiftCalc](calculator/README.md).

<br>

## Contributing

Contributions are welcome — bug fixes, improvements, documentation and new ideas alike.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) before opening an issue or pull request. To report a security issue, follow the [Security Policy](SECURITY.md).

<br>

## License

This repository is released under the [MIT License](LICENSE).

<br>

---

<p align="center">
  <strong>Native Swift Apps</strong> — Build. Learn. Explore.<br>
  <sub>Explore the projects, contribute, and star the repository if it helps you learn.</sub>
</p>
