import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { sitePages } from '../data/pages'
import { Icon, usePageTitle } from '../components/ui'
import { PageIcon } from '../components/icons'

export function NotFoundPage() {
  usePageTitle('Page not found')
  const { pathname } = useLocation()
  return (
    <div className="container not-found">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="not-found-code" aria-hidden>
          404
        </div>
        <h1 className="h-section">This page doesn’t exist</h1>
        <p className="lead center">
          Nothing lives at <code>{pathname}</code>. It may have moved — try one of these, or press ⌘K to search.
        </p>
        <div className="detail-actions" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary" to="/">
            Go home {Icon.arrow}
          </Link>
          <Link className="btn btn-ghost" to="/explore">
            Explore apps
          </Link>
        </div>
      </motion.div>
      <div className="page-grid" style={{ marginTop: 56 }}>
        {sitePages.slice(0, 8).map((p) => (
          <Link key={p.path} to={p.path} className="page-card">
            <span className="page-card-icon">
              <PageIcon name={p.icon} />
            </span>
            <b>{p.title}</b>
            <small>{p.description}</small>
          </Link>
        ))}
      </div>
    </div>
  )
}
