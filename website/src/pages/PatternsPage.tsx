import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import code from 'virtual:pattern-code'
import { REPO_URL, findProject, projects } from '../data/projects'
import { patterns } from '../data/patterns'
import { topicPath } from '../data/learn'
import { AppIcon, Icon, PageHead, usePageTitle } from '../components/ui'
import { CodeBlock, Rich } from '../components/code'
import { TermChip, scrollToId } from '../components/bits'

const sourceUrl = (file: string, start: number, end: number) => `${REPO_URL}/blob/main/${file}#L${start}-L${end}`

export function PatternsPage() {
  usePageTitle(
    'Code patterns',
    `${patterns.length} Swift and SwiftUI code patterns from real apps — async let, Codable, SwiftData, Swift Charts, custom layouts and more — explained and linked to the source.`,
  )
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const app = params.get('app')
  const target = params.get('p')

  useEffect(() => scrollToId(target), [target])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return patterns.filter(
      (p) =>
        (!app || p.project === app) &&
        (!q || [p.title, p.summary, ...p.tech, ...p.notes, ...p.parts.map((x) => x.file)].join(' ').toLowerCase().includes(q)),
    )
  }, [app, query])

  const setApp = (slug: string | null) => {
    const next = new URLSearchParams(params)
    if (slug) next.set('app', slug)
    else next.delete('app')
    next.delete('p')
    setParams(next, { replace: true })
  }

  return (
    <div className="container">
      <PageHead
        eyebrow="Patterns"
        title="Code patterns from the apps"
        lead="Real excerpts from SwiftCalc, Weather and Journal, each with why it is written that way. They are cut from the Swift source when the site is built, so they always match the repository."
      />

      <div className="filters" role="group" aria-label="App">
        <button className={`chip ${!app ? 'active' : ''}`} onClick={() => setApp(null)}>
          All apps ({patterns.length})
        </button>
        {projects.map((p) => (
          <button key={p.slug} className={`chip ${app === p.slug ? 'active' : ''}`} onClick={() => setApp(p.slug)}>
            <AppIcon project={p} size={18} />
            {p.name} ({patterns.filter((x) => x.project === p.slug).length})
          </button>
        ))}
        <div className="filter-search">
          {Icon.search}
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patterns, frameworks, files…" aria-label="Search patterns" />
        </div>
      </div>

      <div className="pattern-layout">
        <aside className="pattern-toc" aria-label="Patterns">
          {list.map((p) => (
            <a
              key={p.id}
              href={`#/patterns?p=${p.id}${app ? `&app=${app}` : ''}`}
              className={target === p.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                scrollToId(p.id)
              }}
            >
              {p.title}
            </a>
          ))}
        </aside>

        <div className="pattern-list">
          {list.length === 0 && <div className="empty">No patterns match “{query}”.</div>}
          {list.map((p, i) => {
            const project = findProject(p.project)!
            return (
              <motion.article
                key={p.id}
                id={p.id}
                className={`pattern ${target === p.id ? 'targeted' : ''}`}
                style={{ ['--card-accent' as string]: project.accent }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: Math.min(i, 3) * 0.04 }}
              >
                <header className="pattern-head">
                  <Link to={`/projects/${project.slug}`} className="pattern-app">
                    <AppIcon project={project} size={28} />
                    {project.name}
                  </Link>
                  <h2>
                    <a href={`#/patterns?p=${p.id}`} className="doc-anchor" aria-label={`Link to ${p.title}`}>
                      #
                    </a>
                    {p.title}
                  </h2>
                  <p>
                    <Rich text={p.summary} />
                  </p>
                  <div className="tag-row">
                    {p.tech.map((t) => (
                      <Link key={t} className="tag" to={topicPath(t)}>
                        {t}
                      </Link>
                    ))}
                  </div>
                </header>

                {(code[p.id] ?? []).map((part) => (
                  <CodeBlock
                    key={`${part.file}-${part.start}`}
                    code={part.code}
                    file={part.file}
                    lines={part.start === part.end ? `line ${part.start}` : `lines ${part.start}–${part.end}`}
                    href={sourceUrl(part.file, part.start, part.end)}
                  />
                ))}

                <div className="pattern-notes">
                  <h3>Why it’s written this way</h3>
                  <ul>
                    {p.notes.map((n) => (
                      <li key={n}>
                        <Rich text={n} />
                      </li>
                    ))}
                  </ul>
                  {p.terms.length > 0 && (
                    <div className="chip-row">
                      <span className="muted" style={{ fontSize: 13 }}>
                        Terms:
                      </span>
                      {p.terms.map((id) => (
                        <TermChip key={id} id={id} />
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
