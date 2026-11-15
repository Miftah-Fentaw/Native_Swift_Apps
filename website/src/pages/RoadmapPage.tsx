import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { REPO_URL, community, levels, projects, roadmap } from '../data/projects'
import { AppIcon, Icon, PageHead, Reveal, usePageTitle } from '../components/ui'

const LANDING = [
  { title: 'Proposed', body: 'An idea is opened as a feature request, with the level and what it would teach.' },
  { title: 'Scoped', body: 'Features are agreed so the app teaches a clear set of skills without overlapping another app.' },
  { title: 'Built', body: 'A self-contained Xcode project with native frameworks only, plus unit and UI test targets.' },
  { title: 'Documented', body: 'A README with features, architecture and testing, screenshots in light and dark, and an icon.' },
  { title: 'Shipped', body: 'Added to the root README, this site, the learning tracks and the changelog.' },
]

export function RoadmapPage() {
  usePageTitle('Roadmap', `The Native Swift Apps roadmap: ${projects.length} apps shipped and ${roadmap.length} planned, from Beginner to Advanced.`)
  const total = projects.length + roadmap.length
  const pct = Math.round((projects.length / total) * 100)

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <PageHead
        eyebrow="Roadmap"
        title="What’s shipped, what’s next"
        lead="Planned apps are not in the repository yet; names and scope may change. Each one will land with its own folder, README, screenshots and tests."
      />

      <Reveal>
        <div className="road-progress">
          <div className="road-progress-head">
            <b>
              {projects.length} of {total} apps shipped
            </b>
            <span className="muted">{pct}%</span>
          </div>
          <div className="road-bar">
            <motion.div className="road-bar-fill" initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }} />
          </div>
          <p className="muted" style={{ margin: '12px 0 0', fontSize: 14 }}>
            Plus {community.length} community apps to learn from while you wait.{' '}
            <Link to="/explore?source=community" className="doc-link">
              Browse them
            </Link>
          </p>
        </div>
      </Reveal>

      <div className="road-cols">
        {levels.map((l, li) => {
          const shipped = projects.filter((p) => p.level === l.level)
          const planned = roadmap.filter((p) => p.level === l.level)
          return (
            <Reveal key={l.level} delay={li * 0.08}>
              <div className="road-col" style={{ ['--lvl' as string]: l.color }}>
                <header>
                  <span className="badge" style={{ ['--badge' as string]: l.color }}>
                    <span className="dot" />
                    {l.level}
                  </span>
                  <small className="muted">{l.topics.join(' · ')}</small>
                </header>
                {shipped.map((p) => (
                  <Link key={p.slug} to={`/projects/${p.slug}`} className="road-item shipped">
                    <AppIcon project={p} size={32} />
                    <div>
                      <b>{p.name}</b>
                      <small>{p.tagline}</small>
                    </div>
                    <span className="road-tag">Shipped</span>
                  </Link>
                ))}
                {planned.map((p) => (
                  <div key={p.slug} className="road-item">
                    <AppIcon project={p} size={32} />
                    <div>
                      <b>{p.name}</b>
                      <small>{p.tagline}</small>
                    </div>
                    <span className="road-tag planned">Planned</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )
        })}
      </div>

      <section style={{ marginTop: 80 }}>
        <Reveal>
          <h2 className="h-section" style={{ fontSize: 34 }}>
            How a new app lands
          </h2>
        </Reveal>
        <ol className="road-steps">
          {LANDING.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <li>
                <span>{i + 1}</span>
                <b>{s.title}</b>
                <p>{s.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="detail-actions">
          <a className="btn btn-primary" href={`${REPO_URL}/issues/new?template=feature_request.md`} target="_blank" rel="noreferrer">
            {Icon.github} Propose an app
          </a>
          <Link className="btn btn-ghost" to="/changelog">
            See what’s new {Icon.arrow}
          </Link>
        </div>
      </section>
    </div>
  )
}
