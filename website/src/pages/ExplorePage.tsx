import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { allProjects, community, projects, roadmap, searchProjects, techCounts, type Level } from '../data/projects'
import { ProjectCard } from '../components/layout'
import { Icon, usePageTitle } from '../components/ui'

const LEVELS: ('All' | Level)[] = ['All', 'Beginner', 'Intermediate', 'Advanced']
const SOURCES = [
  { id: null, label: 'All sources' },
  { id: 'repo', label: `In this repo (${projects.length})` },
  { id: 'community', label: `Community (${community.length})` },
] as const
type SourceId = (typeof SOURCES)[number]['id']

const PLATFORMS = ['iOS', 'iPadOS', 'macOS', 'watchOS', 'tvOS', 'visionOS']
/** Tech chips shown before "More technologies" is pressed. */
const TECH_PREVIEW = 14

const COPY: Record<'all' | 'repo' | 'community', { title: string; lead: string; description: string }> = {
  all: {
    title: 'All projects',
    lead: 'The apps in this repository and hand-picked open-source Swift apps from the community. Filter by level, platform or technology, or search by what you want to learn.',
    description: `Browse ${projects.length} Native Swift Apps projects and ${community.length} open-source community Swift apps by level, platform and technology.`,
  },
  repo: {
    title: 'Apps in this repo',
    lead: 'Complete Xcode projects in the Native Swift Apps repository, each with a README and screenshots.',
    description: 'Native Swift and SwiftUI apps in the Native Swift Apps repository, with source code, screenshots and READMEs.',
  },
  community: {
    title: 'Community apps',
    lead: 'Open-source Swift apps by other developers, picked for learning. They live in their own GitHub repositories — check each license before reusing code.',
    description: `${community.length} hand-picked open-source Swift and SwiftUI apps for iOS, iPadOS, macOS, watchOS, tvOS and visionOS, sorted by level, with links to their GitHub repositories.`,
  },
}

export function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [allTechShown, setAllTechShown] = useState(false)
  const level = (params.get('level') as Level | null) ?? 'All'
  const tech = params.get('tech')
  const platform = params.get('platform')
  const source = (params.get('source') as SourceId) ?? null
  const showPlanned = params.get('planned') === '1'
  const copy = COPY[source ?? 'all']
  usePageTitle(copy.title, copy.description)

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  // Everything that matches the source filter; level, platform, tech and search narrow it further.
  const sourcePool = useMemo(() => {
    const base = source === 'repo' ? projects : source === 'community' ? community : allProjects
    return showPlanned && source !== 'community' ? [...base, ...roadmap] : base
  }, [source, showPlanned])

  const list = useMemo(() => {
    let pool = sourcePool
    if (level !== 'All') pool = pool.filter((p) => p.level === level)
    if (platform) pool = pool.filter((p) => p.platforms?.split(' · ').some((x) => x.startsWith(platform)))
    if (tech) pool = pool.filter((p) => p.tech.includes(tech))
    if (query.trim()) pool = searchProjects(query, pool).map((r) => r.project)
    return pool
  }, [sourcePool, level, platform, tech, query])

  const techs = useMemo(() => techCounts(sourcePool.filter((p) => p.status !== 'planned')), [sourcePool])
  const shownTech = allTechShown ? techs : techs.slice(0, TECH_PREVIEW)
  // Keep the active technology visible even when it's outside the preview.
  const visibleTech = tech && !shownTech.some((t) => t.name === tech) ? [...shownTech, { name: tech, count: 0 }] : shownTech

  return (
    <div className="container">
      <div className="page-head">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} key={copy.title}>
          <div className="eyebrow">Explore</div>
          <h1 className="h-section">{copy.title}</h1>
          <p className="lead">{copy.lead}</p>
        </motion.div>
      </div>

      <div className="filters" role="group" aria-label="Source">
        {SOURCES.map((s) => (
          <button key={s.label} className={`chip ${source === s.id ? 'active' : ''}`} onClick={() => update('source', s.id)}>
            {s.label}
          </button>
        ))}
        <div className="filter-search">
          {Icon.search}
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search features, frameworks…" aria-label="Search projects" />
        </div>
      </div>

      <div className="filters" style={{ marginTop: -16 }} role="group" aria-label="Level and platform">
        {LEVELS.map((l) => (
          <button key={l} className={`chip ${level === l ? 'active' : ''}`} onClick={() => update('level', l === 'All' ? null : l)}>
            {l === 'All' ? 'All levels' : l}
          </button>
        ))}
        <span className="filter-divider" />
        {PLATFORMS.map((p) => (
          <button key={p} className={`chip ${platform === p ? 'active' : ''}`} onClick={() => update('platform', platform === p ? null : p)}>
            {p}
          </button>
        ))}
        {source !== 'community' && (
          <>
            <span className="filter-divider" />
            <button className={`chip ${showPlanned ? 'active' : ''}`} onClick={() => update('planned', showPlanned ? null : '1')}>
              Include planned
            </button>
          </>
        )}
      </div>

      <div className="filters" style={{ marginTop: -16 }} role="group" aria-label="Technology">
        {visibleTech.map((t) => (
          <button key={t.name} className={`chip ${tech === t.name ? 'active' : ''}`} onClick={() => update('tech', tech === t.name ? null : t.name)}>
            {t.name}
          </button>
        ))}
        {techs.length > TECH_PREVIEW && (
          <button className="chip chip-more" onClick={() => setAllTechShown((v) => !v)}>
            {allTechShown ? 'Fewer technologies' : `More technologies (${techs.length - TECH_PREVIEW})`}
          </button>
        )}
      </div>

      <div className="result-count muted" aria-live="polite">
        {list.length} {list.length === 1 ? 'project' : 'projects'}
      </div>

      <motion.div layout className="project-grid" style={{ paddingBottom: 100 }}>
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={Math.min(i, 8)} />
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && <div className="empty">No projects match these filters yet.</div>}
    </div>
  )
}
