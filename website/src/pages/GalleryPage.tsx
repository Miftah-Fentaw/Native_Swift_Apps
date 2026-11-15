import { useCallback, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { allScreens, projects } from '../data/projects'
import { AppIcon, Lightbox, PageHead, Phone, usePageTitle } from '../components/ui'

type Look = 'light' | 'dark'
const isDark = (label: string) => /dark/i.test(label)

export function GalleryPage() {
  usePageTitle('Screenshot gallery', `All ${allScreens.length} screenshots of the Native Swift Apps projects, in light and dark appearance.`)
  const [params, setParams] = useSearchParams()
  const app = params.get('app')
  const look = params.get('look') as Look | null
  const [open, setOpen] = useState<number | null>(null)

  const list = useMemo(
    () => allScreens.filter((s) => (!app || s.project.slug === app) && (!look || (look === 'dark') === isDark(s.label))),
    [app, look],
  )

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const close = useCallback(() => setOpen(null), [])
  const prev = useCallback(() => setOpen((i) => (i === null ? i : (i - 1 + list.length) % list.length)), [list.length])
  const next = useCallback(() => setOpen((i) => (i === null ? i : (i + 1) % list.length)), [list.length])
  const current = open === null ? null : list[open]
  const darkCount = allScreens.filter((s) => isDark(s.label)).length

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <PageHead
        eyebrow="Gallery"
        title="Every screen, in one place"
        lead={`${allScreens.length} screenshots from the apps in this repo. Click one to enlarge it, then use the arrow keys to move through them.`}
      />

      <div className="filters" role="group" aria-label="App">
        <button className={`chip ${!app ? 'active' : ''}`} onClick={() => set('app', null)}>
          All apps
        </button>
        {projects.map((p) => (
          <button key={p.slug} className={`chip ${app === p.slug ? 'active' : ''}`} onClick={() => set('app', app === p.slug ? null : p.slug)}>
            <AppIcon project={p} size={18} />
            {p.name} <span className="muted">{p.screens.length}</span>
          </button>
        ))}
        <span className="filter-divider" />
        <button className={`chip ${!look ? 'active' : ''}`} onClick={() => set('look', null)}>
          Any appearance
        </button>
        <button className={`chip ${look === 'light' ? 'active' : ''}`} onClick={() => set('look', look === 'light' ? null : 'light')}>
          ☀︎ Light
        </button>
        <button className={`chip ${look === 'dark' ? 'active' : ''}`} onClick={() => set('look', look === 'dark' ? null : 'dark')}>
          ☾ Dark <span className="muted">{darkCount}</span>
        </button>
      </div>

      <div className="result-count muted" aria-live="polite">
        {list.length} {list.length === 1 ? 'screenshot' : 'screenshots'}
      </div>

      <motion.div layout className="gallery-grid">
        <AnimatePresence mode="popLayout">
          {list.map((s, i) => (
            <motion.figure
              key={s.src}
              layout
              className="screen-tile"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3, delay: Math.min(i, 12) * 0.02 }}
              whileHover={{ y: -6 }}
              onClick={() => setOpen(i)}
            >
              <Phone screen={s} />
              <figcaption>
                <img src={s.project.icon} alt="" />
                {s.project.name} · {s.label}
              </figcaption>
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && (
        <div className="empty">
          No screenshots match these filters. <Link className="doc-link" to="/gallery">Show all</Link>
        </div>
      )}

      <Lightbox
        screen={current}
        onClose={close}
        onPrev={list.length > 1 ? prev : undefined}
        onNext={list.length > 1 ? next : undefined}
        caption={current ? `${current.project.name} · ${current.label} — ${open! + 1} of ${list.length}` : undefined}
      />
    </div>
  )
}
