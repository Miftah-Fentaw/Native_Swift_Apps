import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { CLONE_COMMAND, githubReadme, githubTree, projects, type Screen } from '../data/projects'
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

export function ProjectPage() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)
  const [zoomed, setZoomed] = useState<Screen | null>(null)
  usePageTitle(project?.name ?? 'Project not found', project ? `${project.name}: ${project.tagline}` : undefined)


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

  const others = projects.filter((p) => p.slug !== project.slug)

  return (
    <div style={{ ['--card-accent' as string]: project.accent }}>
      <section className="detail-hero">
        <div className="detail-hero-bg" />
        <div className="container">
          <Link to="/explore" className="muted" style={{ fontSize: 14 }}>
            ← All projects
          </Link>
          <motion.div className="detail-head" style={{ marginTop: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
              <AppIcon project={project} size={96} />
            </motion.div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h1>{project.name}</h1>
              <div className="detail-meta">
                <LevelBadge project={project} />
                <StatusBadge project={project} />
                {project.platforms && <span className="badge" style={{ ['--badge' as string]: 'var(--text-2)' }}>{project.platforms}</span>}
              </div>
            </div>
          </motion.div>
          <motion.p className="lead" style={{ marginTop: 24, maxWidth: 760 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {project.description}
          </motion.p>
          <div className="detail-actions">
            {project.folder && (
              <a className="btn btn-primary" href={project.hasReadme ? githubReadme(project.folder) : githubTree(project.folder)} target="_blank" rel="noreferrer">
                {Icon.github} {project.hasReadme ? 'Read the README' : 'View source'}
              </a>
            )}
            {project.folder && project.hasReadme && (
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
          <div className="notice">Screenshots and a full README for {project.name} are on the way.</div>
        </div>
      )}

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="container">
          <Reveal>
            <h2 className="h-section" style={{ fontSize: 34 }}>
              Features
            </h2>
          </Reveal>
          <div className="feature-grid">
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

          <div className="two-col" style={{ marginTop: 20 }}>
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
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="h-section" style={{ fontSize: 30 }}>
              More apps
            </h2>
            <div className="project-grid">
              {others.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Lightbox screen={zoomed} onClose={() => setZoomed(null)} />
    </div>
  )
}
