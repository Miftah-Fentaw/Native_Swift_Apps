import { motion } from 'motion/react'
import { resources } from '../data/learn'
import { Icon, PageHead, Reveal, usePageTitle } from '../components/ui'

export function ResourcesPage() {
  const count = resources.reduce((n, g) => n + g.items.length, 0)
  usePageTitle('Resources', `${count} hand-picked resources for learning Swift and SwiftUI: Apple’s tutorials and docs, the Swift book, courses, newsletters and tools.`)

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <PageHead
        eyebrow="Resources"
        title="Keep learning beyond the code"
        lead="Hand-picked documentation, courses, writing and tools that pair well with the apps on this hub. Most are free."
      />
      {resources.map((g) => (
        <section key={g.group} className="res-group">
          <Reveal>
            <h2>{g.group}</h2>
            <p className="muted">{g.intro}</p>
          </Reveal>
          <div className="res-grid">
            {g.items.map((r, i) => (
              <motion.a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="res-card"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="res-head">
                  <b>{r.name}</b>
                  <span className="res-ext">{Icon.external}</span>
                </div>
                <p>{r.description}</p>
                <div className="res-meta">
                  <span>{r.by}</span>
                  <span className="badge" style={{ ['--badge' as string]: r.free ? '#30a46c' : 'var(--text-2)' }}>
                    {r.free ? 'Free' : 'Paid'}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      ))}
      <p className="muted" style={{ fontSize: 14 }}>
        Links go to other sites. Know a resource that belongs here? Suggest it on the Contribute page.
      </p>
    </div>
  )
}
