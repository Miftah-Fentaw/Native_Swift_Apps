import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { AUTHOR, CLONE_COMMAND, REPO_URL, projects, roadmap, allTech, type Project } from '../data/projects'
import { AppIcon, Icon, LevelBadge, Phone, StatusBadge } from './ui'

export function Nav({ theme, onToggleTheme, onOpenSearch }: { theme: string; onToggleTheme: () => void; onOpenSearch: () => void }) {
  // Three floating pills: brand on the left, logo + links in the middle, actions on the right.
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-pill nav-brand">
          <span className="nav-dot" aria-hidden />
          Native Swift Apps
        </Link>

        <nav className="nav-pill nav-center" aria-label="Main">
          <Link to="/" className="nav-logo" aria-label="Home">
            <img src="./swift.jpeg" alt="" />
          </Link>
          <div className="nav-links">
            <NavLink to="/explore">Explore</NavLink>
            <NavLink to="/docs">Docs</NavLink>
            <a href="#/?s=path">Learning path</a>
            <a href="#/?s=roadmap">Roadmap</a>
          </div>
        </nav>

        <div className="nav-pill nav-actions">
          <button className="search-trigger" onClick={onOpenSearch} aria-label="Search projects">
            {Icon.search}
            <span>Search the hub</span>
            <kbd>⌘K</kbd>
          </button>
          <button className="icon-btn" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'}>
            {theme === 'dark' ? Icon.sun : Icon.moon}
          </button>
          <a className="icon-btn" href={REPO_URL} target="_blank" rel="noreferrer" aria-label="GitHub repository">
            {Icon.github}
          </a>
        </div>
      </div>
    </header>
  )
}

const FOOTER_WORD = 'Native Swift Apps'

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="footer-col">
      <div className="footer-col-title">{title}</div>
      {children}
    </div>
  )
}

const ext = { target: '_blank', rel: 'noreferrer' } as const

/** Animated footer: link columns, a scrolling tech ticker and a giant wordmark that rises in letter by letter. */
export function Footer() {
  const ticker = [...allTech.map((t) => t.name), ...projects.map((p) => p.name)]
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="ticker" aria-hidden>
        <motion.div className="ticker-track" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 40, ease: 'linear', repeat: Infinity }}>
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="ticker-item">
              <img src="./swift.jpeg" alt="" />
              {t}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="container footer-grid">
        <div className="footer-intro">
          <motion.a
            href={REPO_URL}
            {...ext}
            className="footer-logo"
            aria-label="Native Swift Apps on GitHub"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ rotate: -10, scale: 1.08 }}
          >
            <img src="./swift.jpeg" alt="Swift" />
          </motion.a>
          <p>Open-source Swift and SwiftUI apps you can clone, run and learn from.</p>
          <a className="btn btn-primary" href={REPO_URL} {...ext}>
            {Icon.github} Star on GitHub
          </a>
        </div>

        <FooterColumn title="Projects">
          {projects.map((p) => (
            <Link key={p.slug} to={`/projects/${p.slug}`}>
              {p.name}
            </Link>
          ))}
          <a href="#/?s=roadmap">Roadmap</a>
        </FooterColumn>

        <FooterColumn title="Explore">
          <Link to="/explore">All projects</Link>
          <Link to="/docs">Documentation</Link>
          <a href="#/?s=path">Learning path</a>
          <a href="#/?s=ask">Ask the hub</a>
        </FooterColumn>

        <FooterColumn title="Repository">
          <a href={REPO_URL} {...ext}>GitHub</a>
          <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} {...ext}>Contributing</a>
          <a href={`${REPO_URL}/blob/main/CODE_OF_CONDUCT.md`} {...ext}>Code of conduct</a>
          <a href={`${REPO_URL}/blob/main/SECURITY.md`} {...ext}>Security</a>
          <a href={`${REPO_URL}/blob/main/LICENSE`} {...ext}>MIT License</a>
        </FooterColumn>

        <FooterColumn title="Author">
          <a href={AUTHOR.url} {...ext}>{AUTHOR.name}</a>
          <a href={`${AUTHOR.url}?tab=repositories`} {...ext}>More projects</a>
        </FooterColumn>
      </div>

      {/* The row (not each clipped letter) watches the viewport, then staggers its letters up. */}
      <motion.div
        className="footer-word"
        aria-label={FOOTER_WORD}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.035 }}
      >
        {FOOTER_WORD.split('').map((ch, i) => (
          <motion.span
            key={i}
            aria-hidden
            variants={{ hidden: { y: '110%', opacity: 0 }, shown: { y: '0%', opacity: 1 } }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
            whileHover={{ y: '-12%', transition: { duration: 0.2 } }}
          >
            {ch === ' ' ? '\u00a0' : ch}
          </motion.span>
        ))}
      </motion.div>

      <div className="container footer-bottom">
        <span>
          © {year}{' '}
          <a href={AUTHOR.url} {...ext}>
            {AUTHOR.name}
          </a>{' '}
          · MIT License
        </span>
        <span>Build. Learn. Explore.</span>
        <button className="footer-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top {Icon.up}
        </button>
      </div>
    </footer>
  )
}

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const shots = project.screens.slice(0, 3)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <Link to={`/projects/${project.slug}`} className="project-card" style={{ ['--card-accent' as string]: project.accent }}>
        <div className="project-card-media">
          {shots.length > 0 ? (
            shots.map((s) => <Phone key={s.src} screen={s} />)
          ) : (
            <div className="empty-media">
              <AppIcon project={project} size={72} />
              <div style={{ marginTop: 12, textAlign: 'center' }}>Screenshots coming soon</div>
            </div>
          )}
        </div>
        <div className="project-card-body">
          <div className="project-card-head">
            <AppIcon project={project} size={40} />
            <div>
              <h3>{project.name}</h3>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                <LevelBadge project={project} />
                <StatusBadge project={project} />
              </div>
            </div>
          </div>
          <p>{project.tagline}</p>
          <div className="tag-row">
            {project.tech.slice(0, 4).map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

type PaletteItem = { group: string; label: string; hint?: string; project?: Project; run: () => void }

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const items = useMemo<PaletteItem[]>(() => {
    const go = (path: string) => () => {
      navigate(path)
      onClose()
    }
    const all: PaletteItem[] = [
      ...projects.map((p) => ({ group: 'Projects', label: p.name, hint: p.tagline, project: p, run: go(`/projects/${p.slug}`) })),
      ...projects.flatMap((p) =>
        p.features.flatMap((f) =>
          f.items.map((item) => ({ group: 'Features', label: item, hint: p.name, project: p, run: go(`/projects/${p.slug}`) })),
        ),
      ),
      ...allTech.map((t) => ({
        group: 'Technology',
        label: t.name,
        hint: t.projects.map((p) => p.name).join(', '),
        run: go(`/explore?tech=${encodeURIComponent(t.name)}`),
      })),
      ...roadmap.map((p) => ({ group: 'Roadmap', label: p.name, hint: `${p.level} · planned`, run: go('/?s=roadmap') })),
      {
        group: 'Actions',
        label: 'Copy clone command',
        hint: 'git clone …',
        run: () => {
          navigator.clipboard?.writeText(CLONE_COMMAND).catch(() => {})
          onClose()
        },
      },
      { group: 'Actions', label: 'Open the GitHub repository', run: () => (window.open(REPO_URL, '_blank'), onClose()) },
    ]
    const q = query.trim().toLowerCase()
    if (!q) return all.filter((i) => i.group !== 'Features').slice(0, 14)
    return all.filter((i) => `${i.label} ${i.hint ?? ''}`.toLowerCase().includes(q)).slice(0, 30)
  }, [query, navigate, onClose])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  useEffect(() => {
    setSelected(0)
  }, [query])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter') {
      items[selected]?.run()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  let lastGroup = ''
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="palette"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -16, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <div className="palette-input">
              {Icon.search}
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search projects, features and technology…"
                aria-label="Search"
              />
              <kbd className="muted">esc</kbd>
            </div>
            <div className="palette-list">
              {items.length === 0 && <div className="empty" style={{ padding: 40 }}>No matches for “{query}”</div>}
              {items.map((item, i) => {
                const header = item.group !== lastGroup ? <div className="palette-group">{item.group}</div> : null
                lastGroup = item.group
                return (
                  <div key={`${item.group}-${item.label}-${i}`}>
                    {header}
                    <button
                      className={`palette-item ${i === selected ? 'selected' : ''}`}
                      onMouseEnter={() => setSelected(i)}
                      onClick={item.run}
                    >
                      {item.project ? <AppIcon project={item.project} size={24} /> : <span style={{ width: 24, textAlign: 'center' }}>›</span>}
                      <span>{item.label}</span>
                      {item.hint && <small>{item.hint}</small>}
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
