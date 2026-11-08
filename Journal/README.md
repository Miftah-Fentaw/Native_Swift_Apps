<p align="center">
  <img src="Journal/Assets.xcassets/AppIcon.appiconset/journal.png" width="112" height="112" alt="Journal app icon">
</p>

<h1 align="center">Journal</h1>

<p align="center">
  <strong>A private journal for thoughts, checklists and photos, with moods, a calendar and writing insights.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Intermediate-FF9F0A?style=flat-square" alt="Intermediate">
  <img src="https://img.shields.io/badge/Swift-F05138?style=flat-square&logo=swift&logoColor=white" alt="Swift">
  <img src="https://img.shields.io/badge/SwiftUI-0A84FF?style=flat-square&logo=swift&logoColor=white" alt="SwiftUI">
  <img src="https://img.shields.io/badge/iOS%20·%20iPadOS-27.2%2B-1C1C1E?style=flat-square&logo=apple&logoColor=white" alt="iOS and iPadOS 27.2+">
  <img src="https://img.shields.io/badge/Dependencies-None-8E8E93?style=flat-square" alt="No dependencies">
</p>

<p align="center">
  <a href="#overview">Overview</a>&nbsp;&nbsp;·&nbsp;&nbsp;
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

Journal is the first **Intermediate** project in [Native Swift Apps](../README.md). It is a SwiftUI journal that stays on the device. Entries can mix free text, a checklist and a photo, and the app tracks mood, streaks and writing habits.

| Tab | What it shows |
| :--- | :--- |
| **Journal** | Greeting, daily prompt and a masonry feed of entries |
| **Calendar** | Month grid of writing days, and the entries for the selected day |
| **Insights** | Streak, word count, mood trend and top tags |
| **Settings** | Profile, appearance, reminder, lock and export |
| **Search** | Search across titles, text, checklist items and tags |

The app uses Swift, SwiftUI and first-party frameworks only: SwiftData, Swift Charts, PhotosUI, LocalAuthentication and UserNotifications. There are no third-party packages.

**What you'll learn:** modeling data with SwiftData, querying it with `@Query`, drawing charts, picking and compressing photos, locking the app with Face ID or a passcode, and building a custom masonry layout.

<br>

## Features

### Entries

- **Text, checklist and photo** in one entry, plus a title, date, mood and card color.
- **Six moods:** Joyful, Happy, Calm, Tired, Sad and Anxious. Each has an emoji and a score used by the mood chart.
- **Seven card colors:** peach, lemon, sky, sand, mint, lavender and rose.
- **Tags, favorites and bookmarks.**
- **Save is explicit.** The editor keeps changes in local state until you tap Save, so Cancel discards them.
- A new entry needs a title, some writing, a checklist item, or a photo.

### Home

- Greeting with your name and profile photo. Tap either one to open Profile.
- Filters for All, Favorites, Bookmarked, Checklists and Photos.
- Sort by newest, oldest, or recently edited.
- A daily writing prompt, with a button to shuffle to another prompt and start an entry from it.
- Entries laid out in a two-column masonry grid.
- A button to write a new entry.

### Calendar

- Month grid. Days with entries are marked, and you can move between months.
- The selected day's entries are listed underneath.
- Write a new entry for the selected day. The editor keeps the current time of day and uses that date.

### Insights

- Current streak and longest streak. A streak counts consecutive days with at least one entry, and it still counts if you have not written yet today.
- Totals for entries, words written and checklist tasks completed.
- Entries written this week, compared with the weekly goal from Profile.
- Mood trend for 7, 14 or 30 days, drawn with Swift Charts. Drag across the chart to read a day.
- Mood breakdown and the tags you use most.

### Search

- Matches titles, entry text, checklist items and tags.
- Optional filter for a single mood.
- Opens the matching entry.

### Entry detail

- Read the entry on its card color, including the photo, tags and checklist.
- Tick checklist items, add a new item, or delete one.
- Favorite, bookmark, recolor, share, edit or delete the entry.
- Add or remove the photo.

### Profile

- Name, short bio and profile photo.
- Stats for your writing days, current streak and entries this week.
- A weekly writing goal, from 1 to 7 days.
- Reset the profile photo, name and bio.

### Settings

- System, light or dark appearance.
- Daily reminder at a time you choose. The default is 9:00 PM. The app asks for notification permission when you turn it on.
- Lock with Face ID (or the device passcode).
- Export every entry as plain text and share it.
- Add the sample entries again, or erase every entry after a confirmation.
- Show the welcome screen again.

### Onboarding

The first launch walks through three pages — a place to think, checklists, and mood tracking — then asks for your name. Sample entries are added once, so erasing the journal later does not bring them back.

<br>

## Usage

| Where | Action | Result |
| :--- | :--- | :--- |
| Home | Tap your photo or greeting | Opens Profile |
| Home | Tap a filter chip | Shows favorites, bookmarks, checklists or photos |
| Home | Tap the sort control | Newest, oldest, or recently edited |
| Home | Tap **Start writing** on the prompt | Opens a new entry with that prompt |
| Home | Tap the new-entry button | Opens a blank entry |
| Home | Tap a card | Opens that entry |
| Calendar | Tap a day | Lists that day's entries |
| Calendar | Tap **Write** | New entry filed on the selected day |
| Insights | Tap **7D**, **14D** or **30D** | Changes the mood trend range |
| Search | Type, or tap a mood | Filters entries |
| Entry | Tap the heart or bookmark | Favorites or bookmarks the entry |
| Entry | Tap a checklist row | Marks that item done or not done |
| Settings | Turn on **Lock with Face ID** | Asks for Face ID or a passcode the next time the app opens |
| Settings | Turn on **Daily reminder** | Schedules a local notification |

Leaving the app re-locks it when the lock is on. If the device has no biometrics and no passcode, the lock does not trap you outside the journal.

<br>

## Getting Started

### Requirements

| | |
| :--- | :--- |
| **Xcode** | A version that includes the iOS 27.2 SDK |
| **Platform** | iOS / iPadOS 27.2 or later (iPhone and iPad) |
| **Dependencies** | None. No account or API key. |

### Run the app

1. Clone the repository and move into this project:

   ```bash
   git clone https://github.com/Miftah-Fentaw/Native_Swift_Apps.git
   ```

   ```bash
   cd Native_Swift_Apps/Journal
   ```

2. Open the project in Xcode:

   ```bash
   open Journal.xcodeproj
   ```

3. Select the **Journal** scheme and an iPhone or iPad simulator.
4. Press **Run** (`⌘R`).

The welcome flow runs on first launch. After that, the home feed includes a set of sample entries you can edit or delete.

To run on a physical device, choose your own development team under **Signing & Capabilities** for the `Journal` target. Face ID works in the simulator from **Features → Face ID**.

<br>

## Architecture

```
Journal/
├── Journal/
│   ├── JournalApp.swift              App entry; creates the SwiftData container
│   ├── ContentView.swift             Onboarding, lock screen, tabs
│   ├── Models/
│   │   ├── JournalEntry.swift        SwiftData entry, checklist items, photo
│   │   ├── Mood.swift                Moods, emoji and chart scores
│   │   ├── JournalStats.swift        Streaks, weekly count, top mood
│   │   └── SampleData.swift          Entries inserted once on first launch
│   ├── Theme/
│   │   └── Theme.swift               Card colors, appearance, shared buttons
│   └── Views/
│       ├── Home/                     Feed, entry cards, masonry layout
│       ├── Editor/EntryEditorView.swift
│       ├── Detail/EntryDetailView.swift
│       ├── Calendar/CalendarView.swift
│       ├── Insights/InsightsView.swift
│       ├── Search/SearchView.swift
│       ├── Profile/ProfileView.swift
│       ├── Settings/SettingsView.swift
│       ├── Onboarding/OnboardingView.swift
│       └── Components/               Avatar, empty state, daily prompt
├── JournalTests/                     Unit test target
└── JournalUITests/                   UI and launch tests
```

### How it fits together

- **`JournalEntry`** is a SwiftData `@Model`. The checklist and tags are stored as arrays of `Codable` values. Photo bytes use `@Attribute(.externalStorage)`, so a large image is kept beside the database instead of inside every row.
- **`JournalApp`** attaches one `modelContainer` for `JournalEntry`. Views read it with `@Query` and `@Environment(\.modelContext)`.
- **`JournalStats`** is shared by Insights and Profile. Streaks are calendar days with at least one entry. The current streak still includes yesterday if you have not written yet today.
- **Mood scores** run from 1 (sad) to 5 (joyful). Insights averages them per day and charts that average.
- **Photos** from PhotosUI are resized before they are saved. Profile photos are capped around 400 pixels on the long side; entry photos around 1600.
- **Preferences** live in `UserDefaults` through `@AppStorage`: name, bio, avatar, weekly goal, appearance, lock, reminder time, and whether onboarding and sample data have already run.
- **The lock** uses `LAContext` with `.deviceOwnerAuthentication`, so Face ID, Touch ID, or the device passcode can unlock it. The app locks again when the scene moves to the background.
- **The reminder** is one local notification, identifier `daily-journal-reminder`, rescheduled whenever the toggle or the time changes.
- **Export** builds a plain-text document (title, date, mood, body, checklist, tags) and shares it with `ShareLink`. Nothing is uploaded.

<br>

## Testing

Run tests in Xcode with **Product → Test** (`⌘U`).

| Target | Framework | Status |
| :--- | :--- | :--- |
| `JournalTests` | XCTest | Xcode template only, no app-specific tests yet |
| `JournalUITests` | XCTest | App launch and launch performance |

Good first contributions here: unit tests for `JournalStats` streaks, `Mood.score`, and the entry's `wordCount` and checklist toggle.

<br>

## Notes and Limitations

- **On this device only.** Entries, photos and profile details are not synced and are not sent to a server.
- **Erasing entries** deletes every `JournalEntry`. It does not clear your name, photo, or other settings. Profile has its own reset for those.
- **Sample entries** are inserted only the first time the app launches. Settings can add them again on purpose.
- **The editor** is shown in light appearance so the pastel card stays readable while you write. The rest of the app follows the appearance you pick in Settings.
- **Notifications** stay on the device. If permission is denied, the reminder toggle turns back off.
- **Screenshots** for this app are not in the repository yet.
- **Platforms:** iPhone and iPad only.

<br>

## Contributing

Improvements are welcome. Please read the [contribution guide](../CONTRIBUTING.md) before opening a pull request, and keep changes inside the `Journal/` folder.

## License

Released under the [MIT License](../LICENSE) as part of Native Swift Apps.

<br>

---

<p align="center">
  <sub>Part of <a href="../README.md"><strong>Native Swift Apps</strong></a> — Build. Learn. Explore.</sub>
</p>
