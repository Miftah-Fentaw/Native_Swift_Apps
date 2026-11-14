// Writes the community app tables in the root README from src/data/projects.ts,
// so the README and the website always list the same apps.
//
//   npm run readme          rewrite the section between the explore-more markers
//   npm run readme -- --check   exit with an error if the README is out of date
//
// Runs on Node 22.18+ (TypeScript type stripping).
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { community, licenseLabel, type Level, type Project } from '../src/data/projects.ts'

const README = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'README.md')
const START = '<!-- explore-more:start -->'
const END = '<!-- explore-more:end -->'

const LEVEL_COLOR: Record<Level, string> = { Beginner: '34C759', Intermediate: 'FF9F0A', Advanced: 'FF453A' }

/** shields.io static badge text: `-` and `_` are escaped by doubling; keep `·` readable like the rest of the README. */
const badgeText = (s: string) => encodeURIComponent(s.replace(/-/g, '--').replace(/_/g, '__')).replace(/%C2%B7/g, '·')
const badge = (text: string, color: string, apple = false) =>
  `https://img.shields.io/badge/${badgeText(text)}-${color}?style=flat-square${apple ? '&logo=apple&logoColor=white' : ''}`

function row(p: Project) {
  const repo = p.repo!
  const owner = repo.split('/')[0]
  const url = `https://github.com/${repo}`
  const platforms = p.platforms ?? ''
  return `  <tr>
    <td width="56" align="center"><a href="${url}"><img src="https://github.com/${owner}.png?size=88" width="44" height="44" alt="${owner} on GitHub"></a></td>
    <td>
      <a href="${url}"><b>${p.name}</b></a>&nbsp;
      <img src="${badge(p.level, LEVEL_COLOR[p.level])}" alt="${p.level}" height="16">
      <img src="${badge(platforms, '1C1C1E', true)}" alt="${platforms.replace(/ · /g, ', ')}" height="16">
      <img src="${badge(licenseLabel(p), '8E8E93')}" alt="${licenseLabel(p)}" height="16">
      <img src="https://img.shields.io/github/stars/${repo}?style=flat-square&label=%E2%98%85&color=1C1C1E" alt="GitHub stars" height="16"><br>
      <sub>${p.tagline}</sub>
    </td>
    <td width="80" align="right"><a href="${url}"><sub>GitHub&nbsp;→</sub></a></td>
  </tr>`
}

/** Puts Swift attributes and modifiers in code spans, so `@Observable` isn't rendered as a GitHub @mention. */
const codeify = (s: string) => s.replace(/(^|[\s(])([@.][A-Za-z]\w*)/g, '$1`$2`')

// Names that stay capitalized at the start of a list item.
const PROPER_WORDS = new Set(['Swift', 'App', 'Apple', 'Siri', 'Shortcuts', 'Combine', 'Observation', 'Rust', 'Mac', 'Bluetooth'])
const PROPER_PHRASES = ['Live Activities', 'Watch Connectivity', 'Face ID', 'Touch ID', 'Dynamic Type']

/** Lower-cases an item's first word unless it's a name, so the items read as one sentence. */
const lowerFirst = (item: string) => {
  const first = item.split(/[\s/,]/)[0]
  const isName = PROPER_WORDS.has(first) || PROPER_PHRASES.some((p) => item.startsWith(p)) || /^.+[A-Z]/.test(first)
  if (isName || !/^[A-Z]/.test(first)) return item
  return item[0].toLowerCase() + item.slice(1)
}

const sentence = (items: string[]) => {
  const text = items.map((item, i) => codeify(i === 0 ? item : lowerFirst(item))).join(', ')
  return text.endsWith('.') ? text : `${text}.`
}

function section() {
  const parts = [
    START,
    '<!-- Generated from website/src/data/projects.ts by website/scripts/readme.ts. Edit the data, then run `npm run readme` in website/. -->',
  ]
  for (const level of ['Beginner', 'Intermediate', 'Advanced'] as Level[]) {
    const apps = community.filter((p) => p.level === level)
    parts.push(
      '',
      `### ${level}`,
      '',
      '<table>',
      ...apps.map(row),
      '</table>',
      '',
      apps.map((p) => `**${p.name}:** ${sentence(p.learn)}${p.note ? ` *${p.note}*` : ''}`).join('  \n'),
    )
  }
  parts.push(END)
  return parts.join('\n')
}

const readme = readFileSync(README, 'utf8')
const start = readme.indexOf(START)
const end = readme.indexOf(END)
if (start === -1 || end === -1) {
  console.error(`README.md needs the ${START} and ${END} markers.`)
  process.exit(1)
}
const next = readme.slice(0, start) + section() + readme.slice(end + END.length)

if (process.argv.includes('--check')) {
  if (next !== readme) {
    console.error('README.md is out of date. Run `npm run readme` in website/.')
    process.exit(1)
  }
  console.log('README.md community section is up to date.')
} else {
  writeFileSync(README, next)
  console.log(`Wrote ${community.length} community apps to README.md.`)
}
