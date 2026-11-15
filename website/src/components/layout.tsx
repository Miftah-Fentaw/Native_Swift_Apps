import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { AUTHOR, CLONE_COMMAND, REPO_URL, community, isCommunity, projects, roadmap, type Project } from '../data/projects'
import { patterns } from '../data/patterns'
import { glossary, topics, tracks } from '../data/learn'
import { pageGroups, sitePages } from '../data/pages'
import { AppIcon, Icon, LevelBadge, Phone, StatusBadge } from './ui'
import { PageIcon } from './icons'

/** The nav's "More" dropdown: every page, grouped. */
function MoreMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="more" ref={ref}>
      <button className={`more-btn ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="true">
        More {Icon.chevron}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="more-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            {pageGroups.map((g) => (
              <div key={g} className="more-group">
                <div className="more-title">{g}</div>
                {sitePages
                  .filter((p) => p.group === g)
                  .map((p) => (
                    <Link key={p.path} to={p.path} className={`more-item ${pathname === p.path ? 'active' : ''}`}>
                      <span className="more-icon">
                        <PageIcon name={p.icon} size={18} />
                      </span>
                      <span>
                        <b>{p.title}</b>
                        <small>{p.description}</small>
                      </span>
                    </Link>
                  ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

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
            <NavLink to="/explore" end>
              Explore
            </NavLink>
            <NavLink to="/learn">Learn</NavLink>
            {/* Third and later links are hidden on phones; every page is in the More menu. */}
            <NavLink to="/patterns">Patterns</NavLink>
            <NavLink to="/topics">Topics</NavLink>
            <NavLink to="/docs">Docs</NavLink>
          </div>
          <MoreMenu />
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
  const ticker = [...topics.filter((t) => !t.isPlatform).slice(0, 18).map((t) => t.name), ...projects.map((p) => p.name)]
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
          <Link to="/roadmap">Roadmap</Link>
          <Link to="/changelog">Changelog</Link>
          <Link to="/about">About</Link>
        </FooterColumn>

        <FooterColumn title="Explore">
          <Link to="/explore">All projects</Link>
          <Link to="/explore?source=community">Community apps ({community.length})</Link>
          <Link to="/topics">Topics</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/gallery">Gallery</Link>
          <a href="#/?s=ask">Ask the hub</a>
        </FooterColumn>

        <FooterColumn title="Learn">
          <Link to="/learn">Learning tracks</Link>
          <Link to="/patterns">Code patterns</Link>
          <Link to="/glossary">Glossary</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/docs">Documentation</Link>
          <Link to="/faq">FAQ</Link>
        </FooterColumn>

        <FooterColumn title="Repository">
          <a href={REPO_URL} {...ext}>GitHub</a>
          <Link to="/contribute">Contribute</Link>
          <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} {...ext}>Contributing guide</a>
          <a href={`${REPO_URL}/blob/main/CODE_OF_CONDUCT.md`} {...ext}>Code of conduct</a>
          <a href={`${REPO_URL}/blob/main/SECURITY.md`} {...ext}>Security</a>
          <a href={`${REPO_URL}/blob/main/LICENSE`} {...ext}>MIT License</a>
        </FooterColumn>

        <FooterColumn title="Author">
          <a href={AUTHOR.url} {...ext}>{AUTHOR.name}</a>
          <a href={`${AUTHOR.url}?tab=repositories`} {...ext}>More projects</a>
          <Link to="/about">About the project</Link>
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
          ) : isCommunity(project) ? (
            <div className="community-media">
              <AppIcon project={project} size={72} />
              <span className="community-repo">
                {Icon.github}
                {project.repo}
              </span>
              {project.platforms && <span className="community-platforms">{project.platforms}</span>}
            </div>
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

type PaletteItem = { group: string; label: string; hint?: string; project?: Project; icon?: import('../data/pages').PageIcon; run: () => void }

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
      ...sitePages.map((p) => ({ group: 'Pages', label: p.title, hint: p.description, icon: p.icon, run: go(p.path) })),
      ...topics.map((t) => ({
        group: t.isPlatform ? 'Platforms' : 'Technology',
        label: t.name,
        hint: `${t.apps.length} ${t.apps.length === 1 ? 'app' : 'apps'} · ${t.info.kind}`,
        run: go(`/topics/${t.slug}`),
      })),
      ...tracks.map((t) => ({ group: 'Learning tracks', label: t.title, hint: `${t.level} · ${t.steps.length} steps`, icon: 'path' as const, run: go(`/learn?t=${t.id}`) })),
      ...patterns.map((p) => ({
        group: 'Code patterns',
        label: p.title,
        hint: projects.find((x) => x.slug === p.project)?.name,
        icon: 'code' as const,
        run: go(`/patterns?p=${p.id}`),
      })),
      ...glossary.map((t) => ({ group: 'Glossary', label: t.term, hint: t.kind, icon: 'book' as const, run: go(`/glossary?t=${t.id}`) })),
      ...community.map((p) => ({
        group: 'Community apps',
        label: p.name,
        hint: `${p.level} · ${p.repo}`,
        project: p,
        run: go(`/projects/${p.slug}`),
      })),
      ...roadmap.map((p) => ({ group: 'Roadmap', label: p.name, hint: `${p.level} · planned`, run: go('/roadmap') })),
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
    // With no query, show the repo's own apps, a few community apps and the actions.
    if (!q)
      return [
        ...all.filter((i) => i.group === 'Projects'),
        ...all.filter((i) => i.group === 'Pages').slice(0, 6),
        ...all.filter((i) => i.group === 'Community apps').slice(0, 4),
        ...all.filter((i) => i.group === 'Technology').slice(0, 4),
        ...all.filter((i) => i.group === 'Actions'),
      ]
    // Matches on the label rank above matches on the hint; the group order is kept within each.
    const hits = all.filter((i) => `${i.label} ${i.hint ?? ''}`.toLowerCase().includes(q))
    const byLabel = hits.filter((i) => i.label.toLowerCase().includes(q))
    const ranked = [...byLabel, ...hits.filter((i) => !byLabel.includes(i))]
    const order = [...new Set(ranked.map((i) => i.group))]
    return order.flatMap((g) => ranked.filter((i) => i.group === g)).slice(0, 40)
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
                placeholder="Search apps, pages, patterns, terms…"
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
                      {item.project ? (
                        <AppIcon project={item.project} size={24} />
                      ) : item.icon ? (
                        <span className="palette-icon">
                          <PageIcon name={item.icon} size={16} />
                        </span>
                      ) : (
                        <span style={{ width: 24, textAlign: 'center' }}>›</span>
                      )}
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
