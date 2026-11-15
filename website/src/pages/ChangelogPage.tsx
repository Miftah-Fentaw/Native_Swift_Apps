import { motion } from 'motion/react'
import entries from 'virtual:changelog'
import { REPO_URL } from '../data/projects'
import { Icon, PageHead, usePageTitle } from '../components/ui'
import { Rich } from '../components/code'

const formatDate = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function ChangelogPage() {
  usePageTitle('Changelog', 'What’s new in Native Swift Apps: new apps, new pages on the explore hub and changes to the repository.')
  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <PageHead eyebrow="Changelog" title="What’s new" lead="New apps, new pages on this hub and changes to how the repository works, newest first.">
        <div className="detail-actions">
          <a className="btn btn-ghost" href={`${REPO_URL}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer">
            {Icon.github} CHANGELOG.md
          </a>
          <a className="btn btn-ghost" href={`${REPO_URL}/commits/main`} target="_blank" rel="noreferrer">
            All commits {Icon.external}
          </a>
        </div>
      </PageHead>

      <ol className="changelog">
        {entries.map((e, i) => (
          <motion.li
            key={`${e.date}-${e.title}`}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="cl-date">
              <time dateTime={e.date}>{formatDate(e.date)}</time>
              {i === 0 && <span className="badge">Latest</span>}
            </div>
            <div className="cl-body">
              <h2>{e.title}</h2>
              {e.summary && (
                <p className="cl-summary">
                  <Rich text={e.summary} />
                </p>
              )}
              {e.groups.map((g) => (
                <div key={g.heading} className="cl-group">
                  <h3 className={`cl-kind ${g.heading.toLowerCase()}`}>{g.heading}</h3>
                  <ul>
                    {g.items.map((item) => (
                      <li key={item}>
                        <Rich text={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
