import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { allTech, projects, roadmap, searchProjects, type Level } from '../data/projects'
import { ProjectCard } from '../components/layout'
import { Icon, usePageTitle } from '../components/ui'

const LEVELS: ('All' | Level)[] = ['All', 'Beginner', 'Intermediate', 'Advanced']

export function ExplorePage() {
  usePageTitle('Explore projects', 'Browse every Native Swift Apps project by level and technology.')
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const level = (params.get('level') as Level | null) ?? 'All'
  const tech = params.get('tech')
  const showPlanned = params.get('planned') === '1'

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    let pool = showPlanned ? [...projects, ...roadmap] : projects
    if (level !== 'All') pool = pool.filter((p) => p.level === level)
    if (tech) pool = pool.filter((p) => p.tech.includes(tech))
    if (query.trim()) pool = searchProjects(query, pool).map((r) => r.project)
    return pool
  }, [level, tech, query, showPlanned])

  return (
    <div className="container">
      <div className="page-head">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="eyebrow">Explore</div>
          <h1 className="h-section">All projects</h1>
          <p className="lead">Filter by level or technology, or search by what you want to learn.</p>
        </motion.div>
      </div>

      <div className="filters">
        {LEVELS.map((l) => (
          <button key={l} className={`chip ${level === l ? 'active' : ''}`} onClick={() => update('level', l === 'All' ? null : l)}>
            {l}
          </button>
        ))}
        <span style={{ width: 1, height: 22, background: 'var(--line-strong)', margin: '0 4px' }} />
        <button className={`chip ${showPlanned ? 'active' : ''}`} onClick={() => update('planned', showPlanned ? null : '1')}>
          Include planned
        </button>
        <div className="filter-search">
          {Icon.search}
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search features, frameworks…" aria-label="Search projects" />
        </div>
      </div>

      <div className="filters" style={{ marginTop: -16 }}>
        {allTech.map((t) => (
          <button key={t.name} className={`chip ${tech === t.name ? 'active' : ''}`} onClick={() => update('tech', tech === t.name ? null : t.name)}>
            {t.name}
          </button>
        ))}
      </div>

      <motion.div layout className="project-grid" style={{ paddingBottom: 100 }}>
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && <div className="empty">No projects match these filters yet.</div>}
    </div>
  )
}
