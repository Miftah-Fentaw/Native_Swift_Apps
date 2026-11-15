import { Link } from 'react-router-dom'
import { findProject, isCommunity, type Project } from '../data/projects'
import { findPattern } from '../data/patterns'
import { findTerm } from '../data/learn'
import { AppIcon } from './ui'

/** Small inline link to an app: icon, name and an optional community marker. */
export function AppChip({ slug, project }: { slug?: string; project?: Project }) {
  const p = project ?? findProject(slug)
  if (!p) return null
  return (
    <Link to={`/projects/${p.slug}`} className="app-chip" title={p.tagline}>
      <AppIcon project={p} size={20} />
      <span>{p.name}</span>
      {isCommunity(p) && <small>community</small>}
    </Link>
  )
}

export function TermChip({ id }: { id: string }) {
  const t = findTerm(id)
  if (!t) return null
  return (
    <Link to={`/glossary?t=${t.id}`} className="term-chip">
      {t.term}
    </Link>
  )
}

export function PatternChip({ id }: { id: string }) {
  const p = findPattern(id)
  if (!p) return null
  return (
    <Link to={`/patterns?p=${p.id}`} className="pattern-chip">
      <span aria-hidden>{'</>'}</span>
      {p.title}
    </Link>
  )
}

/** Scrolls to an element id after the page has rendered (for `?p=`, `?t=` deep links). */
export function scrollToId(id: string | null, offset = 96) {
  if (!id) return
  window.setTimeout(() => {
    const el = document.getElementById(id)
    if (!el) return
    const distance = el.getBoundingClientRect().top - offset
    // Long jumps are instant; a slow smooth scroll past a dozen cards feels broken.
    window.scrollTo({ top: distance + window.scrollY, behavior: Math.abs(distance) > 2400 ? 'instant' : 'smooth' })
  }, 120)
}
