// Every page on the site, in one place. The navigation's More menu, the footer,
// the command palette, the home page's "Keep learning" grid and the no-JS
// page list are all built from this.

export type PageIcon =
  | 'compass'
  | 'path'
  | 'code'
  | 'layers'
  | 'compare'
  | 'image'
  | 'book'
  | 'link'
  | 'map'
  | 'clock'
  | 'help'
  | 'info'
  | 'heart'
  | 'doc'

export interface SitePage {
  path: string
  title: string
  description: string
  group: 'Explore' | 'Learn' | 'Project'
  icon: PageIcon
  /** Shown in the home page's "Keep learning" grid. */
  featured?: boolean
}

export const sitePages: SitePage[] = [
  { path: '/explore', title: 'Explore', description: 'Every app, with filters for source, level, platform and technology.', group: 'Explore', icon: 'compass' },
  { path: '/compare', title: 'Compare', description: 'Put up to three apps side by side.', group: 'Explore', icon: 'compare', featured: true },
  { path: '/gallery', title: 'Gallery', description: 'Every screenshot, by app and appearance.', group: 'Explore', icon: 'image', featured: true },
  { path: '/topics', title: 'Topics', description: 'A page for every framework and platform.', group: 'Explore', icon: 'layers', featured: true },

  { path: '/learn', title: 'Learn', description: 'Guided tracks from your first SwiftUI view to large-app architecture.', group: 'Learn', icon: 'path', featured: true },
  { path: '/patterns', title: 'Patterns', description: 'Real code from the apps, explained line by line.', group: 'Learn', icon: 'code', featured: true },
  { path: '/glossary', title: 'Glossary', description: 'Swift and SwiftUI terms in plain words, with the apps that use them.', group: 'Learn', icon: 'book', featured: true },
  { path: '/resources', title: 'Resources', description: 'Hand-picked docs, courses and tools for learning Swift.', group: 'Learn', icon: 'link', featured: true },
  { path: '/docs', title: 'Docs', description: 'Run the apps, find your way around the repo and contribute.', group: 'Learn', icon: 'doc' },
  { path: '/faq', title: 'FAQ', description: 'Answers about the apps, the community picks and this site.', group: 'Learn', icon: 'help' },

  { path: '/roadmap', title: 'Roadmap', description: 'What’s shipped and what’s planned, by level.', group: 'Project', icon: 'map', featured: true },
  { path: '/changelog', title: 'Changelog', description: 'What’s new in the apps and on the hub.', group: 'Project', icon: 'clock' },
  { path: '/about', title: 'About', description: 'Why this project exists and how community apps are picked.', group: 'Project', icon: 'info' },
  { path: '/contribute', title: 'Contribute', description: 'Report a bug, improve the docs or suggest a community app.', group: 'Project', icon: 'heart' },
]

export const pageGroups = ['Explore', 'Learn', 'Project'] as const
