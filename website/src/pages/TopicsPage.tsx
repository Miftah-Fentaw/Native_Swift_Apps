import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { isCommunity, techCounts } from '../data/projects'
import { patterns } from '../data/patterns'
import { findTopic, glossary, topicKinds, topicPath, topics, tracks, type Topic } from '../data/learn'
import { AppIcon, Icon, PageHead, Reveal, usePageTitle } from '../components/ui'
import { ProjectCard } from '../components/layout'
import { PatternChip, TermChip } from '../components/bits'

function TopicTile({ topic, index }: { topic: Topic; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 12) * 0.025 }}>
      <Link to={`/topics/${topic.slug}`} className="topic-tile">
        <div className="topic-tile-head">
          <b>{topic.name}</b>
          <span className="topic-count">{topic.apps.length}</span>
        </div>
        <p>{topic.info.summary}</p>
        <div className="topic-avatars" aria-hidden>
          {topic.apps.slice(0, 5).map((p) => (
            <AppIcon key={p.slug} project={p} size={22} />
          ))}
          {topic.apps.length > 5 && <small>+{topic.apps.length - 5}</small>}
        </div>
      </Link>
    </motion.div>
  )
}

export function TopicsPage() {
  usePageTitle('Topics', 'Every Apple platform, framework and technology used by the hub’s Swift apps, with the apps, code patterns and terms for each.')
  const platforms = topics.filter((t) => t.isPlatform)
  const tech = topics.filter((t) => !t.isPlatform)

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <PageHead
        eyebrow="Topics"
        title="Browse by platform and framework"
        lead={`${platforms.length} platforms and ${tech.length} technologies. Each page lists the apps that use it, the code patterns that show it and the terms to know.`}
      />

      <h2 className="topic-group-title">Platforms</h2>
      <div className="topic-grid">
        {platforms.map((t, i) => (
          <TopicTile key={t.slug} topic={t} index={i} />
        ))}
      </div>

      {topicKinds.map((kind) => {
        const group = tech.filter((t) => t.info.kind === kind)
        if (group.length === 0) return null
        return (
          <section key={kind}>
            <h2 className="topic-group-title">{kind === 'Apple framework' ? 'Apple frameworks' : kind}</h2>
            <div className="topic-grid">
              {group.map((t, i) => (
                <TopicTile key={t.slug} topic={t} index={i} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export function TopicPage() {
  const { slug } = useParams()
  const topic = findTopic(slug)
  usePageTitle(
    topic?.name ?? 'Topic not found',
    topic ? `${topic.name}: ${topic.info.summary} ${topic.apps.length} open-source Swift apps to learn it from.` : undefined,
  )

  if (!topic) {
    return (
      <div className="container empty">
        <h2>Topic not found</h2>
        <Link to="/topics" className="btn btn-ghost">
          All topics
        </Link>
      </div>
    )
  }

  const repoApps = topic.apps.filter((p) => !isCommunity(p))
  const communityApps = topic.apps.filter(isCommunity)
  const related = topic.isPlatform ? [] : patterns.filter((p) => p.tech.includes(topic.name))
  const termIds = [...new Set(related.flatMap((p) => p.terms))]
  const slugs = new Set(topic.apps.map((p) => p.slug))
  const relatedTracks = tracks.filter((t) => t.steps.some((s) => slugs.has(s.app)))
  const alsoUsed = techCounts(topic.apps)
    .filter((t) => t.name !== topic.name && t.name !== 'Swift')
    .slice(0, 10)
  const extraTerms = glossary.filter((t) => !termIds.includes(t.id) && t.apps.some((a) => slugs.has(a))).slice(0, 8)

  return (
    <div>
      <section className="detail-hero">
        <div className="detail-hero-bg" />
        <div className="container">
          <Link to="/topics" className="muted" style={{ fontSize: 14 }}>
            ← All topics
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 24 }}>
            <div className="eyebrow">{topic.info.kind}</div>
            <h1 className="h-section" style={{ marginBottom: 12 }}>
              {topic.name}
            </h1>
            <p className="lead" style={{ maxWidth: 760 }}>
              {topic.info.summary}
            </p>
            <div className="topic-stats">
              <div>
                <b>{topic.apps.length}</b>
                <span>apps</span>
              </div>
              <div>
                <b>{repoApps.length}</b>
                <span>in this repo</span>
              </div>
              <div>
                <b>{communityApps.length}</b>
                <span>community</span>
              </div>
              {related.length > 0 && (
                <div>
                  <b>{related.length}</b>
                  <span>code patterns</span>
                </div>
              )}
            </div>
            <div className="detail-actions">
              <a className="btn btn-primary" href={topic.info.doc} target="_blank" rel="noreferrer">
                Official documentation {Icon.external}
              </a>
              <Link className="btn btn-ghost" to={topic.isPlatform ? `/explore?platform=${topic.name}` : `/explore?tech=${encodeURIComponent(topic.name)}`}>
                Filter on Explore
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          {(related.length > 0 || termIds.length + extraTerms.length > 0 || relatedTracks.length > 0) && (
            <div className="topic-side-grid">
              {related.length > 0 && (
                <Reveal>
                  <div className="card" style={{ height: '100%' }}>
                    <h4>Code patterns</h4>
                    <div className="chip-col">
                      {related.map((p) => (
                        <PatternChip key={p.id} id={p.id} />
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
              {relatedTracks.length > 0 && (
                <Reveal delay={0.05}>
                  <div className="card" style={{ height: '100%' }}>
                    <h4>Learning tracks</h4>
                    <div className="chip-col">
                      {relatedTracks.map((t) => (
                        <Link key={t.id} to={`/learn?t=${t.id}`} className="pattern-chip" style={{ ['--chip' as string]: t.accent }}>
                          <span aria-hidden>●</span>
                          {t.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
              {termIds.length + extraTerms.length > 0 && (
                <Reveal delay={0.1}>
                  <div className="card" style={{ height: '100%' }}>
                    <h4>Terms to know</h4>
                    <div className="chip-row">
                      {[...termIds, ...extraTerms.map((t) => t.id)].map((id) => (
                        <TermChip key={id} id={id} />
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          )}

          {alsoUsed.length > 0 && (
            <div className="also-used">
              <span className="muted">{topic.isPlatform ? `Most used on ${topic.name}:` : `Often used with ${topic.name}:`}</span>
              {alsoUsed.map((t) => (
                <Link key={t.name} to={topicPath(t.name)} className="tag">
                  {t.name} <small>{t.count}</small>
                </Link>
              ))}
            </div>
          )}

          {repoApps.length > 0 && (
            <>
              <h2 className="h-section" style={{ fontSize: 30, marginTop: 48 }}>
                In this repo
              </h2>
              <div className="project-grid">
                {repoApps.map((p, i) => (
                  <ProjectCard key={p.slug} project={p} index={i} />
                ))}
              </div>
            </>
          )}
          {communityApps.length > 0 && (
            <>
              <h2 className="h-section" style={{ fontSize: 30, marginTop: 56 }}>
                Community apps
              </h2>
              <div className="project-grid">
                {communityApps.map((p, i) => (
                  <ProjectCard key={p.slug} project={p} index={Math.min(i, 8)} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
