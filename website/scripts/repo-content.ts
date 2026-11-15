// Reads content from the rest of the repository at build time, so the site
// never shows a stale copy of it:
//   virtual:pattern-code  code excerpts for the Patterns page, cut from the
//                         apps' real Swift files by the anchors in src/data/patterns.ts
//   virtual:changelog     the entries in the root CHANGELOG.md
// Both are Vite virtual modules (see vite.config.ts). A missing anchor fails
// the build, so a renamed function can't silently break an excerpt.
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { patterns, type ExcerptSpec } from '../src/data/patterns'

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

const read = (file: string) => readFileSync(resolve(REPO, file), 'utf8').replace(/\r\n/g, '\n').split('\n')

const fail = (spec: ExcerptSpec, message: string): never => {
  throw new Error(`[patterns] ${spec.file}: ${message}. Update the anchors in website/src/data/patterns.ts.`)
}

const indentOf = (line: string) => line.match(/^\s*/)![0].length

/** Index of the first line at or after `start` that contains `text`. */
function findLine(lines: string[], text: string, start: number, spec: ExcerptSpec) {
  const index = lines.findIndex((l, i) => i >= start && l.includes(text))
  return index === -1 ? fail(spec, `no line contains "${text}"`) : index
}

/** Index of the line that closes the first `{` opened at or after `start`. */
function blockEnd(lines: string[], start: number, spec: ExcerptSpec) {
  let depth = 0
  let opened = false
  for (let i = start; i < lines.length; i++) {
    // Ignore braces inside string literals and line comments.
    const code = lines[i].replace(/"(?:[^"\\]|\\.)*"/g, '""').replace(/\/\/.*$/, '')
    for (const ch of code) {
      if (ch === '{') {
        depth++
        opened = true
      } else if (ch === '}') {
        depth--
      }
    }
    if (opened && depth <= 0) return i
  }
  return fail(spec, `the block at line ${start + 1} never closes`)
}

/** Range of a span: `to` is inclusive; without it, the span ends where its block closes. */
function span(lines: string[], from: string, to: string | undefined, start: number, spec: ExcerptSpec) {
  const first = findLine(lines, from, start, spec)
  const last = to ? findLine(lines, to, first, spec) : blockEnd(lines, first, spec)
  return [first, last] as const
}

/** Closes any blocks the excerpt leaves open, with a `// …` where the rest of the body was. */
function balance(out: string[]) {
  const stack: number[] = []
  for (const line of out) {
    const code = line.replace(/"(?:[^"\\]|\\.)*"/g, '""').replace(/\/\/.*$/, '')
    for (const ch of code) {
      if (ch === '{') stack.push(indentOf(line))
      else if (ch === '}') stack.pop()
    }
  }
  if (stack.length === 0) return out
  const closing = stack.reverse().map((indent) => `${' '.repeat(indent)}}`)
  return [...out, `${' '.repeat(stack[0] + 4)}// …`, ...closing]
}

/** Removes the shared leading indentation. */
function dedent(lines: string[]) {
  const widths = lines.filter((l) => l.trim()).map(indentOf)
  const min = widths.length ? Math.min(...widths) : 0
  return lines.map((l) => l.slice(min))
}

export interface Excerpt {
  file: string
  code: string
  /** 1-based line numbers in the source file, for the GitHub link. */
  start: number
  end: number
}

export function excerpt(spec: ExcerptSpec): Excerpt {
  const lines = read(spec.file)
  let [first, last] = span(lines, spec.from, spec.to, 0, spec)

  // Pull in the `///` doc comment (and attributes) directly above the anchor.
  if (spec.docs) while (first > 0 && /^\s*(\/\/\/|@)/.test(lines[first - 1])) first--

  const omitted = new Set<number>()
  for (const o of spec.omit ?? []) {
    const [a, b] = o.to === '$' ? [findLine(lines, o.from, first, spec), last - 1] : span(lines, o.from, o.to, first, spec)
    if (a < first || b > last) fail(spec, `omitted lines "${o.from}" fall outside the excerpt`)
    for (let i = a; i <= b; i++) omitted.add(i)
  }

  const out: string[] = []
  for (let i = first; i <= last; i++) {
    if (!omitted.has(i)) {
      out.push(lines[i])
      continue
    }
    // One `// …` per omitted run, at the indentation of its first line.
    if (!omitted.has(i - 1)) out.push(`${' '.repeat(indentOf(lines[i]))}// …`)
  }

  // Trim blank lines at the edges and collapse a blank line left next to an ellipsis.
  const tidy = out.filter((l, i, a) => !(l.trim() === '' && (a[i - 1]?.trim() === '// …' || a[i + 1]?.trim() === '// …')))
  return { file: spec.file, code: dedent(balance(tidy)).join('\n').trim(), start: first + 1, end: last + 1 }
}

/** `{ [pattern id]: Excerpt[] }` for every pattern. */
export function patternCode() {
  return Object.fromEntries(patterns.map((p) => [p.id, p.parts.map(excerpt)]))
}

export interface ChangelogEntry {
  date: string
  title: string
  summary: string
  groups: { heading: string; items: string[] }[]
}

/**
 * Parses CHANGELOG.md. Each release is
 *   ## YYYY-MM-DD — Title
 *   One-paragraph summary.
 *   ### Added
 *   - item
 */
export function changelog(): ChangelogEntry[] {
  const text = readFileSync(resolve(REPO, 'CHANGELOG.md'), 'utf8').replace(/\r\n/g, '\n')
  return text
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const [head, ...rest] = block.split('\n')
      const [date, title] = head.split(/\s+[—-]\s+/)
      const body = rest.join('\n')
      const [summary, ...sections] = body.split(/^### /m)
      return {
        date: date.trim(),
        title: (title ?? '').trim(),
        summary: summary.replace(/\s+/g, ' ').trim(),
        groups: sections.map((s) => {
          const [heading, ...items] = s.split('\n')
          return {
            heading: heading.trim(),
            items: items
              .join('\n')
              .split(/^- /m)
              .slice(1)
              .map((item) => item.replace(/\s+/g, ' ').trim()),
          }
        }),
      }
    })
}
