import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import {
  CLONE_COMMAND,
  allScreens,
  allTech,
  levels,
  projects,
  roadmap,
  searchProjects,
  type Project,
  type Screen,
} from '../data/projects'
import { AppIcon, CopyButton, Icon, Lightbox, Phone, Reveal, StatusBadge } from '../components/ui'
import { ProjectCard } from '../components/layout'

const TABS = ['Apps', 'Screens', 'Features', 'Technology', 'Roadmap'] as const
type Tab = (typeof TABS)[number]

/** Tabbed library: one repo, browsed by apps, screens, features, tech or roadmap. */
export function Library() {
  const [params] = useSearchParams()
  const [tab, setTab] = useState<Tab>('Apps')
  const [zoomed, setZoomed] = useState<Screen | null>(null)

  // The nav's "Roadmap" link opens this section on the Roadmap tab.
  useEffect(() => {
    if (params.get('s') === 'roadmap') setTab('Roadmap')
  }, [params])

  return (
    <section className="section" id="library">
      <div className="container">
        <Reveal>
          <div className="center" style={{ textAlign: 'center' }}>
            <div className="eyebrow">The library</div>
            <h2 className="h-section">
              One repo.
              <br />
              Every way to explore it.
            </h2>
          </div>
        </Reveal>

        <div style={{ textAlign: 'center' }}>
          <div className="tabs" role="tablist">
            {TABS.map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {tab === t && <motion.div layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span>{t}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{ duration: 0.35 }}
            >
              {tab === 'Apps' && (
                <div className="project-grid">
                  {projects.map((p, i) => (
                    <ProjectCard key={p.slug} project={p} index={i} />
                  ))}
                </div>
              )}

              {tab === 'Screens' && (
                <div className="screens-grid">
                  {allScreens.map((s, i) => (
                    <motion.figure
                      key={s.src}
                      className="screen-tile"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ y: -6 }}
                      onClick={() => setZoomed(s)}
                    >
                      <Phone screen={s} />
                      <figcaption>
                        <img src={s.project.icon} alt="" />
                        {s.project.name} · {s.label}
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              )}

              {tab === 'Features' && (
                <div className="feature-grid">
                  {projects.flatMap((p) =>
                    p.features.map((f, i) => (
                      <motion.div key={`${p.slug}-${f.title}`} className="card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <h4>
                          <AppIcon project={p} size={22} />
                          {p.name} · {f.title}
                        </h4>
                        <ul>
                          {f.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )),
                  )}
                </div>
              )}

              {tab === 'Technology' && <TechGrid />}

              {tab === 'Roadmap' && <RoadmapGrid />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Lightbox screen={zoomed} onClose={() => setZoomed(null)} />
    </section>
  )
}

function TechGrid() {
  return (
    <div className="tech-grid" style={{ marginTop: 0 }}>
      {allTech.map((t, i) => (
        <motion.div key={t.name} className="tech-card" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}>
          <strong>{t.name}</strong>
          <div className="tech-icons">
            {t.projects.map((p) => (
              <Link key={p.slug} to={`/projects/${p.slug}`} title={p.name}>
                <AppIcon project={p} size={26} />
              </Link>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function RoadmapGrid() {
  return (
    <div className="feature-grid" id="roadmap">
      {levels.map((l) => (
        <div className="card" key={l.level}>
          <h4>
            <span className="badge" style={{ ['--badge' as string]: l.color }}>
              <span className="dot" />
              {l.level}
            </span>
          </h4>
          <ul>
            {roadmap
              .filter((p) => p.level === l.level)
              .map((p) => (
                <li key={p.slug}>
                  <b>{p.name}</b> <span className="muted">— {p.tagline}</span>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

const SUGGESTIONS = [
  'Which app uses async networking?',
  'Show me SwiftData and Charts',
  'Where can I learn MapKit?',
  'An expression parser with unit tests',
]

/** Local "ask" demo: types a question, shows working steps, then real matches from the project data. */
export function AskHub() {
  const [value, setValue] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'done'>('idle')
  const [step, setStep] = useState(0)
  const [results, setResults] = useState<ReturnType<typeof searchProjects>>([])
  const [asked, setAsked] = useState('')

  // Typewriter placeholder that cycles through example questions.
  useEffect(() => {
    if (value) return
    let i = 0
    let char = 0
    let deleting = false
    let timer: number
    const tick = () => {
      const text = SUGGESTIONS[i]
      if (!deleting) {
        char++
        if (char > text.length) {
          deleting = true
          timer = window.setTimeout(tick, 1600)
          setPlaceholder(text)
          return
        }
      } else {
        char--
        if (char === 0) {
          deleting = false
          i = (i + 1) % SUGGESTIONS.length
        }
      }
      setPlaceholder(text.slice(0, char))
      timer = window.setTimeout(tick, deleting ? 22 : 48)
    }
    tick()
    return () => window.clearTimeout(timer)
  }, [value])

  const ask = (question: string) => {
    const q = question.trim()
    if (!q) return
    setAsked(q)
    setPhase('thinking')
    setStep(0)
    const pool = [...projects]
    window.setTimeout(() => setStep(1), 550)
    window.setTimeout(() => setStep(2), 1100)
    window.setTimeout(() => {
      setResults(searchProjects(q, pool).filter((r) => r.score > 0))
      setPhase('done')
    }, 1650)
  }

  const steps = ['Scanning projects…', 'Reading features and READMEs…', 'Ranking matches…']

  return (
    <section className="section" id="ask" style={{ background: 'var(--bg-sunken)' }}>
      <div className="container">
        <Reveal>
          <div style={{ textAlign: 'center' }}>
            <div className="eyebrow">Ask the hub</div>
            <h2 className="h-section">
              Know what you want to learn?
              <br />
              <span className="muted">Find the app that teaches it.</span>
            </h2>
          </div>
        </Reveal>

        <div className="ask">
          <form
            className="ask-box"
            onSubmit={(e) => {
              e.preventDefault()
              ask(value)
            }}
          >
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder || ' '} aria-label="Ask the hub" />
            <button className="ask-send" type="submit" aria-label="Ask">
              {Icon.up}
            </button>
          </form>
          <div className="ask-suggestions">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="chip"
                onClick={() => {
                  setValue(s)
                  ask(s)
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="ask-result">
            <AnimatePresence mode="wait">
              {phase === 'thinking' && (
                <motion.div key="thinking" className="ask-steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {steps.slice(0, step + 1).map((s, i) => (
                    <motion.div key={s} className="ask-step" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                      {i === step ? <span className="spinner" /> : <span style={{ color: 'var(--accent)' }}>✓</span>}
                      {s}
                    </motion.div>
                  ))}
                </motion.div>
              )}
              {phase === 'done' && (
                <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="muted" style={{ fontSize: 14 }}>
                    {results.length > 0
                      ? `Found ${results.length} ${results.length === 1 ? 'app' : 'apps'} for “${asked}”`
                      : `Nothing matches “${asked}” yet — check the roadmap, or suggest it on GitHub.`}
                  </div>
                  {results.map((r, i) => (
                    <motion.div key={r.project.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                      <Link to={`/projects/${r.project.slug}`} className="ask-hit">
                        <AppIcon project={r.project} size={40} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <b>{r.project.name}</b>
                          <small>{r.hits.join(' · ')}</small>
                        </div>
                        <StatusBadge project={r.project} />
                        {Icon.arrow}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function PathApp({ project }: { project: Project }) {
  const planned = project.status === 'planned'
  const content = (
    <>
      <AppIcon project={project} size={26} />
      <span className="grow">{project.name}</span>
      {!planned && <span style={{ color: 'var(--text-3)' }}>{Icon.arrow}</span>}
      {planned && <small>planned</small>}
    </>
  )
  return planned ? (
    <div className="path-app planned">{content}</div>
  ) : (
    <Link className="path-app" to={`/projects/${project.slug}`}>
      {content}
    </Link>
  )
}

/** Three levels joined by a line that fills as you scroll. */
export function LearningPath() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'center 50%'] })
  const fill = useTransform(scrollYProgress, (v) => Math.min(1, Math.max(0, v)))

  return (
    <section className="section" id="path">
      <div className="container">
        <Reveal>
          <div style={{ textAlign: 'center' }}>
            <div className="eyebrow">Learning path</div>
            <h2 className="h-section">Start simple. Level up.</h2>
            <p className="lead center">Every app is tagged by difficulty, so you always know what to pick up next.</p>
          </div>
        </Reveal>

        <div className="path" ref={ref}>
          <div className="path-line">
            <motion.div className="path-line-fill" style={{ scaleX: fill }} />
          </div>
          {levels.map((l, i) => (
            <Reveal key={l.level} delay={i * 0.12}>
              <div className="path-step">
                <div className="path-node" style={{ background: l.color }}>
                  {i + 1}
                </div>
                <h3>{l.level}</h3>
                <div className="path-topics">{l.topics.join(' · ')}</div>
                <div className="path-apps">
                  {[...projects, ...roadmap]
                    .filter((p) => p.level === l.level)
                    .map((p) => (
                      <PathApp key={p.slug} project={p} />
                    ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TechStack() {
  return (
    <section className="section" id="tech" style={{ paddingTop: 40 }}>
      <div className="container">
        <Reveal>
          <div className="eyebrow">Technology</div>
          <h2 className="h-section">Native, first-party, no shortcuts.</h2>
          <p className="lead">
            Only Apple frameworks — no third-party packages. Each card shows which apps use that technology today.
          </p>
        </Reveal>
        <TechGrid />
      </div>
    </section>
  )
}

export function Cta() {
  return (
    <section className="cta">
      <div className="cta-glow" />
      <div className="container" style={{ position: 'relative' }}>
        <Reveal>
          <h2 className="h-display" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
            Clone. Run. Learn.
          </h2>
          <p className="lead center" style={{ marginTop: 18 }}>
            One repository, every app. Open any project folder in Xcode and press Run.
          </p>
          <div className="clone">
            <code>{CLONE_COMMAND}</code>
            <CopyButton text={CLONE_COMMAND} className="btn btn-primary" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
