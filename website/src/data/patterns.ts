// Code patterns from the apps in this repository. The code itself is never
// copied here: scripts/repo-content.ts cuts it out of the Swift files at build
// time using these anchors, so the Patterns page always matches the source.
//
//   from   text on the first line of the excerpt
//   to     text on the last line (inclusive); without it, the excerpt ends where
//          the block opened on or after `from` closes
//   docs   also include the `///` comments and attributes right above `from`
//   omit   spans to replace with `// …`; `to: '$'` omits up to the closing brace

export interface ExcerptSpec {
  file: string
  from: string
  to?: string
  docs?: boolean
  omit?: { from: string; to?: string }[]
}

export interface Pattern {
  id: string
  title: string
  /** Project slug in `projects`. */
  project: string
  summary: string
  /** Why it is written this way, in a few short points. */
  notes: string[]
  /** Technology names, matching `tech` in projects.ts. */
  tech: string[]
  /** Glossary term ids, matching `glossary` in learn.ts. */
  terms: string[]
  parts: ExcerptSpec[]
}

const WEATHER_SERVICE = 'weather/weather/Services/WeatherService.swift'

export const patterns: Pattern[] = [
  // Weather
  {
    id: 'parallel-requests',
    title: 'Run two requests at once with async let',
    project: 'weather',
    summary:
      'The weather report needs a forecast and an air quality reading from two different Open-Meteo endpoints. `async let` starts both straight away and waits for them together, so the screen loads in the time of the slower request instead of both added up.',
    notes: [
      'Each `async let` starts a child task immediately.',
      'The `await` on the last line suspends until both have finished.',
      'If the function throws or returns early, unfinished child tasks are cancelled automatically.',
    ],
    tech: ['Swift', 'URLSession'],
    terms: ['async-await', 'async-let', 'structured-concurrency'],
    parts: [{ file: WEATHER_SERVICE, from: 'func report(for city: City)' }],
  },
  {
    id: 'generic-fetch',
    title: 'One generic function for every JSON request',
    project: 'weather',
    summary:
      'Every endpoint goes through the same small function: download with `URLSession`, check the HTTP status code, then decode into whatever `Decodable` type the caller asks for.',
    notes: [
      'The generic parameter `T` means one function serves the forecast, air quality and geocoding responses.',
      'A non-2xx status becomes a typed error instead of a confusing decoding failure.',
      'The comment explains why `.convertFromSnakeCase` is not used.',
    ],
    tech: ['Swift', 'URLSession', 'Foundation'],
    terms: ['async-await', 'codable', 'generics'],
    parts: [{ file: WEATHER_SERVICE, from: 'private func fetch<T: Decodable>' }],
  },
  {
    id: 'coding-keys',
    title: 'Map snake_case JSON with CodingKeys',
    project: 'weather',
    summary:
      'Open-Meteo returns keys such as `temperature_2m`. A nested `Decodable` struct with explicit `CodingKeys` maps them onto Swift-style property names.',
    notes: [
      'Only keys that differ need a raw value; `time` and `visibility` map as they are.',
      'Optional properties such as `visibility` decode as `nil` when the key is missing.',
      'Nesting the response types keeps them private to the service.',
    ],
    tech: ['Swift', 'Foundation'],
    terms: ['codable', 'coding-keys'],
    parts: [{ file: WEATHER_SERVICE, from: 'struct Current: Decodable {' }],
  },
  {
    id: 'observable-store',
    title: 'An @Observable store with caching and race protection',
    project: 'weather',
    summary:
      'One `@Observable` class holds the app’s state. Views read its properties and update automatically. `load()` skips requests when data is fresh and ignores a response if the user switched cities while it was in flight.',
    notes: [
      '`private(set)` lets views read state while only the store changes it.',
      '`@ObservationIgnored` keeps dependencies such as the service out of change tracking.',
      'The `guard city == selectedCity` check stops an old, slow response from overwriting a newer city.',
      '`defer` resets `isLoading` on every exit path, including errors.',
    ],
    tech: ['Swift', 'Observation', 'Foundation'],
    terms: ['observable', 'observation-ignored', 'async-await', 'defer'],
    parts: [
      {
        file: 'weather/weather/Store/WeatherStore.swift',
        from: '@Observable',
        docs: true,
        omit: [
          { from: 'private enum Keys {', to: '// MARK: - Loading' },
          { from: '/// Fetches weather for favorites', to: '$' },
        ],
      },
    ],
  },
  {
    id: 'environment-injection',
    title: 'Share one store through the environment',
    project: 'weather',
    summary:
      'The app creates the store once with `@State` and hands it to every view with `.environment(store)`. Any screen can then read it with `@Environment(WeatherStore.self)`, without passing it through initializers.',
    notes: [
      '`@State` on the App keeps the same store alive for the app’s lifetime.',
      'The environment is keyed by type, so there is nothing to name or register.',
      'Previews can inject a store with sample data in the same way.',
    ],
    tech: ['SwiftUI', 'Observation'],
    terms: ['environment', 'state', 'observable'],
    parts: [
      { file: 'weather/weather/weatherApp.swift', from: '@main' },
      { file: 'weather/weather/Views/WeatherMapView.swift', from: 'struct WeatherMapView: View {', to: '@Environment(WeatherStore.self)' },
    ],
  },
  {
    id: 'mapkit',
    title: 'A SwiftUI map with a custom annotation',
    project: 'weather',
    summary:
      'MapKit for SwiftUI draws the map from a `MapCameraPosition` binding and a content builder. The selected city gets a custom SwiftUI view as its pin, and a toggle switches between the standard and satellite styles.',
    notes: [
      '`.automatic` lets the map frame its content on first appearance.',
      '`Annotation` accepts any SwiftUI view, here a custom pin.',
      '`.mapStyle` is driven by state, so switching styles needs no extra code.',
    ],
    tech: ['SwiftUI', 'MapKit'],
    terms: ['state', 'result-builder'],
    parts: [{ file: 'weather/weather/Views/WeatherMapView.swift', from: 'struct WeatherMapView: View {', to: '.mapStyle(' }],
  },

  // Journal
  {
    id: 'swiftdata-model',
    title: 'Define a SwiftData model',
    project: 'journal',
    summary:
      'The `@Model` macro turns a plain class into a persisted SwiftData model. Every property has a default value, enums are stored as raw strings, and photos are kept outside the database file.',
    notes: [
      'Default values on every property make future schema changes easier.',
      '`@Attribute(.externalStorage)` lets SwiftData store large data such as photos in separate files.',
      'Enums are stored as raw strings and exposed through computed properties, which keeps the stored schema simple.',
      '`ChecklistItem` is a `Codable` struct, so a whole checklist is stored inside the entry.',
    ],
    tech: ['SwiftData', 'Swift'],
    terms: ['model', 'codable'],
    parts: [
      {
        file: 'Journal/Journal/Models/JournalEntry.swift',
        from: 'nonisolated struct ChecklistItem',
        docs: true,
      },
      {
        file: 'Journal/Journal/Models/JournalEntry.swift',
        from: '@Model',
        docs: true,
        omit: [{ from: 'init(' }, { from: 'var mood: Mood {', to: '$' }],
      },
    ],
  },
  {
    id: 'model-container-query',
    title: 'Set up the container, then query it from any view',
    project: 'journal',
    summary:
      'One `.modelContainer(for:)` modifier on the app’s scene creates the database. Views then declare what they need with `@Query`, and SwiftUI keeps the results up to date as entries change.',
    notes: [
      'The container is set up once, at the top of the scene.',
      '`@Query` takes a sort key path and order, and re-renders the view when matching data changes.',
      'There is no manual fetching, observing or reloading code.',
    ],
    tech: ['SwiftData', 'SwiftUI'],
    terms: ['model-container', 'query', 'key-path'],
    parts: [
      { file: 'Journal/Journal/JournalApp.swift', from: '@main' },
      { file: 'Journal/Journal/Views/Insights/InsightsView.swift', from: 'struct InsightsView: View {', docs: true, to: '@Query(sort:' },
    ],
  },
  {
    id: 'masonry-layout',
    title: 'A custom masonry layout with the Layout protocol',
    project: 'journal',
    summary:
      'The home feed’s staggered cards come from a custom `Layout`: each card goes into the shortest column, and a view can opt in to spanning the full width with a layout value.',
    notes: [
      '`sizeThatFits` and `placeSubviews` share one `computeFrames` function, so measuring and placing never disagree.',
      'A `LayoutValueKey` lets a child view pass information up to its layout.',
      'The `.masonrySpan()` modifier wraps that key in a friendly API.',
    ],
    tech: ['SwiftUI'],
    terms: ['layout-protocol', 'view-modifier'],
    parts: [
      { file: 'Journal/Journal/Views/Home/MasonryLayout.swift', from: 'struct MasonryLayout: Layout', docs: true },
      { file: 'Journal/Journal/Views/Home/MasonryLayout.swift', from: 'nonisolated private struct MasonrySpanKey' },
      { file: 'Journal/Journal/Views/Home/MasonryLayout.swift', from: 'extension View {' },
    ],
  },
  {
    id: 'mood-chart',
    title: 'A mood trend line with Swift Charts',
    project: 'journal',
    summary:
      'Swift Charts builds the mood chart from marks: a smoothed `LineMark`, a `PointMark` per day and a `RuleMark` for the selected day, with emoji axis labels.',
    notes: [
      'Marks are combined declaratively inside `Chart { }`, like views in a stack.',
      '`unit: .day` buckets dates by day on the x-axis.',
      '`.interpolationMethod(.monotone)` smooths the line without overshooting the data.',
      'Axis labels can be any view, here an emoji per score.',
    ],
    tech: ['Swift Charts', 'SwiftUI'],
    terms: ['result-builder'],
    parts: [{ file: 'Journal/Journal/Views/Insights/InsightsView.swift', from: 'Chart {', to: '.chartYScale(domain: 1...5)' }],
  },
  {
    id: 'biometric-lock',
    title: 'Lock the app with Face ID, Touch ID or the passcode',
    project: 'journal',
    summary:
      'LocalAuthentication checks whether the device can authenticate, then asks the user with a reason string. The policy falls back to the passcode, and devices without any lock are let straight in.',
    notes: [
      '`.deviceOwnerAuthentication` allows the passcode as a fallback, unlike the biometrics-only policy.',
      '`canEvaluatePolicy` is checked first, so a device with no passcode never locks the user out.',
      'The `isAuthenticating` flag stops two prompts appearing at launch.',
    ],
    tech: ['LocalAuthentication', 'Swift'],
    terms: ['async-await', 'task', 'defer'],
    parts: [{ file: 'Journal/Journal/ContentView.swift', from: 'private func authenticate()' }],
  },
  {
    id: 'photos-picker',
    title: 'Pick a photo with PhotosPicker',
    project: 'journal',
    summary:
      'SwiftUI’s `PhotosPicker` shows the system photo picker without asking for library access. The selected item is loaded as `Data`, compressed, and saved onto the entry.',
    notes: [
      'The system picker runs out of process, so the app needs no photo library permission.',
      '`loadTransferable(type:)` is async because the photo may need downloading from iCloud.',
      'The picker selection is reset afterwards so the same photo can be picked again.',
    ],
    tech: ['PhotosUI', 'SwiftUI'],
    terms: ['async-await', 'transferable'],
    parts: [
      { file: 'Journal/Journal/Views/Detail/EntryDetailView.swift', from: 'PhotosPicker(selection: $photoItem', to: '.accessibilityLabel("Add photo")' },
      { file: 'Journal/Journal/Views/Detail/EntryDetailView.swift', from: 'private func loadPhoto(from item: PhotosPickerItem?) async' },
    ],
  },
  {
    id: 'daily-reminder',
    title: 'Schedule a repeating local notification',
    project: 'journal',
    summary:
      'The daily writing reminder removes any old request, asks for permission, then schedules a notification that repeats at the chosen hour and minute.',
    notes: [
      'A fixed identifier means rescheduling replaces the old reminder instead of adding another.',
      'If permission is denied, the setting is switched back off and the UI can explain why.',
      '`UNCalendarNotificationTrigger` with only hour and minute repeats every day.',
    ],
    tech: ['UserNotifications', 'Foundation'],
    terms: ['async-await'],
    parts: [{ file: 'Journal/Journal/Views/Settings/SettingsView.swift', from: 'private func updateReminder() async' }],
  },
  {
    id: 'searchable',
    title: 'Add a search field with .searchable',
    project: 'journal',
    summary:
      'One modifier adds a system search field to the navigation bar, bound to a `@State` string. The view filters its entries from that string.',
    notes: ['The prompt text tells people they can search tags too.', 'Navigation destinations and sheets are declared on the same stack.'],
    tech: ['SwiftUI'],
    terms: ['state', 'binding', 'navigation-stack'],
    parts: [{ file: 'Journal/Journal/Views/Search/SearchView.swift', from: '.navigationTitle("Search")', to: '.sheet(item: $editorRequest)' }],
  },

  // SwiftCalc
  {
    id: 'recursive-descent',
    title: 'A recursive-descent parser for operator precedence',
    project: 'swiftcalc',
    summary:
      'SwiftCalc evaluates whole expressions such as `2 + 3 × 4` with a small parser. Each precedence level is one function that calls the next tighter one, so multiplication binds before addition without any precedence tables.',
    notes: [
      'The grammar is written as a comment above each function.',
      'Lower-precedence functions call higher-precedence ones: expression → term → unary → power.',
      '`power` calls `unary` for its exponent, which makes `^` right-associative.',
      'Desk-calculator rules such as `200 + 10%` are handled where the operands meet.',
    ],
    tech: ['Swift'],
    terms: ['recursive-descent', 'pattern-matching', 'mutating'],
    parts: [
      { file: 'calculator/calculator/Engine/ExpressionEvaluator.swift', from: '// expression := term' },
      { file: 'calculator/calculator/Engine/ExpressionEvaluator.swift', from: '// term := unary' },
      { file: 'calculator/calculator/Engine/ExpressionEvaluator.swift', from: '// power := postfix' },
    ],
  },
  {
    id: 'observable-model',
    title: 'Computed values on an @Observable model',
    project: 'swiftcalc',
    summary:
      'The tip calculator keeps only its inputs as stored properties. The tip, total and per-person amounts are computed from them, so they can never get out of sync.',
    notes: [
      'Views that read `totalAmount` update when `entry` or `tipPercent` changes, because Observation tracks what each computed property reads.',
      '`private(set)` on `splitCount` routes changes through `incrementSplit()` and `decrementSplit()`, further down the file, which clamp it to `splitRange`.',
      'No view code is involved, so the maths is easy to unit test.',
    ],
    tech: ['Observation', 'Swift'],
    terms: ['observable', 'computed-property'],
    parts: [
      {
        file: 'calculator/calculator/Models/TipCalculator.swift',
        from: '@Observable',
        docs: true,
        omit: [{ from: '// MARK: - Keypad input', to: '$' }],
      },
    ],
  },
  {
    id: 'measurement',
    title: 'Unit conversion with Foundation’s Measurement',
    project: 'swiftcalc',
    summary:
      'The converter never hard-codes a conversion factor. Each unit is a Foundation `Dimension`, and `Measurement` converts between any two units of the same kind, temperature offsets included.',
    notes: [
      'One `convert` function serves all eight categories.',
      'Temperature works too, because `UnitTemperature` knows about offsets, not just ratios.',
      '`UnitOption` pairs a Foundation unit with the name and symbol shown in the UI.',
    ],
    tech: ['Foundation', 'Swift'],
    terms: ['measurement'],
    parts: [
      { file: 'calculator/calculator/Models/ConversionCategory.swift', from: 'struct UnitOption: Identifiable, Hashable', docs: true },
      { file: 'calculator/calculator/Models/ConversionCategory.swift', from: 'func convert(_ value: Double' },
    ],
  },
  {
    id: 'app-storage',
    title: 'Settings with @AppStorage and shared keys',
    project: 'swiftcalc',
    summary:
      'Settings live in `UserDefaults` through `@AppStorage`. The keys are defined once in an enum, so every screen that reads a setting uses exactly the same key.',
    notes: [
      'A typo in a key would silently create a second setting, so the keys are constants.',
      '`@AppStorage` works with `RawRepresentable` enums such as `AppTheme`.',
      'Views update when the setting changes anywhere in the app.',
    ],
    tech: ['SwiftUI', 'Foundation'],
    terms: ['app-storage', 'user-defaults'],
    parts: [
      { file: 'calculator/calculator/Support/AppSettings.swift', from: 'enum SettingsKey {', docs: true },
      { file: 'calculator/calculator/Views/ContentView.swift', from: '@AppStorage(SettingsKey.theme)', to: '@AppStorage(SettingsKey.haptics)' },
    ],
  },
  {
    id: 'sensory-feedback',
    title: 'Haptics with .sensoryFeedback',
    project: 'swiftcalc',
    summary:
      'Haptics are declared like any other modifier: when `mode` changes, SwiftUI plays the selection haptic. Returning `nil` from the closure skips it, which is how the haptics setting is honoured.',
    notes: ['No `UIFeedbackGenerator` setup is needed.', 'The closure form decides per change whether to play feedback.'],
    tech: ['SwiftUI'],
    terms: ['view-modifier', 'app-storage'],
    parts: [{ file: 'calculator/calculator/Views/ContentView.swift', from: '.sensoryFeedback(trigger: mode)' }],
  },
  {
    id: 'swift-testing',
    title: 'Unit tests with Swift Testing',
    project: 'swiftcalc',
    summary:
      'The expression evaluator is tested with Swift Testing: plain functions marked `@Test`, and `#expect` for assertions. Each test builds tokens by hand, so it tests the parser without any UI.',
    notes: [
      '`#expect` shows both sides of a failed comparison in the test report.',
      'Tests are `throws` functions, so a thrown evaluation error fails the test.',
      'Comments state the expression being tested in readable form.',
    ],
    tech: ['Swift Testing'],
    terms: ['swift-testing'],
    parts: [
      {
        file: 'calculator/calculatorTests/CalculatorEngineTests.swift',
        from: 'import Testing',
        to: '@testable import calculator',
      },
      {
        file: 'calculator/calculatorTests/CalculatorEngineTests.swift',
        from: 'struct ExpressionEvaluatorTests {',
        docs: true,
        omit: [{ from: '@Test func percentOfPreviousOperand', to: '$' }],
      },
    ],
  },
]

export const findPattern = (id?: string) => patterns.find((p) => p.id === id)
export const patternsFor = (slug: string) => patterns.filter((p) => p.project === slug)
