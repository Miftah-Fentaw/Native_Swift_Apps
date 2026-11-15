import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { findProject, isCommunity, levelColor, type Level } from '../data/projects'
import { tracks } from '../data/learn'
import { AppIcon, Icon, PageHead, usePageTitle } from '../components/ui'
import { PatternChip } from '../components/bits'

const LEVELS: ('All' | Level)[] = ['All', 'Beginner', 'Intermediate', 'Advanced']

export function LearnPage() {
  usePageTitle(
    'Learn',
    `${tracks.length} guided learning tracks for Swift and SwiftUI, from your first view to large-app architecture, built from real open-source apps.`,
  )
  const [params, setParams] = useSearchParams()
  const level = (params.get('level') as Level | null) ?? 'All'
  const shown = useMemo(() => tracks.filter((t) => level === 'All' || t.level === level), [level])
  const selected = shown.find((t) => t.id === params.get('t')) ?? shown[0]

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key === 'level') next.delete('t')
    setParams(next, { replace: true })
  }

  return (
    <div className="container">
      <PageHead
        eyebrow="Learn"
        title="Learning tracks"
        lead="Each track orders real apps — from this repo and the community — so every step builds on the last. Open an app, look at the part named, and move on."
      />

      <div className="filters" role="group" aria-label="Level">
        {LEVELS.map((l) => (
          <button key={l} className={`chip ${level === l ? 'active' : ''}`} onClick={() => set('level', l === 'All' ? null : l)}>
            {l === 'All' ? `All tracks (${tracks.length})` : l}
          </button>
        ))}
      </div>

      <div className="learn">
        <nav className="learn-list" aria-label="Tracks">
          {shown.map((t, i) => (
            <button
              key={t.id}
              className={`learn-item ${selected?.id === t.id ? 'active' : ''}`}
              style={{ ['--track' as string]: t.accent }}
              onClick={() => set('t', t.id)}
            >
              {selected?.id === t.id && <motion.span layoutId="learn-active" className="learn-item-bg" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
              <span className="learn-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="learn-item-text">
                <b>{t.title}</b>
                <small>
                  {t.level} · {t.steps.length} steps
                </small>
              </span>
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.article
              key={selected.id}
              className="track"
              style={{ ['--track' as string]: selected.accent }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <header className="track-head">
                <span className="badge" style={{ ['--badge' as string]: levelColor(selected.level) }}>
                  <span className="dot" />
                  {selected.level}
                </span>
                <h2>{selected.title}</h2>
                <p className="lead">{selected.summary}</p>
                <div className="track-outcome">
                  <span>{Icon.check}</span>
                  <div>
                    <b>By the end</b>
                    <p>{selected.outcome}</p>
                  </div>
                </div>
              </header>

              <ol className="track-steps">
                {selected.steps.map((s, i) => {
                  const p = findProject(s.app)
                  if (!p) return null
                  return (
                    <motion.li key={`${s.app}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                      <span className="track-dot">{i + 1}</span>
                      <div className="track-step">
                        <Link to={`/projects/${p.slug}`} className="track-app">
                          <AppIcon project={p} size={40} />
                          <div>
                            <b>{p.name}</b>
                            <small>
                              {isCommunity(p) ? `Community · ${p.repo}` : 'In this repo'} · {p.level}
                            </small>
                          </div>
                          <span className="track-go">{Icon.arrow}</span>
                        </Link>
                        <p>{s.focus}</p>
                        {s.patterns && (
                          <div className="chip-row">
                            {s.patterns.map((id) => (
                              <PatternChip key={id} id={id} />
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.li>
                  )
                })}
              </ol>

              <div className="track-foot">
                <span className="muted">
                  {selected.steps.filter((s) => !isCommunity(findProject(s.app)!)).length} steps in this repo ·{' '}
                  {selected.steps.filter((s) => isCommunity(findProject(s.app)!)).length} community apps
                </span>
                <Link className="btn btn-ghost" to={`/compare?apps=${[...new Set(selected.steps.map((s) => s.app))].slice(0, 3).join(',')}`}>
                  Compare the first three {Icon.arrow}
                </Link>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
