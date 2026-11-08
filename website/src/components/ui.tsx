import { useEffect, useState, type ReactNode } from 'react'

const BASE_TITLE = 'Native Swift Apps'
const DEFAULT_DESCRIPTION =
  'Explore Native Swift Apps by Miftah Fentaw: open-source, native Swift and SwiftUI apps for iOS and iPadOS, each with source code, screenshots and docs.'

/** Sets the browser tab title (and description, when given) for the current page. */
export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE_TITLE}` : `${BASE_TITLE} — Open-source Swift & SwiftUI apps by Miftah Fentaw`
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', description ?? DEFAULT_DESCRIPTION)
  }, [title, description])
}
import { AnimatePresence, motion } from 'motion/react'
import { levelColor, type Project, type Screen } from '../data/projects'

export function AppIcon({ project, size = 44 }: { project: Project; size?: number }) {
  if (project.icon) {
    return <img className="app-icon" src={project.icon} alt="" width={size} height={size} style={{ width: size, height: size }} />
  }
  return (
    <span className="icon-placeholder" style={{ width: size, height: size, fontSize: size * 0.34 }} aria-hidden>
      {project.name
        .split(/\s+/)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)}
    </span>
  )
}

export function LevelBadge({ project }: { project: Project }) {
  return (
    <span className="badge" style={{ ['--badge' as string]: levelColor(project.level) }}>
      <span className="dot" />
      {project.level}
    </span>
  )
}

export function StatusBadge({ project }: { project: Project }) {
  const map = {
    available: { label: 'Available', color: '#30a46c' },
    'in-progress': { label: 'In progress', color: '#e0794f' },
    planned: { label: 'Planned', color: '#8e8e93' },
  } as const
  const s = map[project.status]
  return (
    <span className="badge" style={{ ['--badge' as string]: s.color }}>
      {s.label}
    </span>
  )
}

/** Fades and lifts its children into view once they scroll on screen. */
export function Reveal({ children, delay = 0, y = 24 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Phone({ screen, eager = false }: { screen: Screen; eager?: boolean }) {
  return (
    <div className="phone">
      <img src={screen.src} alt={screen.label} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </div>
  )
}

export function CopyButton({ text, label = 'Copy', className = 'copy-btn' }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {copied ? 'Copied ✓' : label}
    </button>
  )
}

export function Lightbox({ screen, onClose }: { screen: Screen | null; onClose: () => void }) {
  useEffect(() => {
    if (!screen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [screen, onClose])

  return (
    <AnimatePresence>
      {screen && (
        <motion.div className="overlay" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.img
            className="lightbox-img"
            src={screen.src}
            alt={screen.label}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const Icon = {
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  up: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  ),
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  ),
  sun: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  moon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  ),
}
