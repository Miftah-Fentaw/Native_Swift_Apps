// Virtual modules built by vite.config.ts from the rest of the repository.

declare module 'virtual:pattern-code' {
  /** Swift excerpts for each pattern id, cut from the source files at build time. */
  const code: Record<string, { file: string; code: string; start: number; end: number }[]>
  export default code
}

declare module 'virtual:changelog' {
  /** Releases parsed from the root CHANGELOG.md, newest first. */
  const entries: { date: string; title: string; summary: string; groups: { heading: string; items: string[] }[] }[]
  export default entries
}
