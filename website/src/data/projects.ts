// Single source of truth for the hub. Everything here is taken from the
// projects' own READMEs and source code — keep it in sync when a project changes.

export const REPO_URL = 'https://github.com/Miftah-Fentaw/Native_Swift_Apps'
export const CLONE_COMMAND = `git clone ${REPO_URL}.git`
export const SITE_URL = 'https://miftah-fentaw.github.io/Native_Swift_Apps/'
export const AUTHOR = { name: 'Miftah Fentaw', url: 'https://github.com/Miftah-Fentaw' }

export type Level = 'Beginner' | 'Intermediate' | 'Advanced'
export type Status = 'available' | 'in-progress' | 'planned'

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
    screens: [],
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
