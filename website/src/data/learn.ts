// Learning content for the hub: guided tracks, a glossary, a page per
// technology and platform, curated resources and the FAQ. App references use
// the slugs from projects.ts; `npm run build` fails if one doesn't exist
// (see scripts/validate.ts).

import { allProjects, type Level, type Project } from './projects.ts'

// ---------------------------------------------------------------------------
// Learning tracks
// ---------------------------------------------------------------------------

export interface TrackStep {
  /** Project slug. */
  app: string
  /** What to look at in this app, and why it comes at this point. */
  focus: string
  /** Pattern ids from patterns.ts that show this step in code. */
  patterns?: string[]
}

export interface Track {
  id: string
  title: string
  level: Level
  summary: string
  /** What you can do by the end. */
  outcome: string
  accent: string
  steps: TrackStep[]
}

export const tracks: Track[] = [
  {
    id: 'swiftui-foundations',
    title: 'SwiftUI foundations',
    level: 'Beginner',
    summary: 'Views, layout, state and settings — the building blocks every SwiftUI app is made of.',
    outcome: 'Build a multi-screen SwiftUI app that keeps its state in @Observable models and remembers settings.',
    accent: '#34c759',
    steps: [
      { app: 'swiftui-kit', focus: 'Tour every built-in control, color and font with the system defaults before designing your own.' },
      {
        app: 'swiftcalc',
        focus: 'See one app switch between three modes, keep its maths in @Observable models and store settings with @AppStorage.',
        patterns: ['observable-model', 'app-storage', 'sensory-feedback'],
      },
      { app: 'hacking-with-swift', focus: 'Practise with small, focused projects in the SwiftUI edition, one concept at a time.' },
      {
        app: 'weather',
        focus: 'Share one store across four tabs through the environment, and put a map on screen.',
        patterns: ['environment-injection', 'mapkit'],
      },
      { app: 'journal', focus: 'Finish with a custom Layout for the home feed and a system search field.', patterns: ['masonry-layout', 'searchable'] },
    ],
  },
  {
    id: 'saving-data',
    title: 'Saving data',
    level: 'Beginner',
    summary: 'From a single setting to a synced database: every way these apps keep data between launches.',
    outcome: 'Choose between @AppStorage, Codable files in UserDefaults, SwiftData and Core Data, and know when to add sync.',
    accent: '#30a46c',
    steps: [
      { app: 'swiftcalc', focus: 'Start with @AppStorage and shared keys for small settings.', patterns: ['app-storage'] },
      { app: 'weather', focus: 'Save Codable values such as favourite cities in UserDefaults, behind a store.', patterns: ['observable-store'] },
      {
        app: 'journal',
        focus: 'Model entries with SwiftData, store photos outside the database and query them from any view.',
        patterns: ['swiftdata-model', 'model-container-query'],
      },
      { app: 'expenso', focus: 'Compare with Core Data, organized with MVVM, and export records as CSV.' },
      { app: 'kado', focus: 'Add optional iCloud sync with a CloudKit private database, plus lossless JSON and CSV export.' },
      { app: 'backyard-birds', focus: 'See Apple’s take on SwiftData working together with Observation, widgets and StoreKit.' },
    ],
  },
  {
    id: 'networking-concurrency',
    title: 'Networking and concurrency',
    level: 'Intermediate',
    summary: 'Call web APIs with async/await, decode JSON, run requests in parallel and keep the UI responsive.',
    outcome: 'Write a networking layer with URLSession and Codable, and reason about tasks, actors and cancellation.',
    accent: '#2f80ed',
    steps: [
      {
        app: 'weather',
        focus: 'One generic fetch function, explicit CodingKeys and two requests in parallel with async let.',
        patterns: ['generic-fetch', 'coding-keys', 'parallel-requests'],
      },
      { app: 'weather', focus: 'Guard against out-of-order responses and stale data in the store.', patterns: ['observable-store'] },
      { app: 'news-app', focus: 'Structured concurrency with actors, AsyncImage, .refreshable and .searchable on a real news API.' },
      { app: 'pocketdex', focus: 'Swift 6 strict concurrency, a background @ModelActor and decoding JSON off the main thread.' },
      { app: 'swift-radio', focus: 'Stream audio in the background with Swift 6 complete concurrency checking.' },
      { app: 'ice-cubes', focus: 'Keep timelines live from a streaming API in a large SwiftUI app.' },
    ],
  },
  {
    id: 'apple-frameworks',
    title: 'Apple frameworks tour',
    level: 'Intermediate',
    summary: 'Maps, charts, photos, biometrics, notifications, widgets and more — one framework per stop.',
    outcome: 'Know which framework to reach for, and have a working example of each to copy from.',
    accent: '#ff9f0a',
    steps: [
      { app: 'weather', focus: 'MapKit for SwiftUI: a camera position, a custom annotation and map styles.', patterns: ['mapkit'] },
      {
        app: 'journal',
        focus: 'Swift Charts, PhotosUI, LocalAuthentication and UserNotifications in one app.',
        patterns: ['mood-chart', 'photos-picker', 'biometric-lock', 'daily-reminder'],
      },
      { app: 'food-truck', focus: 'WeatherKit, Swift Charts, Live Activities and the Dynamic Island in Apple’s WWDC22 sample.' },
      { app: 'backyard-birds', focus: 'Interactive widgets with App Intents, and in-app purchases with the StoreKit views.' },
      { app: 'dime', focus: 'Home and lock screen widgets, iCloud sync, quick actions and reminders in a finance app.' },
      { app: 'pocketdex', focus: 'Local multiplayer between nearby devices with MultipeerConnectivity.' },
      { app: 'bitchat', focus: 'Bluetooth LE mesh networking with CoreBluetooth, with no servers at all.' },
    ],
  },
  {
    id: 'multiplatform',
    title: 'One codebase, every Apple device',
    level: 'Intermediate',
    summary: 'How SwiftUI apps adapt to iPad, Mac, Apple Watch, Apple TV and Vision Pro.',
    outcome: 'Structure an app so most code is shared and each platform still feels native.',
    accent: '#5b4fe0',
    steps: [
      { app: 'swiftui-kit', focus: 'See the same controls on five platforms side by side.' },
      { app: 'chatgpt-swiftui', focus: 'One chat app for iPhone, Mac, Apple Watch and Apple TV, with a video per platform.' },
      { app: 'food-truck', focus: 'One app target for iPhone, iPad and Mac, built on NavigationSplitView.' },
      { app: 'backyard-birds', focus: 'Add an Apple Watch app and widgets to a shared SwiftData model.' },
      { app: 'swiftfin', focus: 'A focus-based interface for Apple TV next to the iPhone and iPad app.' },
      { app: 'ice-cubes', focus: 'A dedicated sidebar layout on iPad and Mac, plus visionOS.' },
      { app: 'enchanted', focus: 'A chat app that also runs on Vision Pro.' },
    ],
  },
  {
    id: 'mac-apps',
    title: 'Building for the Mac',
    level: 'Intermediate',
    summary: 'Menu bar utilities, keyboard-first tools and full desktop apps with AppKit and SwiftUI.',
    outcome: 'Ship a sandboxed Mac utility, and know when to drop down from SwiftUI to AppKit.',
    accent: '#8e8e93',
    steps: [
      { app: 'tomatobar', focus: 'A small menu bar app: timer states, notifications, a global hotkey and a URL scheme.' },
      { app: 'hidden-bar', focus: 'Menu bar status items in AppKit, launch at login and saved preferences.' },
      { app: 'maccy', focus: 'Watch the pasteboard, store history with SwiftData and search it from the keyboard.' },
      { app: 'control-room', focus: 'Wrap a command-line tool (simctl) in a native SwiftUI interface.' },
      { app: 'petrichor', focus: 'Gapless playback, library scanning, smart playlists and Shortcuts in a music player.' },
      { app: 'codeedit', focus: 'Mix AppKit and SwiftUI in a code editor with an integrated terminal.' },
      { app: 'netnewswire', focus: 'Read a mature AppKit and UIKit codebase that shares code between Mac and iOS.' },
    ],
  },
  {
    id: 'media',
    title: 'Audio and video',
    level: 'Advanced',
    summary: 'Background playback, lock screen controls, CarPlay, downloads and a TV interface.',
    outcome: 'Understand what a media app needs beyond a play button.',
    accent: '#e5484d',
    steps: [
      { app: 'swift-radio', focus: 'Stream radio in the background with lock screen controls and CarPlay, from one JSON file of stations.' },
      { app: 'petrichor', focus: 'Offline playback of over 40 formats with crossfade and an equalizer.' },
      { app: 'pocket-casts', focus: 'Downloads, widgets, Siri intents, an App Clip and a watch app in a full podcast player.' },
      { app: 'swiftfin', focus: 'Video playback from a Jellyfin server on iPhone, iPad and Apple TV.' },
    ],
  },
  {
    id: 'chat-and-ai',
    title: 'Chat, messaging and AI',
    level: 'Advanced',
    summary: 'From calling a language model API to end-to-end encrypted, serverless messaging.',
    outcome: 'Build a chat interface and choose a transport: HTTP API, local server, Matrix or Bluetooth.',
    accent: '#bf5af2',
    steps: [
      { app: 'chatgpt-swiftui', focus: 'Call a chat API from Swift and render Markdown replies with highlighted code.' },
      { app: 'enchanted', focus: 'Talk to self-hosted models through Ollama, with images, voice input and read-aloud.' },
      { app: 'element-x', focus: 'An encrypted Matrix client in SwiftUI on top of a Rust SDK.' },
      { app: 'bitchat', focus: 'Peer-to-peer messages over a Bluetooth mesh, falling back to Nostr when online.' },
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture at scale',
    level: 'Advanced',
    summary: 'How large apps are split into layers and modules, and how state flows through them.',
    outcome: 'Compare Redux-style stores, Clean Architecture, the Composable Architecture and package-based modules.',
    accent: '#ff453a',
    steps: [
      { app: 'movieswiftui', focus: 'Unidirectional data flow with a custom Redux-style store and Combine.' },
      { app: 'clean-architecture-swiftui', focus: 'Separate UI, business logic and data access, with dependency injection and tests.' },
      { app: 'hackers', focus: 'Split an app into Swift package modules and test each one on its own.' },
      { app: 'isowords', focus: 'The Composable Architecture across a large game, with a server in Swift too.' },
      { app: 'ice-cubes', focus: 'Feature packages in a fast-moving open-source SwiftUI app.' },
      { app: 'element-x', focus: 'Share core logic with an Android app through a Rust SDK packaged for Swift.' },
      { app: 'bitwarden', focus: 'Extensions, a watch app, Xcode projects generated from YAML and testing at scale.' },
    ],
  },
  {
    id: 'testing',
    title: 'Testing your code',
    level: 'Advanced',
    summary: 'Unit tests with Swift Testing, testable architecture and test suites for large apps.',
    outcome: 'Write tests that pin down your logic, and structure code so it can be tested without the UI.',
    accent: '#00c7be',
    steps: [
      { app: 'swiftcalc', focus: 'Unit-test a parser with Swift Testing: @Test functions and #expect.', patterns: ['swift-testing', 'recursive-descent'] },
      { app: 'clean-architecture-swiftui', focus: 'Use dependency injection so business logic can be tested in isolation.' },
      { app: 'hackers', focus: 'Test module by module once the app is split into packages.' },
      { app: 'isowords', focus: 'Test a large modular app built with the Composable Architecture.' },
      { app: 'bitwarden', focus: 'Unit and view testing at scale in a security-critical app.' },
    ],
  },
]

export const findTrack = (id?: string) => tracks.find((t) => t.id === id)
export const tracksFor = (slug: string) => tracks.filter((t) => t.steps.some((s) => s.app === slug))

// ---------------------------------------------------------------------------
// Glossary
// ---------------------------------------------------------------------------

export type TermKind = 'Swift' | 'Concurrency' | 'SwiftUI' | 'Data' | 'Architecture' | 'Testing'

export interface Term {
  id: string
  term: string
  kind: TermKind
  definition: string
  /** A short illustrative snippet (not from the apps; see Patterns for those). */
  example?: string
  /** Project slugs whose code or README shows it. */
  apps: string[]
  doc?: string
}

const SWIFT_BOOK = 'https://docs.swift.org/swift-book/documentation/the-swift-programming-language'

export const glossary: Term[] = [
  // Swift
  {
    id: 'codable',
    term: 'Codable',
    kind: 'Swift',
    definition:
      'A protocol that combines Encodable and Decodable. Conforming types can be converted to and from formats such as JSON, and the compiler writes the code for you when every property is Codable too.',
    example: 'struct City: Codable {\n    let name: String\n    let latitude: Double\n}\nlet city = try JSONDecoder().decode(City.self, from: data)',
    apps: ['weather', 'journal'],
    doc: 'https://developer.apple.com/documentation/swift/codable',
  },
  {
    id: 'coding-keys',
    term: 'CodingKeys',
    kind: 'Swift',
    definition:
      'A nested enum that tells Codable which key in the data matches each property. Use it when the JSON’s names differ from your Swift names, such as snake_case keys.',
    example: 'enum CodingKeys: String, CodingKey {\n    case name\n    case temperature = "temperature_2m"\n}',
    apps: ['weather'],
    doc: 'https://developer.apple.com/documentation/foundation/encoding-and-decoding-custom-types',
  },
  {
    id: 'generics',
    term: 'Generics',
    kind: 'Swift',
    definition:
      'Code written once for any type that meets some requirements. A generic function such as `fetch<T: Decodable>` works for every Decodable type, checked at compile time.',
    example: 'func decode<T: Decodable>(_ type: T.Type, from data: Data) throws -> T {\n    try JSONDecoder().decode(type, from: data)\n}',
    apps: ['weather'],
    doc: `${SWIFT_BOOK}/generics`,
  },
  {
    id: 'key-path',
    term: 'Key path',
    kind: 'Swift',
    definition:
      'A reference to a property, written `\\Type.property`. Key paths let APIs such as `@Query`, `sorted(using:)` and `map(\\.name)` read a property without a closure.',
    example: 'let names = cities.map(\\.name)\n@Query(sort: \\Entry.createdAt) var entries: [Entry]',
    apps: ['journal'],
    doc: `${SWIFT_BOOK}/expressions#Key-Path-Expression`,
  },
  {
    id: 'computed-property',
    term: 'Computed property',
    kind: 'Swift',
    definition:
      'A property that calculates its value each time it is read instead of storing it. Deriving values this way means they can never fall out of sync with the data they come from.',
    example: 'var total: Double { bill + tip }',
    apps: ['swiftcalc', 'journal'],
    doc: `${SWIFT_BOOK}/properties#Computed-Properties`,
  },
  {
    id: 'pattern-matching',
    term: 'Pattern matching',
    kind: 'Swift',
    definition:
      'Checking a value against a shape and pulling out parts of it, with `switch`, `if case` or `while case`. It is the natural way to work with enums that carry associated values.',
    example: 'if case .binary(let op) = token {\n    print(op)\n}',
    apps: ['swiftcalc'],
    doc: `${SWIFT_BOOK}/patterns`,
  },
  {
    id: 'mutating',
    term: 'mutating',
    kind: 'Swift',
    definition:
      'A keyword for struct and enum methods that change `self`. Structs are value types, so their methods can’t modify properties unless marked mutating.',
    example: 'struct Counter {\n    var value = 0\n    mutating func increment() { value += 1 }\n}',
    apps: ['swiftcalc'],
    doc: `${SWIFT_BOOK}/methods#Modifying-Value-Types-from-Within-Instance-Methods`,
  },
  {
    id: 'defer',
    term: 'defer',
    kind: 'Swift',
    definition:
      'Runs a block of code when the current scope exits, however it exits — a return, a thrown error or the end of the function. Useful for resetting flags such as `isLoading`.',
    example: 'isLoading = true\ndefer { isLoading = false }\nlet report = try await service.load()',
    apps: ['weather', 'journal'],
    doc: `${SWIFT_BOOK}/statements#Defer-Statement`,
  },
  {
    id: 'recursive-descent',
    term: 'Recursive-descent parser',
    kind: 'Swift',
    definition:
      'A parser written as one function per grammar rule, where each function calls the functions for tighter rules. It is a readable way to respect operator precedence without tables.',
    apps: ['swiftcalc'],
  },
  {
    id: 'measurement',
    term: 'Measurement',
    kind: 'Swift',
    definition:
      'A Foundation type that pairs a value with a unit, such as 5 kilometres. It converts between compatible units and formats itself for the user’s locale.',
    example: 'Measurement(value: 5, unit: UnitLength.kilometers)\n    .converted(to: .miles)',
    apps: ['swiftcalc'],
    doc: 'https://developer.apple.com/documentation/foundation/measurement',
  },

  // Concurrency
  {
    id: 'async-await',
    term: 'async / await',
    kind: 'Concurrency',
    definition:
      'Swift’s syntax for asynchronous code. An `async` function can suspend while it waits, for example for a network response, and `await` marks each point where that can happen.',
    example: 'let (data, _) = try await URLSession.shared.data(from: url)',
    apps: ['weather', 'journal', 'news-app', 'pocketdex', 'swift-radio'],
    doc: `${SWIFT_BOOK}/concurrency`,
  },
  {
    id: 'async-let',
    term: 'async let',
    kind: 'Concurrency',
    definition:
      'Starts an asynchronous call as a child task straight away, without waiting for it. You `await` the result later, so several calls can run at the same time.',
    example: 'async let forecast = fetchForecast()\nasync let air = fetchAirQuality()\nlet report = try await (forecast, air)',
    apps: ['weather'],
    doc: `${SWIFT_BOOK}/concurrency#Calling-Asynchronous-Functions-in-Parallel`,
  },
  {
    id: 'structured-concurrency',
    term: 'Structured concurrency',
    kind: 'Concurrency',
    definition:
      'Tasks that are tied to the scope that created them. Child tasks finish, or are cancelled, before their parent returns, so work is never leaked in the background by accident.',
    apps: ['weather', 'news-app'],
    doc: `${SWIFT_BOOK}/concurrency#Tasks-and-Task-Groups`,
  },
  {
    id: 'task',
    term: 'Task',
    kind: 'Concurrency',
    definition:
      'A unit of asynchronous work. `Task { }` starts async work from synchronous code, such as a button action, and SwiftUI’s `.task` modifier starts work tied to a view’s lifetime.',
    example: 'Button("Refresh") {\n    Task { await store.load(force: true) }\n}',
    apps: ['journal'],
    doc: 'https://developer.apple.com/documentation/swift/task',
  },
  {
    id: 'actor',
    term: 'Actor',
    kind: 'Concurrency',
    definition:
      'A reference type that protects its state by letting only one task use it at a time. Calls from outside are `await`ed, which rules out data races on that state.',
    example: 'actor BookmarkStore {\n    private var items: [Article] = []\n    func add(_ article: Article) { items.append(article) }\n}',
    apps: ['news-app', 'pocketdex'],
    doc: `${SWIFT_BOOK}/concurrency#Actors`,
  },
  {
    id: 'main-actor',
    term: '@MainActor',
    kind: 'Concurrency',
    definition:
      'An attribute that runs code on the main thread, where UI work must happen. Applying it to a type isolates all of the type’s methods and properties to the main actor.',
    apps: ['swiftcalc'],
    doc: 'https://developer.apple.com/documentation/swift/mainactor',
  },
  {
    id: 'sendable',
    term: 'Sendable',
    kind: 'Concurrency',
    definition:
      'A protocol for values that are safe to pass between concurrent tasks, such as structs made of other Sendable values. Swift 6’s strict checking uses it to catch data races at compile time.',
    apps: ['journal', 'pocketdex'],
    doc: 'https://developer.apple.com/documentation/swift/sendable',
  },

  // SwiftUI
  {
    id: 'state',
    term: '@State',
    kind: 'SwiftUI',
    definition:
      'A property wrapper for a value a view owns. SwiftUI stores it outside the view struct, keeps it across redraws, and redraws the view when it changes.',
    example: '@State private var isSatellite = false',
    apps: ['swiftcalc', 'weather', 'journal'],
    doc: 'https://developer.apple.com/documentation/swiftui/state',
  },
  {
    id: 'binding',
    term: '@Binding',
    kind: 'SwiftUI',
    definition:
      'A two-way connection to a value owned somewhere else. Writing `$name` passes a binding to a child view or control, so it can read and change the original.',
    example: 'TextField("Search", text: $query)',
    apps: ['weather', 'journal'],
    doc: 'https://developer.apple.com/documentation/swiftui/binding',
  },
  {
    id: 'observable',
    term: '@Observable',
    kind: 'SwiftUI',
    definition:
      'A macro from the Observation framework that makes a class’s properties observable. SwiftUI tracks exactly which properties each view reads, and redraws only those views when they change.',
    example: '@Observable\nfinal class Store {\n    var cities: [City] = []\n}',
    apps: ['swiftcalc', 'weather', 'kado', 'pocketdex', 'backyard-birds', 'ice-cubes'],
    doc: 'https://developer.apple.com/documentation/observation',
  },
  {
    id: 'observation-ignored',
    term: '@ObservationIgnored',
    kind: 'SwiftUI',
    definition: 'Marks a property of an @Observable class that should not be tracked, such as a service or a cache that views never display.',
    apps: ['weather'],
    doc: 'https://developer.apple.com/documentation/observation/observationignored()',
  },
  {
    id: 'environment',
    term: '@Environment',
    kind: 'SwiftUI',
    definition:
      'Reads a value that an ancestor view provided with `.environment(_:)`, such as a shared store, or a system value such as the color scheme. It avoids passing objects through every initializer.',
    example: '@Environment(Store.self) private var store',
    apps: ['weather', 'swiftcalc'],
    doc: 'https://developer.apple.com/documentation/swiftui/environment',
  },
  {
    id: 'app-storage',
    term: '@AppStorage',
    kind: 'SwiftUI',
    definition:
      'A property wrapper that reads and writes a value in UserDefaults and redraws the view when it changes. Ideal for small settings such as a theme or a toggle.',
    example: '@AppStorage("hapticsEnabled") private var haptics = true',
    apps: ['swiftcalc', 'journal'],
    doc: 'https://developer.apple.com/documentation/swiftui/appstorage',
  },
  {
    id: 'result-builder',
    term: 'Result builder',
    kind: 'SwiftUI',
    definition:
      'The Swift feature behind SwiftUI’s declarative syntax. A list of expressions inside `{ }` — views, chart marks or map content — is combined into one value, with `if` and `for` allowed.',
    apps: ['weather', 'journal'],
    doc: `${SWIFT_BOOK}/attributes#resultBuilder`,
  },
  {
    id: 'view-modifier',
    term: 'View modifier',
    kind: 'SwiftUI',
    definition:
      'A method such as `.padding()` that returns a new view with a change applied. You can write your own as a View extension or a ViewModifier type, and they compose in order.',
    example: 'Text("Hi")\n    .padding()\n    .background(.blue)',
    apps: ['swiftcalc', 'journal'],
    doc: 'https://developer.apple.com/documentation/swiftui/viewmodifier',
  },
  {
    id: 'layout-protocol',
    term: 'Layout protocol',
    kind: 'SwiftUI',
    definition:
      'A protocol for writing your own container layouts. You implement `sizeThatFits` to measure and `placeSubviews` to position children — for example, a masonry grid.',
    apps: ['journal', 'food-truck'],
    doc: 'https://developer.apple.com/documentation/swiftui/layout',
  },
  {
    id: 'navigation-stack',
    term: 'NavigationStack',
    kind: 'SwiftUI',
    definition:
      'A container that pushes and pops views, with destinations declared by type through `.navigationDestination(for:)`. NavigationSplitView is its multi-column counterpart for iPad and Mac.',
    apps: ['journal', 'food-truck'],
    doc: 'https://developer.apple.com/documentation/swiftui/navigationstack',
  },
  {
    id: 'transferable',
    term: 'Transferable',
    kind: 'SwiftUI',
    definition:
      'A protocol describing how a type is exported and imported for sharing, drag and drop and the photo picker. `loadTransferable(type:)` turns a picked item into Data or an image.',
    apps: ['journal'],
    doc: 'https://developer.apple.com/documentation/coretransferable/transferable',
  },
  {
    id: 'preview',
    term: '#Preview',
    kind: 'SwiftUI',
    definition: 'A macro that renders a view in Xcode’s canvas while you edit. Previews can inject sample data, such as an in-memory SwiftData container.',
    example: '#Preview {\n    ContentView()\n}',
    apps: ['swiftcalc', 'journal'],
    doc: 'https://developer.apple.com/documentation/swiftui/previews-in-xcode',
  },
  {
    id: 'widget',
    term: 'Widget',
    kind: 'SwiftUI',
    definition:
      'A glanceable view on the Home Screen, Lock Screen or desktop, built with WidgetKit and SwiftUI. Widgets show timelines of snapshots and can run App Intents when tapped.',
    apps: ['kado', 'dime', 'news-app', 'food-truck', 'backyard-birds', 'pocket-casts'],
    doc: 'https://developer.apple.com/documentation/widgetkit',
  },
  {
    id: 'app-intent',
    term: 'App Intent',
    kind: 'SwiftUI',
    definition: 'An action your app exposes to the system — to Shortcuts, Siri, Spotlight, and to interactive widget buttons.',
    apps: ['kado', 'backyard-birds'],
    doc: 'https://developer.apple.com/documentation/appintents',
  },
  {
    id: 'live-activity',
    term: 'Live Activity',
    kind: 'SwiftUI',
    definition: 'An updating view on the Lock Screen and in the Dynamic Island for something happening right now, such as an order being prepared. Built with ActivityKit.',
    apps: ['food-truck'],
    doc: 'https://developer.apple.com/documentation/activitykit',
  },

  // Data
  {
    id: 'user-defaults',
    term: 'UserDefaults',
    kind: 'Data',
    definition: 'A simple key–value store for small amounts of data such as preferences. Larger or structured data belongs in SwiftData, Core Data or files.',
    apps: ['swiftcalc', 'weather'],
    doc: 'https://developer.apple.com/documentation/foundation/userdefaults',
  },
  {
    id: 'model',
    term: '@Model',
    kind: 'Data',
    definition:
      'The SwiftData macro that makes a class persistable. Its stored properties become the schema, and relationships, uniqueness and storage options are added with attributes.',
    example: '@Model\nfinal class Entry {\n    var title: String = ""\n    var createdAt: Date = .now\n}',
    apps: ['journal', 'kado', 'pocketdex', 'backyard-birds', 'maccy', 'clean-architecture-swiftui'],
    doc: 'https://developer.apple.com/documentation/swiftdata/model()',
  },
  {
    id: 'model-container',
    term: 'ModelContainer',
    kind: 'Data',
    definition:
      'The SwiftData object that manages the database for your models. `.modelContainer(for:)` on a scene creates one and puts its context in the environment for every view.',
    apps: ['journal'],
    doc: 'https://developer.apple.com/documentation/swiftdata/modelcontainer',
  },
  {
    id: 'query',
    term: '@Query',
    kind: 'Data',
    definition: 'A property wrapper that fetches SwiftData models for a view, with optional filtering and sorting, and keeps the results current as data changes.',
    example: '@Query(sort: \\Entry.createdAt, order: .reverse) private var entries: [Entry]',
    apps: ['journal'],
    doc: 'https://developer.apple.com/documentation/swiftdata/query',
  },
  {
    id: 'core-data',
    term: 'Core Data',
    kind: 'Data',
    definition: 'Apple’s older, mature persistence framework. SwiftData is built on top of it; many existing apps and tutorials still use Core Data directly.',
    apps: ['expenso'],
    doc: 'https://developer.apple.com/documentation/coredata',
  },

  // Architecture
  {
    id: 'mvvm',
    term: 'MVVM',
    kind: 'Architecture',
    definition:
      'Model–View–ViewModel. Views show state from a view model, which prepares data from the model layer and handles user actions, keeping logic out of the views.',
    apps: ['expenso', 'pocketdex'],
  },
  {
    id: 'unidirectional-data-flow',
    term: 'Unidirectional data flow',
    kind: 'Architecture',
    definition:
      'State lives in one store, views send actions, and a reducer produces the next state. Redux popularised the idea; the Composable Architecture is a Swift take on it.',
    apps: ['movieswiftui', 'isowords'],
  },
  {
    id: 'composable-architecture',
    term: 'The Composable Architecture',
    kind: 'Architecture',
    definition: 'A library by Point-Free for building apps from small reducers that compose, with dependencies and side effects you can control in tests.',
    apps: ['isowords'],
    doc: 'https://github.com/pointfreeco/swift-composable-architecture',
  },
  {
    id: 'dependency-injection',
    term: 'Dependency injection',
    kind: 'Architecture',
    definition:
      'Passing an object’s dependencies in, such as a networking service, instead of creating them inside. Tests and previews can then pass fakes. The Weather store takes its service and UserDefaults this way.',
    apps: ['weather', 'clean-architecture-swiftui', 'pocketdex'],
  },
  {
    id: 'swift-package',
    term: 'Swift package',
    kind: 'Architecture',
    definition:
      'A unit of code with a Package.swift manifest. Large apps split features into local packages so each builds, tests and evolves on its own.',
    apps: ['hackers', 'ice-cubes', 'netnewswire', 'element-x', 'bitwarden'],
    doc: 'https://www.swift.org/documentation/package-manager/',
  },
  {
    id: 'combine',
    term: 'Combine',
    kind: 'Architecture',
    definition: 'Apple’s framework for values over time: publishers emit values and subscribers react. Much of it is now covered by async/await and Observation, but many apps still use it.',
    apps: ['movieswiftui'],
    doc: 'https://developer.apple.com/documentation/combine',
  },

  // Testing
  {
    id: 'swift-testing',
    term: 'Swift Testing',
    kind: 'Testing',
    definition:
      'Apple’s modern testing library. Tests are functions marked `@Test`, assertions use `#expect` and `#require`, and tests can be parameterised and run in parallel.',
    example: '@Test func addsTip() {\n    #expect(TipCalculator(tipPercent: 10).tipAmount == 0)\n}',
    apps: ['swiftcalc'],
    doc: 'https://developer.apple.com/documentation/testing',
  },
]

export const findTerm = (id: string) => glossary.find((t) => t.id === id)
export const termKinds: TermKind[] = ['Swift', 'Concurrency', 'SwiftUI', 'Data', 'Architecture', 'Testing']

// ---------------------------------------------------------------------------
// Topics: one page per technology and platform
// ---------------------------------------------------------------------------

export type TopicKind = 'Language' | 'UI' | 'Data' | 'Apple framework' | 'Services' | 'Architecture' | 'Testing' | 'Platform'

export interface TopicInfo {
  kind: TopicKind
  summary: string
  doc: string
}

/** Keyed by the technology name used in `tech` arrays. */
export const techInfo: Record<string, TopicInfo> = {
  Swift: { kind: 'Language', summary: 'Apple’s open-source programming language: safe, fast and expressive. Every app on this hub is written in it.', doc: 'https://www.swift.org/documentation/' },
  'Swift Concurrency': { kind: 'Language', summary: 'async/await, tasks and actors: Swift’s built-in model for asynchronous and parallel code, with data-race checking in Swift 6.', doc: `${SWIFT_BOOK}/concurrency` },
  SwiftUI: { kind: 'UI', summary: 'Apple’s declarative UI framework for every Apple platform. You describe the interface for the current state, and SwiftUI keeps the screen in sync.', doc: 'https://developer.apple.com/documentation/swiftui' },
  UIKit: { kind: 'UI', summary: 'The original, imperative UI framework for iPhone and iPad. Many large apps still use it, often mixed with SwiftUI.', doc: 'https://developer.apple.com/documentation/uikit' },
  AppKit: { kind: 'UI', summary: 'The Mac’s native UI framework, used for menu bar items, windows and anything SwiftUI doesn’t cover on macOS.', doc: 'https://developer.apple.com/documentation/appkit' },
  Observation: { kind: 'UI', summary: 'The framework behind @Observable. It tracks which properties each view reads, so only the views that depend on a change are redrawn.', doc: 'https://developer.apple.com/documentation/observation' },
  'Swift Charts': { kind: 'UI', summary: 'Declarative charts built from marks — lines, bars, points and rules — that look and behave like the rest of SwiftUI.', doc: 'https://developer.apple.com/documentation/charts' },
  SpriteKit: { kind: 'UI', summary: 'Apple’s 2D game framework, with sprites, physics, particles and actions.', doc: 'https://developer.apple.com/documentation/spritekit' },
  SceneKit: { kind: 'UI', summary: 'A high-level 3D graphics framework for scenes, cameras, lights and animation.', doc: 'https://developer.apple.com/documentation/scenekit' },
  WidgetKit: { kind: 'UI', summary: 'Widgets for the Home Screen, Lock Screen, StandBy and the desktop, built with SwiftUI.', doc: 'https://developer.apple.com/documentation/widgetkit' },
  ActivityKit: { kind: 'UI', summary: 'Live Activities on the Lock Screen and in the Dynamic Island for events happening right now.', doc: 'https://developer.apple.com/documentation/activitykit' },
  Foundation: { kind: 'Data', summary: 'The base layer of every Apple app: strings, dates, formatting, units, JSON coding, UserDefaults and networking types.', doc: 'https://developer.apple.com/documentation/foundation' },
  SwiftData: { kind: 'Data', summary: 'Swift-native persistence: mark classes with @Model, query them with @Query, and optionally sync with iCloud.', doc: 'https://developer.apple.com/documentation/swiftdata' },
  'Core Data': { kind: 'Data', summary: 'Apple’s long-standing object graph and persistence framework, which SwiftData builds on.', doc: 'https://developer.apple.com/documentation/coredata' },
  CloudKit: { kind: 'Data', summary: 'Apple’s iCloud database service, used for syncing data between a user’s devices and for public data.', doc: 'https://developer.apple.com/documentation/cloudkit' },
  URLSession: { kind: 'Services', summary: 'Foundation’s HTTP client: downloads, uploads and API calls, with async/await support.', doc: 'https://developer.apple.com/documentation/foundation/urlsession' },
  MapKit: { kind: 'Apple framework', summary: 'Apple Maps in your app: maps, annotations, overlays, search and directions, with a native SwiftUI API.', doc: 'https://developer.apple.com/documentation/mapkit' },
  PhotosUI: { kind: 'Apple framework', summary: 'The system photo picker and related UI, which lets people choose photos without giving the app full library access.', doc: 'https://developer.apple.com/documentation/photosui' },
  LocalAuthentication: { kind: 'Apple framework', summary: 'Face ID, Touch ID, Optic ID and passcode checks for unlocking sensitive parts of an app.', doc: 'https://developer.apple.com/documentation/localauthentication' },
  UserNotifications: { kind: 'Apple framework', summary: 'Schedule local notifications and handle remote ones, including actionable notifications.', doc: 'https://developer.apple.com/documentation/usernotifications' },
  'App Intents': { kind: 'Apple framework', summary: 'Expose app actions to Shortcuts, Siri, Spotlight and interactive widgets.', doc: 'https://developer.apple.com/documentation/appintents' },
  StoreKit: { kind: 'Services', summary: 'In-app purchases and subscriptions, with ready-made SwiftUI views for product and subscription stores.', doc: 'https://developer.apple.com/documentation/storekit' },
  WeatherKit: { kind: 'Services', summary: 'Apple’s weather service: current conditions, forecasts and alerts.', doc: 'https://developer.apple.com/documentation/weatherkit' },
  AVFoundation: { kind: 'Apple framework', summary: 'Audio and video playback, capture and editing.', doc: 'https://developer.apple.com/documentation/avfoundation' },
  CarPlay: { kind: 'Apple framework', summary: 'Template-based interfaces for apps on a car’s built-in display.', doc: 'https://developer.apple.com/documentation/carplay' },
  MultipeerConnectivity: { kind: 'Apple framework', summary: 'Discover and connect to nearby devices over Wi-Fi and Bluetooth without a server.', doc: 'https://developer.apple.com/documentation/multipeerconnectivity' },
  CoreBluetooth: { kind: 'Apple framework', summary: 'Talk to Bluetooth Low Energy devices, or act as one.', doc: 'https://developer.apple.com/documentation/corebluetooth' },
  Combine: { kind: 'Architecture', summary: 'Publishers and subscribers for values that change over time.', doc: 'https://developer.apple.com/documentation/combine' },
  'Composable Architecture': { kind: 'Architecture', summary: 'Point-Free’s library for building apps from composable reducers with testable side effects.', doc: 'https://github.com/pointfreeco/swift-composable-architecture' },
  'Swift Packages': { kind: 'Architecture', summary: 'Swift Package Manager modules, used to split large apps into features and share code.', doc: 'https://www.swift.org/documentation/package-manager/' },
  Rust: { kind: 'Language', summary: 'A systems language some apps use for shared, cross-platform core logic, called from Swift through an FFI layer.', doc: 'https://www.rust-lang.org' },
  'Swift Testing': { kind: 'Testing', summary: 'Apple’s modern test library: @Test functions, #expect assertions, traits and parameterised tests.', doc: 'https://developer.apple.com/documentation/testing' },
  XCTest: { kind: 'Testing', summary: 'Xcode’s long-standing test framework, still used for UI tests and launch performance tests.', doc: 'https://developer.apple.com/documentation/xctest' },
}

export const PLATFORMS = ['iOS', 'iPadOS', 'macOS', 'watchOS', 'tvOS', 'visionOS'] as const
export type Platform = (typeof PLATFORMS)[number]

export const platformInfo: Record<Platform, TopicInfo> = {
  iOS: { kind: 'Platform', summary: 'iPhone apps — where most people start. Every app in this repository runs on iOS.', doc: 'https://developer.apple.com/ios/' },
  iPadOS: { kind: 'Platform', summary: 'iPad apps, with larger layouts, multitasking, pointer and keyboard support.', doc: 'https://developer.apple.com/ipados/' },
  macOS: { kind: 'Platform', summary: 'Mac apps and utilities: windows, menus, the menu bar and keyboard-first workflows.', doc: 'https://developer.apple.com/macos/' },
  watchOS: { kind: 'Platform', summary: 'Apple Watch apps and complications: short, glanceable interactions on the wrist.', doc: 'https://developer.apple.com/watchos/' },
  tvOS: { kind: 'Platform', summary: 'Apple TV apps, driven by focus and the remote rather than touch.', doc: 'https://developer.apple.com/tvos/' },
  visionOS: { kind: 'Platform', summary: 'Apple Vision Pro apps: windows, volumes and immersive spaces around the user.', doc: 'https://developer.apple.com/visionos/' },
}

export const topicSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const runsOn = (p: Project, platform: string) => p.platforms?.split(' · ').some((x) => x.startsWith(platform)) ?? false

export interface Topic {
  slug: string
  name: string
  info: TopicInfo
  apps: Project[]
  isPlatform: boolean
}

const allTechNames = Array.from(new Set(allProjects.flatMap((p) => p.tech)))

export const topics: Topic[] = [
  ...PLATFORMS.map((name) => ({
    slug: topicSlug(name),
    name,
    info: platformInfo[name],
    apps: allProjects.filter((p) => runsOn(p, name)),
    isPlatform: true,
  })),
  ...allTechNames
    .filter((name) => techInfo[name])
    .map((name) => ({
      slug: topicSlug(name),
      name,
      info: techInfo[name],
      apps: allProjects.filter((p) => p.tech.includes(name)),
      isPlatform: false,
    }))
    .sort((a, b) => b.apps.length - a.apps.length || a.name.localeCompare(b.name)),
]

export const findTopic = (slug?: string) => topics.find((t) => t.slug === slug)
/** The topic page for a technology name, or undefined if it has none. */
export const topicPath = (name: string) => (findTopic(topicSlug(name)) ? `/topics/${topicSlug(name)}` : `/explore?tech=${encodeURIComponent(name)}`)
export const topicKinds: TopicKind[] = ['Language', 'UI', 'Data', 'Apple framework', 'Services', 'Architecture', 'Testing']

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

export interface Resource {
  name: string
  url: string
  by: string
  description: string
  free: boolean
}

export const resources: { group: string; intro: string; items: Resource[] }[] = [
  {
    group: 'Start with Apple',
    intro: 'Official tutorials, documentation and design guidance — the most up-to-date source for every API used here.',
    items: [
      { name: 'SwiftUI Tutorials', url: 'https://developer.apple.com/tutorials/swiftui', by: 'Apple', description: 'Step-by-step tutorials that build real SwiftUI apps, with downloadable projects.', free: true },
      { name: 'Develop in Swift Tutorials', url: 'https://developer.apple.com/tutorials/develop-in-swift', by: 'Apple', description: 'Apple’s beginner course for people new to Swift, Xcode and SwiftUI.', free: true },
      { name: 'Apple Developer Documentation', url: 'https://developer.apple.com/documentation/', by: 'Apple', description: 'Reference documentation and articles for every Apple framework.', free: true },
      { name: 'Human Interface Guidelines', url: 'https://developer.apple.com/design/human-interface-guidelines/', by: 'Apple', description: 'How apps should look and behave on each Apple platform.', free: true },
      { name: 'WWDC videos', url: 'https://developer.apple.com/videos/', by: 'Apple', description: 'Every WWDC session, with code-along videos and transcripts.', free: true },
    ],
  },
  {
    group: 'The Swift language',
    intro: 'The language itself: how it works, how APIs should be named, and where it is going next.',
    items: [
      { name: 'The Swift Programming Language', url: 'https://docs.swift.org/swift-book/documentation/the-swift-programming-language/', by: 'Swift.org', description: 'The official book: a guided tour, then every language feature in depth.', free: true },
      { name: 'Swift.org documentation', url: 'https://www.swift.org/documentation/', by: 'Swift.org', description: 'Guides for the language, the package manager and Swift on other platforms.', free: true },
      { name: 'API Design Guidelines', url: 'https://www.swift.org/documentation/api-design-guidelines/', by: 'Swift.org', description: 'How to name things so Swift code reads clearly. The repo’s contributing guide follows these.', free: true },
      { name: 'Swift Evolution', url: 'https://github.com/swiftlang/swift-evolution', by: 'Swift.org', description: 'Every proposal for the language, with the reasoning behind each feature.', free: true },
      { name: 'Swift Forums', url: 'https://forums.swift.org', by: 'Swift.org', description: 'Discussion of the language, proposals and help from the community.', free: true },
    ],
  },
  {
    group: 'Courses and tutorials',
    intro: 'Structured courses for working through SwiftUI from the beginning.',
    items: [
      { name: '100 Days of SwiftUI', url: 'https://www.hackingwithswift.com/100/swiftui', by: 'Hacking with Swift', description: 'A free daily course that pairs with the Hacking with Swift community app.', free: true },
      { name: 'Stanford CS193p', url: 'https://cs193p.sites.stanford.edu', by: 'Stanford University', description: 'Stanford’s iOS development course, with lectures published online.', free: true },
      { name: 'Kodeco', url: 'https://www.kodeco.com', by: 'Kodeco', description: 'Books, video courses and tutorials on Swift, SwiftUI and Apple frameworks.', free: false },
    ],
  },
  {
    group: 'Articles and deep dives',
    intro: 'Writing that goes past the basics.',
    items: [
      { name: 'Swift by Sundell', url: 'https://www.swiftbysundell.com', by: 'John Sundell', description: 'Articles and podcasts on Swift techniques and patterns.', free: true },
      { name: 'Point-Free', url: 'https://www.pointfree.co', by: 'Point-Free', description: 'Videos on functional programming and architecture; the authors of isowords and the Composable Architecture.', free: false },
      { name: 'iOS Dev Weekly', url: 'https://iosdevweekly.com', by: 'Dave Verwer', description: 'A weekly, hand-picked newsletter of iOS development links.', free: true },
    ],
  },
  {
    group: 'Tools',
    intro: 'What you will use every day.',
    items: [
      { name: 'Xcode', url: 'https://developer.apple.com/xcode/', by: 'Apple', description: 'Apple’s IDE. Every project here opens in it.', free: true },
      { name: 'SF Symbols', url: 'https://developer.apple.com/sf-symbols/', by: 'Apple', description: 'Thousands of icons that match the system font, used across these apps.', free: true },
      { name: 'Swift Package Index', url: 'https://swiftpackageindex.com', by: 'Swift Package Index', description: 'Search open-source Swift packages, with compatibility and documentation.', free: true },
    ],
  },
  {
    group: 'More open-source apps',
    intro: 'Bigger lists to explore once you have worked through the hub’s picks.',
    items: [
      { name: 'Open-source iOS apps', url: 'https://github.com/dkhamsing/open-source-ios-apps', by: 'dkhamsing', description: 'A large, categorised list of open-source iOS apps.', free: true },
      { name: 'Open-source macOS apps', url: 'https://github.com/serhii-londar/open-source-mac-os-apps', by: 'serhii-londar', description: 'A categorised list of open-source Mac apps.', free: true },
      { name: 'Awesome iOS', url: 'https://github.com/vsouza/awesome-ios', by: 'vsouza', description: 'Libraries, tools and learning resources for iOS.', free: true },
    ],
  },
]

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export interface Faq {
  id: string
  q: string
  /** Plain text; `code` spans in backticks. */
  a: string
  /** Optional link shown under the answer. */
  link?: { label: string; to: string }
}

export const faqs: { group: string; items: Faq[] }[] = [
  {
    group: 'Getting started',
    items: [
      {
        id: 'requirements',
        q: 'What do I need to run the apps?',
        a: 'A Mac with an Xcode version that includes the iOS 27.2 SDK. The simulator needs nothing else. To run on your own iPhone or iPad, select your development team under Signing & Capabilities — a free Apple Account is enough for personal testing.',
        link: { label: 'Quick start', to: '/docs?s=quick-start' },
      },
      {
        id: 'where-to-start',
        q: 'Which app should I start with?',
        a: 'SwiftCalc or Weather, both Beginner. SwiftCalc is fully offline and shows layout, state and settings; Weather adds networking and maps. Then move on to Journal for SwiftData. The Learn page orders them for you, with community apps in between.',
        link: { label: 'Learning tracks', to: '/learn' },
      },
      {
        id: 'api-keys',
        q: 'Do the apps need any API keys or accounts?',
        a: 'Not the apps in this repo: SwiftCalc and Journal work fully offline, and Weather uses the free Open-Meteo APIs, which need no key. A few community apps do — for example News App needs a NewsAPI key and Enchanted needs an Ollama server. Their project pages say so under Run it.',
      },
      {
        id: 'macos',
        q: 'Do the apps run on the Mac?',
        a: 'The apps in this repo target iPhone and iPad. Many community apps run on the Mac — browse them on the macOS topic page.',
        link: { label: 'macOS apps', to: '/topics/macos' },
      },
    ],
  },
  {
    group: 'The apps',
    items: [
      {
        id: 'no-packages',
        q: 'Why are there no third-party packages?',
        a: 'So every line you read is Swift and Apple’s own frameworks. Nothing is hidden behind a library, and the projects open and build with nothing to resolve.',
      },
      {
        id: 'latest-sdk',
        q: 'Why do the apps need iOS 27.2?',
        a: 'They are built with the current SDK, so they can use the newest SwiftUI, SwiftData and Observation APIs directly, without availability checks for older systems.',
      },
      {
        id: 'patterns-current',
        q: 'Are the code samples on the Patterns page up to date?',
        a: 'Yes. They are not copies: the site cuts each excerpt out of the Swift files when it is built, and the build fails if the code an excerpt points to has moved.',
        link: { label: 'Code patterns', to: '/patterns' },
      },
      {
        id: 'reuse',
        q: 'Can I use this code in my own app?',
        a: 'The code in this repository is MIT licensed — check third-party data terms too, such as Open-Meteo’s for commercial use. Community apps have their own licenses (MIT, Apache, GPL, AGPL and others), shown on each project page. Read the license before reusing any of their code.',
      },
    ],
  },
  {
    group: 'Community apps',
    items: [
      {
        id: 'how-chosen',
        q: 'How are community apps chosen?',
        a: 'Each one is written in Swift for an Apple platform with its source on GitHub, has a clear open-source license, still builds with a recent Xcode or is well worth reading as a reference, and teaches something specific — a framework, a pattern or an architecture.',
        link: { label: 'About the picks', to: '/about' },
      },
      {
        id: 'maintainers',
        q: 'Who maintains the community apps?',
        a: 'Their own authors. Report bugs and send pull requests to the app’s repository, not to Native Swift Apps. If a link breaks or an app is no longer a good pick, open an issue here.',
      },
      {
        id: 'stars',
        q: 'Why don’t star counts always show?',
        a: 'They are badges loaded live from shields.io, so a content blocker or a temporary rate limit can stop them loading. The rest of the page doesn’t depend on them.',
      },
    ],
  },
  {
    group: 'This website',
    items: [
      {
        id: 'ask-ai',
        q: 'Is “Ask the hub” using AI?',
        a: 'No. It is a keyword search over the project data, run in your browser. Nothing is sent anywhere.',
      },
      {
        id: 'tracking',
        q: 'Does the site track me?',
        a: 'No. The site runs no analytics and sets no cookies. Your theme choice is saved in your browser’s local storage, community app icons load from github.com and star badges from shields.io.',
      },
      {
        id: 'shortcuts',
        q: 'Are there keyboard shortcuts?',
        a: '⌘K or Ctrl+K opens search from anywhere. In the gallery, use the arrow keys to move between screenshots and Esc to close.',
      },
    ],
  },
  {
    group: 'Contributing',
    items: [
      {
        id: 'suggest',
        q: 'How do I suggest a community app?',
        a: 'Fill in the form on the Contribute page. It opens a pre-filled issue on GitHub that you can review before submitting.',
        link: { label: 'Suggest an app', to: '/contribute' },
      },
      {
        id: 'add-app',
        q: 'Can I add a new app to the repository?',
        a: 'Please open an issue first, so the idea and scope can be agreed before you invest time. New apps follow the same structure: their own folder, Xcode project, README, screenshots and tests.',
      },
      {
        id: 'security',
        q: 'How do I report a security issue?',
        a: 'Privately, through a GitHub security advisory — never as a public issue. The security policy has the details.',
      },
    ],
  },
]
