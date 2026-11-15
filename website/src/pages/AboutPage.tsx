import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { AUTHOR, REPO_URL, allScreens, community, projects, roadmap } from '../data/projects'
import { patterns } from '../data/patterns'
import { PLATFORMS, glossary, runsOn, topics, tracks } from '../data/learn'
import { Icon, PageHead, Reveal, usePageTitle } from '../components/ui'

const PRINCIPLES = [
  { title: 'Native only', body: 'Swift, SwiftUI and Apple’s own frameworks — no third-party packages — so every line you read is the real API.' },
  { title: 'Complete apps', body: 'Each project is a whole app with onboarding, settings, tests and a README, not a snippet that stops where it gets hard.' },
  { title: 'Every level', body: 'Apps are tagged Beginner, Intermediate or Advanced, and the learning tracks order them for you.' },
  { title: 'Read the why', body: 'Code patterns explain the reasoning, and comments in the source say why, not just what.' },
  { title: 'Honest about setup', body: 'If something needs an API key, a server or a newer Xcode, the project page says so up front.' },
  { title: 'Open source', body: 'MIT licensed. Clone it, take it apart, ship something of your own with it.' },
]

const CRITERIA = [
  'Written in Swift for an Apple platform, with its source on GitHub',
  'A clear open-source license, shown on its page',
  'Still builds with a recent Xcode, or is well worth reading as a reference',
  'Teaches something specific: a framework, a pattern or an architecture',
  'Described from its own README — never copied into this repository',
]

const STACK = ['React 19', 'TypeScript', 'Vite', 'React Router', 'Motion']

export function AboutPage() {
  usePageTitle('About', `Why Native Swift Apps exists, the principles behind it, how community apps are picked, and who makes it.`)

  const stats = [
    { value: projects.length, label: 'apps in this repo' },
    { value: community.length, label: 'community apps' },
    { value: allScreens.length, label: 'screenshots' },
    { value: patterns.length, label: 'code patterns' },
    { value: tracks.length, label: 'learning tracks' },
    { value: glossary.length, label: 'glossary terms' },
    { value: topics.filter((t) => !t.isPlatform).length, label: 'technologies' },
    { value: PLATFORMS.filter((p) => [...projects, ...community].some((a) => runsOn(a, p))).length, label: 'platforms' },
  ]

  const licenses = Object.entries(
    community.reduce<Record<string, number>>((acc, p) => ((acc[p.license ?? 'Other'] = (acc[p.license ?? 'Other'] ?? 0) + 1), acc), {}),
  ).sort((a, b) => b[1] - a[1])
  const maxLicense = licenses[0]?.[1] ?? 1

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <PageHead
        eyebrow="About"
        title={
          <>
            Learn Swift from apps,
            <br />
            <span className="muted">not fragments.</span>
          </>
        }
        lead="Native Swift Apps is an open-source collection of complete Swift and SwiftUI apps, plus a hand-picked list of community apps — so you can learn by reading, running and changing code that actually ships."
      />

      <div className="about-stats">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <b>{s.value}</b>
            <span>{s.label}</span>
          </motion.div>
        ))}
      </div>

      <section className="about-section">
        <Reveal>
          <h2 className="h-section" style={{ fontSize: 34 }}>
            Principles
          </h2>
        </Reveal>
        <div className="feature-grid">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="card about-card" style={{ height: '100%' }}>
                <span className="about-num">{String(i + 1).padStart(2, '0')}</span>
                <h4>{p.title}</h4>
                <p className="muted" style={{ margin: 0 }}>
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="about-section two-col">
        <Reveal>
          <div className="card" style={{ height: '100%' }}>
            <h4>How community apps are picked</h4>
            <ul className="check-list">
              {CRITERIA.map((c) => (
                <li key={c}>
                  <span>{Icon.check}</span>
                  {c}
                </li>
              ))}
            </ul>
            <Link to="/contribute" className="btn btn-ghost" style={{ marginTop: 16 }}>
              Suggest an app {Icon.arrow}
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="card" style={{ height: '100%' }}>
            <h4>Community app licenses</h4>
            <div className="license-bars">
              {licenses.map(([name, n]) => (
                <div key={name} className="license-bar">
                  <span>{name}</span>
                  <div>
                    <motion.i initial={{ width: 0 }} whileInView={{ width: `${(n / maxLicense) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
                  </div>
                  <b>{n}</b>
                </div>
              ))}
            </div>
            <p className="muted" style={{ fontSize: 13, marginBottom: 0 }}>
              Each app keeps its own license. Check it before reusing code — copyleft licenses such as GPL and AGPL come with conditions.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="about-section two-col">
        <Reveal>
          <div className="card about-author" style={{ height: '100%' }}>
            <img src={`${AUTHOR.url}.png?size=160`} alt="" width={72} height={72} referrerPolicy="no-referrer" loading="lazy" />
            <div>
              <h4 style={{ marginBottom: 4 }}>{AUTHOR.name}</h4>
              <p className="muted" style={{ margin: '0 0 14px' }}>
                Creator and maintainer. {projects.length} apps shipped, {roadmap.length} on the roadmap.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a className="btn btn-primary" href={AUTHOR.url} target="_blank" rel="noreferrer">
                  {Icon.github} GitHub
                </a>
                <a className="btn btn-ghost" href={`${AUTHOR.url}?tab=repositories`} target="_blank" rel="noreferrer">
                  More projects
                </a>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="card" style={{ height: '100%' }}>
            <h4>About this site</h4>
            <p className="muted">
              A static site with no backend, no analytics and no cookies. Every page is built from one data file, the apps’ own Swift source and the
              CHANGELOG, so it can’t drift from the repository.
            </p>
            <div className="tag-row">
              {STACK.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
            <a className="doc-link" href={`${REPO_URL}/tree/main/website`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 16 }}>
              Read the site’s source →
            </a>
          </div>
        </Reveal>
      </section>

      <p className="muted" style={{ fontSize: 14 }}>
        Weather data in the Weather app is provided by Open-Meteo. Community apps belong to their authors; their names, code and icons remain theirs.
      </p>
    </div>
  )
}
