import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { faqs } from '../data/learn'
import { Icon, PageHead, usePageTitle } from '../components/ui'
import { Rich } from '../components/code'
import { scrollToId } from '../components/bits'

export function FaqPage() {
  const count = faqs.reduce((n, g) => n + g.items.length, 0)
  usePageTitle('FAQ', `Answers to ${count} common questions about running the Native Swift Apps projects, the community apps, this website and contributing.`)
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const target = params.get('q')
  useEffect(() => scrollToId(target ? `faq-${target}` : null), [target])

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    return faqs
      .map((g) => ({ ...g, items: g.items.filter((f) => !q || `${f.q} ${f.a}`.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0)
  }, [query])

  return (
    <div className="container faq-page" style={{ paddingBottom: 100 }}>
      <PageHead eyebrow="FAQ" title="Frequently asked questions" lead={`${count} answers about the apps, the community picks, this site and contributing.`} />

      <div className="filters">
        <div className="filter-search" style={{ marginLeft: 0, flex: 1, maxWidth: 520 }}>
          {Icon.search}
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions…" aria-label="Search questions" />
        </div>
      </div>

      {groups.map((g) => (
        <section key={g.group} className="faq-group">
          <h2>{g.group}</h2>
          {g.items.map((f) => (
            <details key={f.id} id={`faq-${f.id}`} className="faq" open={target === f.id || undefined}>
              <summary>{f.q}</summary>
              <p>
                <Rich text={f.a} />
              </p>
              {f.link && (
                <Link className="doc-link" to={f.link.to}>
                  {f.link.label} →
                </Link>
              )}
            </details>
          ))}
        </section>
      ))}
      {groups.length === 0 && <div className="empty">No questions match “{query}”.</div>}

      <div className="notice" style={{ marginTop: 40 }}>
        Still stuck? <Link className="doc-link" to="/docs">Read the docs</Link> or{' '}
        <Link className="doc-link" to="/contribute">
          ask on GitHub
        </Link>
        .
      </div>
    </div>
  )
}
