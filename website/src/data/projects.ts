// Single source of truth for the hub. Everything here is taken from the
// projects' own READMEs and source code — keep it in sync when a project changes.
// `projects` are the apps in this repository; `community` (further down) are
// open-source apps by other developers that the hub links to.

export const REPO_URL = 'https://github.com/Miftah-Fentaw/Native_Swift_Apps'
export const CLONE_COMMAND = `git clone ${REPO_URL}.git`
export const SITE_URL = 'https://miftah-fentaw.github.io/Native_Swift_Apps/'
export const AUTHOR = { name: 'Miftah Fentaw', url: 'https://github.com/Miftah-Fentaw' }

export type Level = 'Beginner' | 'Intermediate' | 'Advanced'
export type Status = 'available' | 'in-progress' | 'planned'
/** `repo` apps live in this repository; `community` apps live in their own GitHub repositories and are only linked. */
export type Source = 'repo' | 'community'

export interface Screen {
  src: string
  label: string
}

export interface FeatureGroup {
  title: string
  items: string[]
}

export interface Project {
  slug: string
  name: string
  folder?: string
  icon?: string
  level: Level
  status: Status
  tagline: string
  description: string
  platforms?: string
  tech: string[]
  learn: string[]
  features: FeatureGroup[]
  screens: Screen[]
  hasReadme: boolean
  /** Xcode project file inside the folder, used for the run instructions. */
  xcodeproj?: string
  accent: string
  /** Defaults to `repo`. */
  source?: Source
  /** GitHub `owner/name` of a community app. */
  repo?: string
  /** SPDX id, or `Custom` when the repository has its own terms. */
  license?: string
  /** Anything a reader needs before running it, such as an API key or a server. */
  note?: string
}

const shot = (app: string, file: string, label: string): Screen => ({
  src: `./repo/screens/${app}/${file}`,
  label,
})

export const projects: Project[] = [
  {
    slug: 'swiftcalc',
    name: 'SwiftCalc',
    folder: 'calculator',
    icon: './repo/icons/calculator.jpg',
    level: 'Beginner',
    status: 'available',
    tagline: 'Calculator, tip splitter and unit converter in one app.',
    description:
      'A standard and scientific calculator with live results, memory and history, a tip splitter and an eight-category unit converter — all behind a single mode switcher.',
    platforms: 'iOS · iPadOS 27.2+',
    tech: ['Swift', 'SwiftUI', 'Observation', 'Foundation', 'Swift Testing', 'XCTest'],
    learn: [
      'SwiftUI layout and composition',
      '@Observable state shared through the environment',
      '@AppStorage settings',
      'A recursive-descent expression parser',
      "Foundation's Measurement unit conversion",
      'Unit testing with Swift Testing',
    ],
    features: [
      {
        title: 'Calculator',
        items: [
          'Full expressions with standard operator precedence',
          'Live result preview while typing',
          'Scientific keys with a 2nd function layer',
          'Degrees or radians',
          'Memory keys and an M indicator',
          'History of the last 100 calculations',
          'Swipe to delete, long-press to copy or paste',
        ],
      },
      {
        title: 'Tip',
        items: [
          'Tip presets from 0% to 25%',
          'Split between 1 and 50 people',
          'Optional rounding up and currency symbol',
        ],
      },
      {
        title: 'Converter',
        items: [
          'Length, weight, temperature, volume, area, speed, time and data',
          'One-tap unit swap',
          'Rate line such as 1 m = 3.28084 ft',
        ],
      },
      {
        title: 'App-wide',
        items: ['System, light and dark themes', 'Haptic feedback', 'Accessibility labels on every key'],
      },
    ],
    screens: [
      shot('calculator', 'callight.png', 'Calculator'),
      shot('calculator', 'histdark.png', 'History'),
      shot('calculator', 'tiplight.png', 'Tip'),
      shot('calculator', 'tipdark.png', 'Tip · Dark'),
      shot('calculator', 'convertlight.png', 'Converter'),
      shot('calculator', 'convertdark.png', 'Converter · Dark'),
      shot('calculator', 'settinglight.png', 'Settings'),
      shot('calculator', 'settingdark.png', 'Settings · Dark'),
    ],
    hasReadme: true,
    xcodeproj: 'calculator.xcodeproj',
    accent: '#5b4fe0',
  },
  {
    slug: 'weather',
    name: 'Weather',
    folder: 'weather',
    icon: './repo/icons/weather.jpg',
    level: 'Beginner',
    status: 'available',
    tagline: 'Live conditions, 14-day forecasts, air quality and a map.',
    description:
      'A four-tab weather app powered by the free Open-Meteo APIs — no API key or account needed. Search any city, save favorites and browse hourly, daily and 14-day forecasts.',
    platforms: 'iOS · iPadOS 27.2+',
    tech: ['Swift', 'SwiftUI', 'Observation', 'Foundation', 'URLSession', 'MapKit', 'XCTest'],
    learn: [
      'Networking with URLSession and async/await',
      'Decoding JSON with Codable and explicit CodingKeys',
      'Parallel requests with async let',
      'A shared @Observable store',
      'Persisting data in UserDefaults',
      'MapKit for SwiftUI',
    ],
    features: [
      {
        title: 'Home',
        items: [
          'Current conditions in the city’s own time zone',
          'Sun arc between sunrise and sunset',
          'US AQI air quality and cloud cover meters',
          'Hourly strip and key details',
          'Pull to refresh',
        ],
      },
      {
        title: 'Forecast',
        items: ['Hourly, 7-day and 14-day views', 'Rain chance per hour and day', 'Expandable days with sunrise, sunset and UV'],
      },
      {
        title: 'Map',
        items: [
          'Apple Maps centered on the selected city',
          'Temperature, precipitation and wind summaries',
          'Standard or satellite view',
        ],
      },
      {
        title: 'Cities & profile',
        items: [
          'City search with Open-Meteo geocoding',
          'Favorites you can reorder and remove',
          '°C or °F, share, refresh all, reset to defaults',
        ],
      },
    ],
    screens: [
      shot('weather', 'home.png', 'Home'),
      shot('weather', 'forecast.png', 'Forecast'),
      shot('weather', 'map.png', 'Map'),
      shot('weather', 'favourite.png', 'Favorites'),
      shot('weather', 'search.png', 'Search'),
      shot('weather', 'profile.png', 'Profile'),
    ],
    hasReadme: true,
    xcodeproj: 'weather.xcodeproj',
    accent: '#2f80ed',
  },
  {
    slug: 'journal',
    name: 'Journal',
    folder: 'Journal',
    icon: './repo/icons/journal.png',
    level: 'Intermediate',
    status: 'available',
    tagline: 'A private journal with moods, checklists, photos and insights.',
    description:
      'Entries that mix text, a checklist and a photo, stored on device with SwiftData. Includes a calendar, mood insights, search, onboarding and a biometric lock.',
    platforms: 'iOS · iPadOS 27.2+',
    tech: ['Swift', 'SwiftUI', 'SwiftData', 'Swift Charts', 'PhotosUI', 'LocalAuthentication'],
    learn: [
      'Modeling and querying data with SwiftData',
      'Charts for mood insights',
      'Picking photos with PhotosUI',
      'Biometric unlock with LocalAuthentication',
      'Custom masonry layouts',
    ],
    features: [
      {
        title: 'Entries',
        items: ['Text, checklist and photo in one entry', 'Six moods and card colors', 'Tags, favorites and bookmarks'],
      },
      {
        title: 'Browse',
        items: ['Masonry home feed', 'Calendar view', 'Search', 'Mood insights'],
      },
      {
        title: 'App',
        items: ['Onboarding', 'Biometric lock', 'Settings with profile photo'],
      },
    ],
    screens: [
      shot('journal', 'homelight.png', 'Home'),
      shot('journal', 'calhome.png', 'Calendar'),
      shot('journal', 'calblack.png', 'Calendar · Dark'),
      shot('journal', 'insightlight.png', 'Insights'),
      shot('journal', 'insightblack.png', 'Insights · Dark'),
      shot('journal', 'searchlight.png', 'Search'),
      shot('journal', 'searchblack.png', 'Search · Dark'),
      shot('journal', 'settingslight.png', 'Settings'),
      shot('journal', 'create.png', 'New entry'),
      shot('journal', 'edit.png', 'Entry'),
      shot('journal', 'onboard1.png', 'Welcome'),
      shot('journal', 'onboard2.png', 'Checklists'),
      shot('journal', 'onboard3.png', 'Mood'),
      shot('journal', 'onboard4.png', 'Your name'),
    ],
    hasReadme: true,
    xcodeproj: 'Journal.xcodeproj',
    accent: '#e0794f',
  },
]

const planned = (name: string, level: Level, tagline: string): Project => ({
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  level,
  status: 'planned',
  tagline,
  description: tagline,
  tech: [],
  learn: [],
  features: [],
  screens: [],
  hasReadme: false,
  accent: '#8e8e93',
})

export const roadmap: Project[] = [
  planned('TaskFlow', 'Beginner', 'Task management'),
  planned('QuickNotes', 'Beginner', 'Notes and organization'),
  planned('FocusTimer', 'Beginner', 'Pomodoro timer'),
  planned('Spendly', 'Intermediate', 'Expense tracking'),
  planned('HabitKit', 'Intermediate', 'Habit tracking'),
  planned('QRStudio', 'Intermediate', 'QR scanner and generator'),
  planned('VaultKey', 'Intermediate', 'Local password manager'),
  planned('Markdown Studio', 'Intermediate', 'Markdown editor with live preview'),
  planned('SwiftChat', 'Advanced', 'AI chat'),
  planned('PixelLab', 'Advanced', 'Image editing'),
  planned('AudioWave', 'Advanced', 'Music player and visualizer'),
  planned('FileNest', 'Advanced', 'File management'),
  planned('Bookly', 'Advanced', 'Appointment booking'),
]

// ---------------------------------------------------------------------------
// Community apps: open-source Swift apps by other developers. They live in
// their own GitHub repositories; this hub only describes and links to them.
// Text is written from each repository's README. Keep the list in sync with
// the "Explore More" section of the root README.
// ---------------------------------------------------------------------------

const slugify = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const COMMUNITY_ACCENT: Record<Level, string> = { Beginner: '#30a46c', Intermediate: '#e08a1e', Advanced: '#e5484d' }

type CommunityInput = Pick<Project, 'name' | 'level' | 'platforms' | 'tagline' | 'description' | 'tech' | 'learn' | 'note'> & {
  repo: string
  license: string
}

const external = (p: CommunityInput): Project => ({
  ...p,
  slug: slugify(p.name),
  icon: `https://github.com/${p.repo.split('/')[0]}.png?size=160`,
  status: 'available',
  source: 'community',
  features: [],
  screens: [],
  hasReadme: true,
  accent: COMMUNITY_ACCENT[p.level],
})

export const community: Project[] = [
  // Beginner
  external({
    name: 'SwiftUI Kit',
    repo: 'jordansinger/SwiftUI-Kit',
    level: 'Beginner',
    platforms: 'iOS · iPadOS · macOS · watchOS · tvOS',
    license: 'MIT',
    tagline: 'Every standard SwiftUI control and interaction in one demo app.',
    description:
      'A reference app that shows how SwiftUI’s built-in buttons, colors, controls, fonts, haptics, images, indicators, shapes and text look and behave with the system defaults, on iPhone, iPad, Mac, Apple Watch and Apple TV.',
    tech: ['Swift', 'SwiftUI'],
    learn: [
      'How each built-in SwiftUI control looks and behaves',
      'System colors and fonts',
      'Haptic feedback',
      'Changing an app’s accent color',
      'One SwiftUI codebase on five platforms',
    ],
  }),
  external({
    name: 'Hacking with Swift',
    repo: 'twostraws/HackingWithSwift',
    level: 'Beginner',
    platforms: 'iOS',
    license: 'Unlicense',
    tagline: 'Source code for the Hacking with Swift tutorials, in UIKit and SwiftUI editions.',
    description:
      'The companion code for Paul Hudson’s free Hacking with Swift tutorial series: one folder for the classic course, which teaches UIKit and SpriteKit, and one for the SwiftUI edition. Starter projects let you follow along from scratch.',
    tech: ['Swift', 'SwiftUI', 'UIKit', 'SpriteKit'],
    learn: [
      'Swift and iOS basics, one small project at a time',
      'UIKit and SpriteKit in the classic course',
      'SwiftUI in the SwiftUI edition',
      'Going from a starter project to a finished app',
    ],
  }),
  external({
    name: 'TomatoBar',
    repo: 'ivoronin/TomatoBar',
    level: 'Beginner',
    platforms: 'macOS',
    license: 'MIT',
    tagline: 'Pomodoro timer for the menu bar with sounds, notifications and a global hotkey.',
    description:
      'A small, fully sandboxed Pomodoro timer for the macOS menu bar, with configurable work and rest intervals, optional sounds, actionable notifications, a global hotkey and a tomatobar:// URL scheme for automation.',
    tech: ['Swift', 'SwiftUI', 'UserNotifications'],
    learn: [
      'Building a menu bar app',
      'Modeling a timer as a set of states',
      'Actionable notifications',
      'A global keyboard shortcut',
      'Custom URL schemes for automation',
      'Shipping a fully sandboxed app',
    ],
  }),
  external({
    name: 'Hidden Bar',
    repo: 'dwarvesf/hidden',
    level: 'Beginner',
    platforms: 'macOS',
    license: 'MIT',
    tagline: 'Tiny utility that hides menu bar icons behind a toggle.',
    description:
      'An ultra-light macOS utility that tucks menu bar items away behind a separator you can toggle, so the menu bar stays clean.',
    tech: ['Swift', 'AppKit'],
    learn: [
      'Menu bar status items in AppKit',
      'Launch at login',
      'Saving user preferences',
      'A small but complete macOS utility',
    ],
  }),
  external({
    name: 'News App',
    repo: 'alfianlosari/NewsAppSwiftUI',
    level: 'Beginner',
    platforms: 'iOS · iPadOS · macOS · watchOS · tvOS',
    license: 'MIT',
    tagline: 'News by category with search, bookmarks and widgets, built on NewsAPI.',
    description:
      'A full news reader built with SwiftUI 3: browse categories, search with suggestions and history, bookmark articles, read them in a Safari view and add configurable widgets, plus a companion watch app.',
    tech: ['Swift', 'SwiftUI', 'Swift Concurrency', 'WidgetKit'],
    learn: [
      'Structured concurrency with async/await and actors',
      'AsyncImage, .refreshable and swipe actions',
      'Search with .searchable and suggestions',
      'Persisting bookmarks with an actor',
      'Configurable widgets',
      'Watch Connectivity',
    ],
    note: 'Needs a free API key from newsapi.org. Last updated in 2021, so some APIs are older.',
  }),
  external({
    name: 'Expenso',
    repo: 'sameersyd/Expenso-iOS',
    level: 'Beginner',
    platforms: 'iOS',
    license: 'Apache-2.0',
    tagline: 'Income and expense tracker with charts, Face ID lock and CSV export.',
    description:
      'A simple expense tracker that records income and expenses, shows them in charts, locks behind Face ID or Touch ID and exports to CSV, organized with MVVM.',
    tech: ['Swift', 'SwiftUI', 'Core Data', 'LocalAuthentication'],
    learn: ['Saving and querying data with Core Data', 'MVVM in SwiftUI', 'Spending charts', 'Face ID / Touch ID lock', 'Exporting data as CSV'],
  }),
  external({
    name: 'ChatGPT SwiftUI',
    repo: 'alfianlosari/ChatGPTSwiftUI',
    level: 'Beginner',
    platforms: 'iOS · macOS · watchOS · tvOS',
    license: 'MIT',
    tagline: 'Chat client for the OpenAI API with Markdown and code highlighting.',
    description:
      'A native chat app for large language model APIs, written once in SwiftUI and run on iPhone, Mac, Apple Watch and Apple TV. Replies render as Markdown with syntax-highlighted code, and each platform has a video tutorial.',
    tech: ['Swift', 'SwiftUI'],
    learn: [
      'Calling a chat API from Swift',
      'Rendering Markdown and highlighted code',
      'Sharing one codebase across four platforms',
    ],
    note: 'Needs an OpenAI API key. Last updated in 2024.',
  }),

  // Intermediate
  external({
    name: 'Kadō',
    repo: 'scastiel/kado',
    level: 'Intermediate',
    platforms: 'iOS · iPadOS',
    license: 'MIT',
    tagline: 'Privacy-first habit tracker that scores habits instead of counting streaks.',
    description:
      'A habit tracker whose score is a moving average of your completions, so one missed day doesn’t wipe out your progress. Data stays on device with SwiftData, with optional iCloud sync, lossless JSON or CSV export and no third-party dependencies.',
    tech: ['Swift', 'SwiftUI', 'Observation', 'SwiftData', 'CloudKit', 'WidgetKit', 'App Intents'],
    learn: [
      '@Observable state',
      'SwiftData storage',
      'Optional sync with a CloudKit private database',
      'Home screen widgets',
      'App Intents',
      'JSON and CSV export',
    ],
  }),
  external({
    name: 'Dime',
    repo: 'rafsoh/dimeApp',
    level: 'Intermediate',
    platforms: 'iOS',
    license: 'GPL-3.0',
    tagline: 'Expense tracker with budgets, recurring expenses, iCloud sync and widgets.',
    description:
      'A free personal finance tracker designed around Apple’s design guidelines: spending breakdowns over time, category budgets, recurring expenses, iCloud sync, reminders, a biometric lock, quick actions and home and lock screen widgets.',
    tech: ['Swift', 'SwiftUI', 'WidgetKit', 'LocalAuthentication'],
    learn: [
      'Category budgets and recurring expenses',
      'Syncing data through iCloud',
      'Home and lock screen widgets',
      'A biometric lock',
      'Home screen quick actions',
      'Reminder notifications',
    ],
  }),
  external({
    name: 'PocketDex+',
    repo: 'brillcp/PocketDex',
    level: 'Intermediate',
    platforms: 'iOS',
    license: 'MIT',
    tagline: 'Pokédex on PokeAPI with turn-based battles and nearby multiplayer.',
    description:
      'A SwiftUI Pokédex with a turn-based battle mode against a rule-based AI and local multiplayer over MultipeerConnectivity. Every feature is small enough to read end to end, and the comments explain why the code is built the way it is.',
    tech: ['Swift', 'SwiftUI', 'Swift Concurrency', 'Observation', 'SwiftData', 'MultipeerConnectivity'],
    learn: [
      'Swift 6 strict concurrency and actors',
      'SwiftData with a background @ModelActor',
      'Decoding JSON off the main thread',
      'Protocol-oriented MVVM with a composition root',
      'Local multiplayer with MultipeerConnectivity',
    ],
  }),
  external({
    name: 'Hackers',
    repo: 'weiran/Hackers',
    level: 'Intermediate',
    platforms: 'iOS · iPadOS',
    license: 'MIT',
    tagline: 'Hacker News reader with threaded comments, voting, bookmarks and search.',
    description:
      'A Hacker News client rebuilt in SwiftUI with a modular Swift package layout: story feeds, collapsible comment threads, voting, bookmarks, search, an in-app browser and a share extension, with Dynamic Type and VoiceOver support.',
    tech: ['Swift', 'SwiftUI', 'Swift Packages'],
    learn: [
      'Splitting an app into Swift package modules',
      'Collapsible nested comment threads',
      'A share extension',
      'Dynamic Type and VoiceOver',
      'Testing module by module',
    ],
  }),
  external({
    name: 'Enchanted',
    repo: 'gluonfield/enchanted',
    level: 'Intermediate',
    platforms: 'iOS · macOS · visionOS',
    license: 'Apache-2.0',
    tagline: 'Chat app for self-hosted language models through Ollama.',
    description:
      'A ChatGPT-style app for private, self-hosted models served by Ollama, on iPhone, Mac and Vision Pro: Markdown replies, image attachments, voice prompts, read-aloud, custom system prompts and conversation history stored on device.',
    tech: ['Swift', 'SwiftUI'],
    learn: [
      'A chat UI for a local LLM server',
      'Rendering Markdown tables and code',
      'Image attachments in prompts',
      'Voice input and text to speech',
      'Storing conversation history on device',
    ],
    note: 'Needs your own Ollama server. The author continues this work in a newer project, Jaz.',
  }),
  external({
    name: 'Food Truck',
    repo: 'apple/sample-food-truck',
    level: 'Intermediate',
    platforms: 'iOS · iPadOS · macOS',
    license: 'MIT',
    tagline: 'Apple’s WWDC22 multiplatform sample for running a food truck business.',
    description:
      'Apple’s sample app for a food truck operator: track orders, see the most popular menu items and check the weather at your next stop, from one codebase and one app target for iPhone, iPad and Mac.',
    tech: ['Swift', 'SwiftUI', 'Swift Charts', 'WeatherKit', 'ActivityKit', 'WidgetKit'],
    learn: ['NavigationSplitView', 'A custom Layout', 'Trends with Swift Charts', 'Weather data with WeatherKit', 'Live Activities and the Dynamic Island'],
  }),
  external({
    name: 'Backyard Birds',
    repo: 'apple/sample-backyard-birds',
    level: 'Intermediate',
    platforms: 'iOS · iPadOS · macOS · watchOS',
    license: 'MIT',
    tagline: 'Apple’s WWDC23 sample game about the birds that visit your garden.',
    description:
      'Apple’s sample app about the birds in your backyard: keep their food and water topped up, or buy tastier food with an in-app purchase. It shows SwiftData, interactive widgets and the StoreKit views working together.',
    tech: ['Swift', 'SwiftUI', 'Observation', 'SwiftData', 'WidgetKit', 'App Intents', 'StoreKit'],
    learn: [
      'Modeling data with SwiftData',
      'Observation with SwiftUI',
      'Interactive and configurable widgets with App Intents',
      'In-app purchases with ProductView and SubscriptionStoreView',
    ],
  }),
  external({
    name: 'Maccy',
    repo: 'p0deje/Maccy',
    level: 'Intermediate',
    platforms: 'macOS',
    license: 'MIT',
    tagline: 'Keyboard-first clipboard manager with search.',
    description:
      'A lightweight clipboard manager for macOS that keeps a history of everything you copy, so you can search for it and paste it again without leaving the keyboard.',
    tech: ['Swift', 'SwiftUI', 'AppKit', 'SwiftData'],
    learn: ['Watching NSPasteboard for changes', 'Storing history with SwiftData', 'Global keyboard shortcuts', 'Building a menu bar app', 'Keyboard-first search'],
  }),
  external({
    name: 'Control Room',
    repo: 'twostraws/ControlRoom',
    level: 'Intermediate',
    platforms: 'macOS',
    license: 'MIT',
    tagline: 'Controls the Xcode simulators: status bar, appearance, screenshots and more.',
    description:
      'A macOS app that controls the iOS, tvOS and watchOS simulators, from screenshots and movies to status bar overrides, appearance and the system time, by wrapping Apple’s simctl command-line tool.',
    tech: ['Swift', 'SwiftUI'],
    learn: ['SwiftUI on macOS', 'Running command-line tools from an app', 'Wrapping a command-line tool in a native UI'],
    note: 'Needs Xcode installed, because it runs simctl.',
  }),
  external({
    name: 'Swift Radio',
    repo: 'analogcode/Swift-Radio-Pro',
    level: 'Intermediate',
    platforms: 'iOS',
    license: 'MIT',
    tagline: 'Internet radio station app with CarPlay, ready to rebrand with your own stations.',
    description:
      'An open-source radio app with a SwiftUI interface, used as the starting point for many App Store apps. Edit one JSON file to add your own stations; background playback, CarPlay and lock screen controls are built in.',
    tech: ['Swift', 'SwiftUI', 'AVFoundation', 'CarPlay', 'Swift Concurrency'],
    learn: [
      'Streaming audio in the background',
      'Lock screen and Control Center controls',
      'A CarPlay interface',
      'Loading stations from a local or remote JSON file',
      'Swift 6 complete concurrency checking',
    ],
  }),
  external({
    name: 'MovieSwiftUI',
    repo: 'Dimillian/MovieSwiftUI',
    level: 'Intermediate',
    platforms: 'iOS · iPadOS',
    license: 'Apache-2.0',
    tagline: 'Movie browser for The Movie Database with a custom Redux-style store.',
    description:
      'A real-world SwiftUI and Combine app built on The Movie Database API, with a custom Flux/Redux-style state store. The author documented its design and architecture in a series of articles.',
    tech: ['Swift', 'SwiftUI', 'Combine'],
    learn: ['Unidirectional data flow with a Redux-style store', 'Combine', 'Networking with a public REST API', 'Structuring a larger SwiftUI app'],
    note: 'Last updated in 2024, so some SwiftUI APIs are older.',
  }),
  external({
    name: 'Authenticator',
    repo: 'mattrubin/Authenticator',
    level: 'Intermediate',
    platforms: 'iOS',
    license: 'MIT',
    tagline: 'Two-factor authentication codes, set up by scanning a QR code.',
    description:
      'A simple, free two-factor authentication app that generates one-time passwords. Add an account by scanning a QR code, opening an otpauth:// URL or typing in the details.',
    tech: ['Swift', 'UIKit'],
    learn: ['Generating time-based one-time passwords', 'QR code setup', 'Handling otpauth:// URLs', 'Storing secrets securely on device'],
  }),

  // Advanced
  external({
    name: 'Ice Cubes',
    repo: 'Dimillian/IceCubesApp',
    level: 'Advanced',
    platforms: 'iOS · iPadOS · macOS · visionOS',
    license: 'AGPL-3.0',
    tagline: 'Mastodon client built entirely in SwiftUI.',
    description:
      'A fast, lightweight client for any Mastodon instance, built entirely in SwiftUI, with live timelines driven by Mastodon’s streaming events and a dedicated sidebar layout on iPad and Mac.',
    tech: ['Swift', 'SwiftUI', 'Observation', 'Swift Packages'],
    learn: [
      'Splitting features into Swift packages',
      'Live updates from a streaming API',
      'A sidebar layout for iPad and Mac',
      'One SwiftUI codebase on four platforms',
    ],
  }),
  external({
    name: 'isowords',
    repo: 'pointfreeco/isowords',
    level: 'Advanced',
    platforms: 'iOS',
    license: 'Custom',
    tagline: 'Word search game on a vanishing cube, with client and server in Swift.',
    description:
      'The full source of a large App Store game. The iOS client’s logic is built with the Composable Architecture, the UI mostly in SwiftUI with some SceneKit, and the server is written in Swift too. Point-Free published a video tour of the code.',
    tech: ['Swift', 'SwiftUI', 'SceneKit', 'Composable Architecture'],
    learn: ['The Composable Architecture at scale', 'Mixing SwiftUI with SceneKit', 'A server written in Swift', 'Testing a large modular app'],
  }),
  external({
    name: 'Clean Architecture SwiftUI',
    repo: 'nalexn/clean-architecture-swiftui',
    level: 'Advanced',
    platforms: 'iOS',
    license: 'MIT',
    tagline: 'Sample app that shows Clean Architecture end to end.',
    description:
      'A SwiftUI sample app built with Clean Architecture, with worked examples of SwiftData persistence, networking, dependency injection and unit testing.',
    tech: ['Swift', 'SwiftUI', 'SwiftData'],
    learn: ['Separating UI, business logic and data access', 'Dependency injection', 'SwiftData persistence', 'Networking', 'Unit testing'],
  }),
  external({
    name: 'NetNewsWire',
    repo: 'Ranchero-Software/NetNewsWire',
    level: 'Advanced',
    platforms: 'macOS · iOS · iPadOS',
    license: 'MIT',
    tagline: 'Fast, free RSS reader for Mac, iPhone and iPad.',
    description:
      'A long-running, free and open-source RSS reader for Mac, iPhone and iPad, with a codebase shaped by many years of real-world use.',
    tech: ['Swift', 'AppKit', 'UIKit', 'Swift Packages'],
    learn: ['A mature AppKit and UIKit codebase', 'Feed parsing for RSS, Atom and JSON Feed', 'Syncing with feed services', 'Sharing code between Mac and iOS'],
  }),
  external({
    name: 'Element X',
    repo: 'element-hq/element-x-ios',
    level: 'Advanced',
    platforms: 'iOS',
    license: 'AGPL-3.0',
    tagline: 'Matrix chat client in SwiftUI, built on the Matrix Rust SDK.',
    description:
      'Element’s next-generation Matrix client: a full rewrite in SwiftUI on top of the Matrix Rust SDK, which it uses through an FFI layer packaged as a Swift package shared with the Android app.',
    tech: ['Swift', 'SwiftUI', 'Swift Packages', 'Rust'],
    learn: [
      'Calling a Rust SDK from Swift through a Swift package',
      'SwiftUI in a large production app',
      'End-to-end encrypted messaging',
      'Sharing core logic with an Android app',
    ],
  }),
  external({
    name: 'Bitwarden',
    repo: 'bitwarden/ios',
    level: 'Advanced',
    platforms: 'iOS · watchOS',
    license: 'GPL-3.0',
    tagline: 'The official Bitwarden password manager and authenticator apps.',
    description:
      'The native iOS apps for the Bitwarden password manager and Bitwarden Authenticator, with AutoFill, share and action extensions, an Apple Watch app and an extensive test setup.',
    tech: ['Swift', 'SwiftUI', 'Swift Packages'],
    learn: [
      'A password AutoFill extension',
      'Share and action extensions',
      'An Apple Watch companion app',
      'Generating Xcode projects from YAML specs',
      'Unit and view testing at scale',
    ],
  }),
  external({
    name: 'bitchat',
    repo: 'permissionlesstech/bitchat',
    level: 'Advanced',
    platforms: 'iOS · macOS',
    license: 'Unlicense',
    tagline: 'Peer-to-peer chat over a Bluetooth mesh, with Nostr when online.',
    description:
      'A decentralized messaging app with no accounts, phone numbers or servers. Messages hop between nearby devices over a Bluetooth LE mesh and fall back to the Nostr protocol for global reach.',
    tech: ['Swift', 'SwiftUI', 'CoreBluetooth'],
    learn: [
      'Bluetooth LE mesh networking with CoreBluetooth',
      'Multi-hop message relay',
      'End-to-end encryption with the Noise Protocol',
      'Choosing between offline and internet transports',
    ],
  }),
  external({
    name: 'Swiftfin',
    repo: 'jellyfin/Swiftfin',
    level: 'Advanced',
    platforms: 'iOS · iPadOS · tvOS',
    license: 'MPL-2.0',
    tagline: 'Jellyfin media server client for iPhone, iPad and Apple TV.',
    description: 'A modern video client for the Jellyfin media server, with native apps for iPhone, iPad and Apple TV.',
    tech: ['Swift', 'SwiftUI'],
    learn: ['Video playback', 'A focus-based tvOS interface', 'A large SwiftUI app talking to a REST API', 'Sharing code between iOS and tvOS'],
    note: 'Needs a Jellyfin server to connect to.',
  }),
  external({
    name: 'Pocket Casts',
    repo: 'Automattic/pocket-casts-ios',
    level: 'Advanced',
    platforms: 'iOS · watchOS',
    license: 'MPL-2.0',
    tagline: 'Full-featured podcast player.',
    description:
      'The source code of the Pocket Casts podcast app, including its Apple Watch app, widgets, Siri intents, App Clip and share extension.',
    tech: ['Swift', 'UIKit', 'SwiftUI', 'WidgetKit'],
    learn: ['Audio playback and downloads', 'Home screen widgets', 'Siri intents', 'An Apple Watch app', 'An App Clip', 'Organizing a large app into modules'],
  }),
  external({
    name: 'CodeEdit',
    repo: 'CodeEditApp/CodeEdit',
    level: 'Advanced',
    platforms: 'macOS',
    license: 'MIT',
    tagline: 'Native code editor for macOS.',
    description: 'A community-built code editor for macOS that aims to feel truly native, written in Swift with AppKit and SwiftUI.',
    tech: ['Swift', 'SwiftUI', 'AppKit'],
    learn: ['Mixing AppKit and SwiftUI', 'A custom source editor with tree-sitter highlighting', 'An integrated terminal', 'Source control integration'],
  }),
  external({
    name: 'Petrichor',
    repo: 'kushalpandya/Petrichor',
    level: 'Advanced',
    platforms: 'macOS',
    license: 'MIT',
    tagline: 'Offline music player with smart playlists, synced lyrics and gapless playback.',
    description:
      'A native offline music player for macOS that plays over 40 audio formats, with smart playlists, synced lyrics, internet radio, gapless playback, crossfade, an equalizer, Last.fm scrobbling and Shortcuts support.',
    tech: ['Swift', 'SwiftUI', 'AppKit'],
    learn: [
      'Gapless playback with crossfade and an equalizer',
      'Scanning a music library and reading metadata',
      'Smart playlists with rules',
      'Menu bar and Dock playback controls',
      'Shortcuts and Siri automation',
    ],
  }),
]

/** Apps in this repository plus the linked community apps. */
export const allProjects: Project[] = [...projects, ...community]

export const isCommunity = (p: Project) => p.source === 'community'
export const findProject = (slug?: string) => allProjects.find((p) => p.slug === slug)
export const githubRepoUrl = (repo: string) => `https://github.com/${repo}`
export const repoOwner = (p: Project) => p.repo?.split('/')[0]
/** "MIT license", "Unlicense", "Custom license". */
export const licenseLabel = (p: Project) =>
  p.license === 'Unlicense' ? 'Unlicense' : p.license === 'Custom' ? 'Custom license' : `${p.license} license`

/** Technologies used by a set of projects, most common first. */
export function techCounts(pool: Project[]) {
  const counts = new Map<string, number>()
  for (const p of pool) for (const t of p.tech) counts.set(t, (counts.get(t) ?? 0) + 1)
  return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export const levels: { level: Level; color: string; topics: string[] }[] = [
  { level: 'Beginner', color: '#34c759', topics: ['Swift fundamentals', 'SwiftUI views', 'Layouts', 'State management'] },
  {
    level: 'Intermediate',
    color: '#ff9f0a',
    topics: ['Data persistence', 'Networking', 'Native frameworks', 'Security & device capabilities'],
  },
  { level: 'Advanced', color: '#ff453a', topics: ['Concurrency', 'Multimedia', 'Architecture', 'System integrations'] },
]

export const levelColor = (level: Level) => levels.find((l) => l.level === level)?.color ?? '#8e8e93'

export const allScreens = projects.flatMap((p) => p.screens.map((s) => ({ ...s, project: p })))

export const allTech = Array.from(new Set(projects.flatMap((p) => p.tech))).map((name) => ({
  name,
  projects: projects.filter((p) => p.tech.includes(name)),
}))

export const githubTree = (folder: string) => `${REPO_URL}/tree/main/${folder}`
export const githubReadme = (folder: string) => `${REPO_URL}/blob/main/${folder}/README.md`

/** Very small local search used by the "Ask the hub" demo and the explore page. */
export function searchProjects(query: string, pool: Project[] = projects) {
  const words = query
    .toLowerCase()
    .split(/[^a-z0-9@+#.-]+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  if (words.length === 0) return pool.map((p) => ({ project: p, score: 0, hits: [] as string[] }))

  return pool
    .map((project) => {
      const fields = [
        project.name,
        project.tagline,
        project.description,
        project.level,
        ...(project.platforms ? [project.platforms] : []),
        ...(project.repo ? [project.repo, 'Community'] : []),
        ...project.tech,
        ...project.learn,
        ...project.features.flatMap((f) => [f.title, ...f.items]),
      ]
      const hits = new Set<string>()
      let score = 0
      for (const word of words) {
        for (const field of fields) {
          if (field.toLowerCase().includes(word)) {
            score += field === project.name ? 5 : 1
            // Only short fields make useful "why it matched" hints.
            if (field.length <= 70 && field !== project.name) hits.add(field)
          }
        }
      }
      return { project, score, hits: Array.from(hits).slice(0, 3) }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
}

const STOP_WORDS = new Set([
  'the', 'and', 'that', 'with', 'show', 'app', 'apps', 'for', 'how', 'use', 'uses', 'using', 'me', 'one',
  'which', 'what', 'project', 'projects', 'want', 'learn', 'about', 'build', 'can', 'does',
])
