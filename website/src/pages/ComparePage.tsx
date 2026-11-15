import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { allProjects, community, findProject, githubRepoUrl, githubTree, isCommunity, licenseLabel, projects, type Level } from '../data/projects'
import { patternsFor } from '../data/patterns'
import { topicPath, tracksFor } from '../data/learn'
import { AppIcon, CopyButton, Icon, LevelBadge, PageHead, StatusBadge, usePageTitle } from '../components/ui'

const SLOTS = 3
const DEFAULT = projects.map((p) => p.slug).slice(0, SLOTS)
const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced']

export function ComparePage() {
  usePageTitle('Compare apps', 'Compare open-source Swift apps side by side: level, platforms, license, technology, what each teaches and what it needs to run.')
  const [params, setParams] = useSearchParams()
  const chosen = useMemo(() => {
    const fromUrl = (params.get('apps') ?? '').split(',').filter((s) => findProject(s))
    return (fromUrl.length ? fromUrl : DEFAULT).slice(0, SLOTS)
  }, [params])
  const apps = chosen.map((s) => findProject(s)!)

  const setSlot = (index: number, slug: string) => {
    const next = [...chosen]
    if (slug) next[index] = slug
    else next.splice(index, 1)
    setParams({ apps: next.filter(Boolean).join(',') }, { replace: true })
  }

  const tech = useMemo(() => {
    const names = new Set(apps.flatMap((p) => p.tech))
    return [...names].sort((a, b) => apps.filter((p) => p.tech.includes(b)).length - apps.filter((p) => p.tech.includes(a)).length || a.localeCompare(b))
  }, [apps])

  const shareUrl = `${window.location.origin}${window.location.pathname}#/compare?apps=${chosen.join(',')}`
  const cols = { ['--cols' as string]: Math.max(apps.length, 1) }

  const row = (label: string, render: (p: (typeof apps)[number]) => React.ReactNode) => (
    <div className="cmp-row" style={cols}>
      <div className="cmp-label">{label}</div>
      {apps.map((p) => (
        <div key={p.slug} className="cmp-cell">
          {render(p)}
        </div>
      ))}
    </div>
  )

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <PageHead eyebrow="Compare" title="Compare apps side by side" lead="Pick up to three apps — from this repo or the community — to see how their level, platforms, license and technology line up.">
        <div className="detail-actions">
          <CopyButton text={shareUrl} label="Copy link to this comparison" className="btn btn-ghost" />
        </div>
      </PageHead>

      <div className="cmp-pickers" style={{ ['--cols' as string]: Math.min(chosen.length + 1, SLOTS) }}>
        {[...chosen, ...(chosen.length < SLOTS ? [''] : [])].map((slug, i) => (
          <label key={`${i}-${slug}`} className="cmp-picker">
            <span className="muted">{slug ? `App ${i + 1}` : 'Add an app'}</span>
            <select value={slug} onChange={(e) => setSlot(i, e.target.value)}>
              <option value="">{slug ? '— Remove —' : 'Choose…'}</option>
              <optgroup label="In this repo">
                {projects.map((p) => (
                  <option key={p.slug} value={p.slug} disabled={chosen.includes(p.slug) && p.slug !== slug}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              {LEVELS.map((l) => (
                <optgroup key={l} label={`Community · ${l}`}>
                  {community
                    .filter((p) => p.level === l)
                    .map((p) => (
                      <option key={p.slug} value={p.slug} disabled={chosen.includes(p.slug) && p.slug !== slug}>
                        {p.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
        ))}
      </div>

      {apps.length === 0 ? (
        <div className="empty">Choose an app to start comparing.</div>
      ) : (
        <motion.div className="cmp" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} key={chosen.join()}>
          <div className="cmp-row cmp-head" style={cols}>
            <div className="cmp-label" />
            {apps.map((p) => (
              <Link key={p.slug} to={`/projects/${p.slug}`} className="cmp-cell cmp-app" style={{ ['--card-accent' as string]: p.accent }}>
                <AppIcon project={p} size={56} />
                <b>{p.name}</b>
                <small>{p.tagline}</small>
              </Link>
            ))}
          </div>
          {row('Level', (p) => <LevelBadge project={p} />)}
          {row('Source', (p) => (
            <>
              <StatusBadge project={p} />
              <small className="muted cmp-sub">{isCommunity(p) ? p.repo : `${p.folder}/`}</small>
            </>
          ))}
          {row('Platforms', (p) => <span>{p.platforms ?? '—'}</span>)}
          {row('License', (p) => <span>{p.license ? licenseLabel(p) : 'MIT license'}</span>)}
          {row('Screenshots', (p) => <span>{p.screens.length > 0 ? `${p.screens.length} in the hub` : 'In its own repository'}</span>)}
          {row('Code patterns', (p) => {
            const n = patternsFor(p.slug).length
            return n ? <Link className="doc-link" to={`/patterns?app=${p.slug}`}>{n} patterns</Link> : <span className="muted">—</span>
          })}
          {row('Tracks', (p) => {
            const t = tracksFor(p.slug)
            return t.length ? (
              <div className="cmp-list">
                {t.map((x) => (
                  <Link key={x.id} className="doc-link" to={`/learn?t=${x.id}`}>
                    {x.title}
                  </Link>
                ))}
              </div>
            ) : (
              <span className="muted">—</span>
            )
          })}
          {row('You’ll learn', (p) => (
            <ul className="cmp-ul">
              {p.learn.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          ))}
          {row('Before you run it', (p) => <span className={p.note ? '' : 'muted'}>{p.note ?? 'Nothing extra — open it in Xcode and press Run.'}</span>)}

          <div className="cmp-section" style={cols}>
            <div className="cmp-label">Technology</div>
          </div>
          {tech.map((t) => (
            <div key={t} className="cmp-row cmp-tech" style={cols}>
              <div className="cmp-label">
                <Link to={topicPath(t)}>{t}</Link>
              </div>
              {apps.map((p) => (
                <div key={p.slug} className={`cmp-cell ${p.tech.includes(t) ? 'yes' : 'no'}`} aria-label={p.tech.includes(t) ? 'Yes' : 'No'}>
                  {p.tech.includes(t) ? Icon.check : '–'}
                </div>
              ))}
            </div>
          ))}

          {row('', (p) => (
            <a className="btn btn-ghost cmp-btn" href={p.repo ? githubRepoUrl(p.repo) : githubTree(p.folder ?? '')} target="_blank" rel="noreferrer">
              {Icon.github} Source
            </a>
          ))}
        </motion.div>
      )}

      <p className="muted" style={{ marginTop: 24, fontSize: 14 }}>
        {allProjects.length} apps to choose from. Technology is what each app’s README and code show; community apps may use more.
      </p>
    </div>
  )
}
