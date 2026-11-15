<!--
  README template for a new app in Native Swift Apps.

  1. Copy this file to <folder>/README.md.
  2. Replace every <placeholder>, delete sections that don't apply and remove this comment.
  3. Keep the section order so every app's README reads the same way.

  Level badge colors: Beginner 34C759 · Intermediate FF9F0A · Advanced FF453A
-->

<p align="center">
  <img src="<Folder>/Assets.xcassets/AppIcon.appiconset/<icon>.png" width="112" height="112" alt="<App name> app icon">
</p>

<h1 align="center"><App name></h1>

<p align="center">
  <strong><One sentence: what the app does, for whom.></strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/<Level>-<color>?style=flat-square" alt="<Level>">
  <img src="https://img.shields.io/badge/Swift-F05138?style=flat-square&logo=swift&logoColor=white" alt="Swift">
  <img src="https://img.shields.io/badge/SwiftUI-0A84FF?style=flat-square&logo=swift&logoColor=white" alt="SwiftUI">
  <img src="https://img.shields.io/badge/iOS%20·%20iPadOS-27.2%2B-1C1C1E?style=flat-square&logo=apple&logoColor=white" alt="iOS and iPadOS 27.2+">
  <img src="https://img.shields.io/badge/Dependencies-None-8E8E93?style=flat-square" alt="No dependencies">
</p>

<p align="center">
  <a href="#overview">Overview</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#screenshots">Screenshots</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#features">Features</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#usage">Usage</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#getting-started">Getting Started</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#architecture">Architecture</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#testing">Testing</a>&nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#notes-and-limitations">Notes</a>
</p>

<p align="center">
  <sub><a href="../README.md">← Back to Native Swift Apps</a></sub>
</p>

<br>

## Overview

<Two or three sentences: what the app is, which level it is in Native Swift Apps, and what makes it worth reading.>

**What you'll learn**

- <Framework or technique, for example "Networking with URLSession and async/await">
- <…>

## Screenshots

<!-- Screenshots live in <folder>/screenshots/. Show light and dark where they differ. -->

<p align="center">
  <img src="screenshots/<file>.png" width="24%" alt="<Screen name>">
  <img src="screenshots/<file>.png" width="24%" alt="<Screen name>">
  <img src="screenshots/<file>.png" width="24%" alt="<Screen name>">
  <img src="screenshots/<file>.png" width="24%" alt="<Screen name>">
</p>

## Features

| Area | What it does |
| :--- | :--- |
| **<Screen or area>** | <Features, in a short phrase each> |

## Usage

| Where | Action | Result |
| :--- | :--- | :--- |
| <Screen> | <What the user does> | <What happens> |

## Getting Started

### Requirements

- Xcode with the iOS 27.2 SDK or later
- <Anything else: an API key, a device capability, a server. Say "None" if there's nothing.>

### Run it

```bash
git clone https://github.com/Miftah-Fentaw/Native_Swift_Apps.git
```

```bash
open Native_Swift_Apps/<folder>/<project>.xcodeproj
```

Choose an iPhone or iPad simulator and press **Run** (⌘R).

## Architecture

```
<folder>/
├── <App>App.swift          App entry point
├── Models/                 <What the models are>
├── Views/                  <How views are organized>
└── <Other folders>
```

- **State:** <Where app state lives and how views get it.>
- **Persistence:** <What is stored, where and how.>
- **<Other decision>:** <Why it is built this way.>

## Testing

| Target | Framework | What it covers |
| :--- | :--- | :--- |
| `<app>Tests` | Swift Testing | <What the unit tests check> |
| `<app>UITests` | XCTest | <What the UI tests check> |

Run all tests with **Product → Test** (⌘U).

## Notes and Limitations

- <Known limitation, data source credit or privacy note.>

<!--
  When the app lands, also:
  - add its icon to assets/ and a card to the root README's "The apps" section
  - add it to website/src/data/projects.ts (and remove it from `roadmap`)
  - add its screenshots folder to website/scripts/sync-assets.mjs
  - optionally add code patterns (website/src/data/patterns.ts) and track steps (website/src/data/learn.ts)
  - run `npm run readme` in website/, and add a release to CHANGELOG.md
-->
