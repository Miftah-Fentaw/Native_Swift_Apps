import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { patterns } from '../data/patterns'
import { glossary, termKinds, type TermKind } from '../data/learn'
import { Icon, PageHead, usePageTitle } from '../components/ui'
import { CodeBlock, Rich } from '../components/code'
import { AppChip, PatternChip, scrollToId } from '../components/bits'

export function GlossaryPage() {
  usePageTitle('Glossary', `${glossary.length} Swift, SwiftUI, SwiftData and concurrency terms explained in plain words, with the open-source apps that use each one.`)
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const kind = params.get('kind') as TermKind | null
  const target = params.get('t')

  useEffect(() => scrollToId(target ? `term-${target}` : null), [target])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return glossary
      .filter((t) => (!kind || t.kind === kind) && (!q || `${t.term} ${t.definition}`.toLowerCase().includes(q)))
      .sort((a, b) => a.term.replace(/^[@#]/, '').localeCompare(b.term.replace(/^[@#]/, ''), 'en', { sensitivity: 'base' }))
  }, [kind, query])

  const setKind = (k: TermKind | null) => {
    const next = new URLSearchParams(params)
    if (k) next.set('kind', k)
    else next.delete('kind')
    next.delete('t')
    setParams(next, { replace: true })
  }

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <PageHead
        eyebrow="Glossary"
        title="Swift terms, in plain words"
        lead="Short definitions of the language features, SwiftUI APIs and architecture ideas you’ll meet in these apps — with the apps that use each one."
      />

      <div className="filters" role="group" aria-label="Kind">
        <button className={`chip ${!kind ? 'active' : ''}`} onClick={() => setKind(null)}>
          All ({glossary.length})
        </button>
        {termKinds.map((k) => (
          <button key={k} className={`chip ${kind === k ? 'active' : ''}`} onClick={() => setKind(kind === k ? null : k)}>
            {k} <span className="muted">{glossary.filter((t) => t.kind === k).length}</span>
          </button>
        ))}
        <div className="filter-search">
          {Icon.search}
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search terms…" aria-label="Search the glossary" />
        </div>
      </div>

      <div className="glossary">
        {list.map((t, i) => {
          const shownIn = patterns.filter((p) => p.terms.includes(t.id))
          return (
            <motion.article
              key={t.id}
              id={`term-${t.id}`}
              className={`term ${target === t.id ? 'targeted' : ''}`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: Math.min(i % 3, 2) * 0.04 }}
            >
              <header>
                <h2>
                  <a href={`#/glossary?t=${t.id}`} aria-label={`Link to ${t.term}`}>
                    {t.term}
                  </a>
                </h2>
                <span className="term-kind">{t.kind}</span>
              </header>
              <p>
                <Rich text={t.definition} />
              </p>
              {t.example && <CodeBlock code={t.example} />}
              {shownIn.length > 0 && (
                <div className="chip-col">
                  {shownIn.map((p) => (
                    <PatternChip key={p.id} id={p.id} />
                  ))}
                </div>
              )}
              <footer>
                <div className="chip-row">
                  {t.apps.slice(0, 6).map((slug) => (
                    <AppChip key={slug} slug={slug} />
                  ))}
                </div>
                {t.doc && (
                  <a className="doc-link term-doc" href={t.doc} target="_blank" rel="noreferrer">
                    Docs {Icon.external}
                  </a>
                )}
              </footer>
            </motion.article>
          )
        })}
      </div>
      {list.length === 0 && (
        <div className="empty">
          No terms match “{query}”. Try the <Link className="doc-link" to="/patterns">patterns</Link> instead.
        </div>
      )}
    </div>
  )
}
