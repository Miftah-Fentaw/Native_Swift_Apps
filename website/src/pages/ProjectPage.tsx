import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  CLONE_COMMAND,
  allProjects,
  community,
  findProject,
  githubReadme,
  githubRepoUrl,
  githubTree,
  isCommunity,
  licenseLabel,
  projects,
  repoOwner,
  type Project,
  type Screen,
} from '../data/projects'
import { AppIcon, CopyButton, Icon, LevelBadge, Lightbox, Phone, Reveal, StatusBadge, usePageTitle } from '../components/ui'
import { ProjectCard } from '../components/layout'

function Code({ text }: { text: string }) {
  return (
    <div className="code-line">
      <code>{text}</code>
      <CopyButton text={text} />
    </div>
  )
}

const LICENSE_URL: Record<string, string> = {
  MIT: 'https://opensource.org/license/mit',
  'Apache-2.0': 'https://opensource.org/license/apache-2-0',
  'GPL-3.0': 'https://opensource.org/license/gpl-3-0',
  'AGPL-3.0': 'https://opensource.org/license/agpl-v3',
  'MPL-2.0': 'https://opensource.org/license/mpl-2-0',
  Unlicense: 'https://unlicense.org',
}

/** Up to six other apps, same level first, so the reader has somewhere to go next. */
function related(project: Project) {
  const others = allProjects.filter((p) => p.slug !== project.slug)
  const sameLevel = others.filter((p) => p.level === project.level)
  const rest = isCommunity(project) ? projects.filter((p) => p.level !== project.level) : others.filter((p) => p.level !== project.level)
  return [...sameLevel, ...rest].slice(0, 6)
}

export function ProjectPage() {
  const { slug } = useParams()
  const project = findProject(slug)
  const [zoomed, setZoomed] = useState<Screen | null>(null)
  const external = project ? isCommunity(project) : false
  usePageTitle(
    project?.name ?? 'Project not found',
    project
      ? external
        ? `${project.name} by ${repoOwner(project)}: ${project.tagline} Open-source ${project.level.toLowerCase()} Swift app for ${project.platforms?.replace(/ · /g, ', ')}, with source code on GitHub.`
        : `${project.name}: ${project.tagline} Native Swift and SwiftUI source code, screenshots and README.`
      : undefined,
  )

  if (!project) {
    return (
      <div className="container empty">
        <h2>Project not found</h2>
        <Link to="/explore" className="btn btn-ghost">
          Back to all projects
        </Link>
      </div>
    )
  }

  const repoUrl = project.repo ? githubRepoUrl(project.repo) : undefined
  const more = related(project)

  return (
    <div style={{ ['--card-accent' as string]: project.accent }}>
      <section className="detail-hero">
        <div className="detail-hero-bg" />
        <div className="container">
          <Link to={external ? '/explore?source=community' : '/explore'} className="muted" style={{ fontSize: 14 }}>
            ← {external ? 'Community apps' : 'All projects'}
          </Link>
          <motion.div className="detail-head" style={{ marginTop: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
              <AppIcon project={project} size={96} />
            </motion.div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h1>{project.name}</h1>
              {external && (
                <div className="detail-by">
                  by{' '}
                  <a href={`https://github.com/${repoOwner(project)}`} target="_blank" rel="noreferrer">
                    {repoOwner(project)}
                  </a>{' '}
                  ·{' '}
                  <a href={repoUrl} target="_blank" rel="noreferrer">
                    {project.repo}
                  </a>
                </div>
              )}
              <div className="detail-meta">
                <LevelBadge project={project} />
                <StatusBadge project={project} />
                {project.platforms && <span className="badge" style={{ ['--badge' as string]: 'var(--text-2)' }}>{project.platforms}</span>}
                {project.license && <span className="badge" style={{ ['--badge' as string]: 'var(--text-2)' }}>{licenseLabel(project)}</span>}
                {external && (
                  <img
                    className="stars-badge"
                    src={`https://img.shields.io/github/stars/${project.repo}?style=flat-square&label=stars&color=1c1c1e`}
                    alt="GitHub stars"
                    height={20}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </div>
          </motion.div>
          <motion.p className="lead" style={{ marginTop: 24, maxWidth: 760 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {project.description}
          </motion.p>
          <div className="detail-actions">
            {external && repoUrl && (
              <>
                <a className="btn btn-primary" href={repoUrl} target="_blank" rel="noreferrer">
                  {Icon.github} View on GitHub
                </a>
                <a className="btn btn-ghost" href={`${repoUrl}#readme`} target="_blank" rel="noreferrer">
                  Read the README
                </a>
              </>
            )}
            {!external && project.folder && (
              <a className="btn btn-primary" href={project.hasReadme ? githubReadme(project.folder) : githubTree(project.folder)} target="_blank" rel="noreferrer">
                {Icon.github} {project.hasReadme ? 'Read the README' : 'View source'}
              </a>
            )}
            {!external && project.folder && project.hasReadme && (
              <a className="btn btn-ghost" href={githubTree(project.folder)} target="_blank" rel="noreferrer">
                Browse source
              </a>
            )}
          </div>
        </div>
      </section>

      {project.screens.length > 0 ? (
        <div className="gallery-wrap">
          <div className="gallery">
            {project.screens.map((s, i) => (
              <motion.figure
                key={s.src}
                className="screen-tile"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, ease: [0.2, 0.7, 0.2, 1], duration: 0.6 }}
                whileHover={{ y: -8 }}
                onClick={() => setZoomed(s)}
              >
                <Phone screen={s} eager={i < 4} />
                <figcaption>{s.label}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="notice">
            {external ? (
              <>
                {project.name} is a community app by {repoOwner(project)}. It lives in{' '}
                <a className="doc-link" href={repoUrl} target="_blank" rel="noreferrer">
                  its own repository
                </a>
                , where you’ll find screenshots, documentation and the latest code. This hub only links to it.
              </>
            ) : (
              <>Screenshots and a full README for {project.name} are on the way.</>
            )}
          </div>
        </div>
      )}

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="container">
          {project.features.length > 0 && (
            <>
              <Reveal>
                <h2 className="h-section" style={{ fontSize: 34 }}>
                  Features
                </h2>
              </Reveal>
              <div className="feature-grid" style={{ marginBottom: 20 }}>
                {project.features.map((f, i) => (
                  <Reveal key={f.title} delay={i * 0.06}>
                    <div className="card" style={{ height: '100%' }}>
                      <h4>{f.title}</h4>
                      <ul>
                        {f.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}

          <div className="two-col">
            <Reveal>
              <div className="card" style={{ height: '100%' }}>
                <h4>What you’ll learn</h4>
                <ul>
                  {project.learn.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                <div className="tag-row" style={{ marginTop: 16 }}>
                  {project.tech.map((t) => (
                    <Link key={t} className="tag" to={`/explore?tech=${encodeURIComponent(t)}`}>
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="card" style={{ height: '100%' }}>
                <h4>Run it</h4>
                {external && project.repo ? (
                  <ol className="steps">
                    <li>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        Clone the repository
                        <Code text={`git clone ${githubRepoUrl(project.repo)}.git`} />
                      </div>
                    </li>
                    <li>Open the Xcode project or workspace in the cloned folder.</li>
                    <li>Follow the project’s README for its requirements and setup, then press Run (⌘R).</li>
                  </ol>
                ) : (
                  <ol className="steps">
                    <li>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        Clone the repository
                        <Code text={CLONE_COMMAND} />
                      </div>
                    </li>
                    {project.folder && project.xcodeproj && (
                      <li>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          Open the project in Xcode
                          <Code text={`open Native_Swift_Apps/${project.folder}/${project.xcodeproj}`} />
                        </div>
                      </li>
                    )}
                    <li>Choose an iPhone or iPad simulator and press Run (⌘R).</li>
                  </ol>
                )}
                {project.note && <div className="notice" style={{ marginTop: 16 }}>{project.note}</div>}
                {external && (
                  <p className="muted" style={{ fontSize: 13, marginTop: 16, marginBottom: 0 }}>
                    Licensed under{' '}
                    {project.license && LICENSE_URL[project.license] ? (
                      <a className="doc-link" href={LICENSE_URL[project.license]} target="_blank" rel="noreferrer">
                        {project.license}
                      </a>
                    ) : (
                      <a className="doc-link" href={repoUrl} target="_blank" rel="noreferrer">
                        the repository’s own terms
                      </a>
                    )}{' '}
                    by its authors — not by Native Swift Apps. Check the license before reusing code.
                  </p>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="h-section" style={{ fontSize: 30 }}>
              Keep exploring
            </h2>
            <div className="project-grid">
              {more.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
            {external && (
              <div style={{ marginTop: 24 }}>
                <Link to={`/explore?source=community&level=${project.level}`} className="btn btn-ghost">
                  All {community.filter((p) => p.level === project.level).length} {project.level.toLowerCase()} community apps {Icon.arrow}
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      <Lightbox screen={zoomed} onClose={() => setZoomed(null)} />
    </div>
  )
}
