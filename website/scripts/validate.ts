// Checks that every cross-reference in the hub's data points at something real:
// track steps, glossary apps, patterns and topics. Runs at the start of every
// build and dev server start (see vite.config.ts), so a typo in a slug fails
// loudly instead of rendering a missing card.
import { allProjects, projects } from '../src/data/projects'
import { patterns } from '../src/data/patterns'
import { glossary, techInfo, tracks } from '../src/data/learn'

export function validateData() {
  const errors: string[] = []
  const slugs = new Set(allProjects.map((p) => p.slug))
  const repoSlugs = new Set(projects.map((p) => p.slug))
  const patternIds = new Set(patterns.map((p) => p.id))
  const termIds = new Set(glossary.map((t) => t.id))

  const unique = (label: string, ids: string[]) => {
    const seen = new Set<string>()
    for (const id of ids) {
      if (seen.has(id)) errors.push(`${label} id "${id}" is used twice`)
      seen.add(id)
    }
  }
  unique('Project', allProjects.map((p) => p.slug))
  unique('Pattern', patterns.map((p) => p.id))
  unique('Glossary', glossary.map((t) => t.id))
  unique('Track', tracks.map((t) => t.id))

  for (const t of tracks)
    for (const s of t.steps) {
      if (!slugs.has(s.app)) errors.push(`Track "${t.id}" links to unknown app "${s.app}"`)
      for (const id of s.patterns ?? []) if (!patternIds.has(id)) errors.push(`Track "${t.id}" links to unknown pattern "${id}"`)
    }
  for (const term of glossary) for (const slug of term.apps) if (!slugs.has(slug)) errors.push(`Glossary "${term.id}" links to unknown app "${slug}"`)
  for (const p of patterns) {
    if (!repoSlugs.has(p.project)) errors.push(`Pattern "${p.id}" belongs to unknown repo app "${p.project}"`)
    for (const id of p.terms) if (!termIds.has(id)) errors.push(`Pattern "${p.id}" links to unknown glossary term "${id}"`)
    for (const t of p.tech) if (!techInfo[t]) errors.push(`Pattern "${p.id}" uses technology "${t}" with no topic in techInfo`)
  }
  for (const p of allProjects) for (const t of p.tech) if (!techInfo[t]) errors.push(`${p.name} uses technology "${t}" with no topic in techInfo (src/data/learn.ts)`)

  if (errors.length) throw new Error(`Website data has broken references:\n  - ${errors.join('\n  - ')}`)
}
