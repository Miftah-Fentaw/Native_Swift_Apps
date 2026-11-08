import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { AUTHOR, CLONE_COMMAND, REPO_URL, SITE_URL, githubReadme, projects, roadmap } from '../data/projects'
import { AppIcon, CopyButton, LevelBadge, StatusBadge, usePageTitle } from '../components/ui'

const SECTIONS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'quick-start', title: 'Quick start' },
  { id: 'structure', title: 'Repository structure' },
  { id: 'projects', title: 'Projects' },
  { id: 'website', title: 'Using this website' },
  { id: 'adding', title: 'Adding a project' },
  { id: 'deploying', title: 'Deploying the website' },
  { id: 'contributing', title: 'Contributing' },
  { id: 'faq', title: 'FAQ' },
  { id: 'credits', title: 'Credits & license' },
]

function Code({ children }: { children: string }) {
  return (
    <div className="code-line">
      <code>{children}</code>
      <CopyButton text={children} />
    </div>
  )
}

function Block({ children }: { children: string }) {
  return <pre className="doc-pre">{children}</pre>
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="doc-section">
      <h2>
        <a href={`#/docs?s=${id}`} className="doc-anchor" aria-label={`Link to ${title}`}>
          #
        </a>
        {title}
      </h2>
      {children}
    </section>
  )
}

/** Highlights the section currently in view. */
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-90px 0px -65% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: 'smooth' })
}

export function DocsPage() {
  usePageTitle('Documentation', 'How to run, explore and contribute to Native Swift Apps, and how the explore hub website works.')
  const active = useScrollSpy(SECTIONS.map((s) => s.id))

  // Deep links such as #/docs?s=quick-start
  useEffect(() => {
    const id = new URLSearchParams(window.location.hash.split('?')[1]).get('s')
    if (id) setTimeout(() => scrollTo(id), 80)
  }, [])

  return (
    <div className="container docs">
      <aside className="docs-nav" aria-label="Documentation sections">
        <div className="docs-nav-title">Documentation</div>
        {SECTIONS.map((s) => (
          <button key={s.id} className={`docs-link ${active === s.id ? 'active' : ''}`} onClick={() => scrollTo(s.id)}>
            {active === s.id && <motion.span layoutId="docs-active" className="docs-link-bg" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
            <span>{s.title}</span>
          </button>
        ))}
      </aside>

      <motion.article className="docs-body" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="eyebrow">Documentation</div>
        <h1 className="h-section">Native Swift Apps docs</h1>
        <p className="lead">Everything you need to run the apps, find your way around the repository and contribute.</p>

        <Section id="introduction" title="Introduction">
          <p>
            Native Swift Apps is an open-source collection of complete apps built with Swift and SwiftUI. Every app is a self-contained
            Xcode project with its own README, so you can learn by reading, running and extending real code instead of isolated snippets.
          </p>
          <ul>
            <li>
              <b>Native only:</b> Swift, SwiftUI and Apple frameworks, with no third-party packages.
            </li>
            <li>
              <b>Grouped by difficulty:</b> Beginner, Intermediate and Advanced.
            </li>
            <li>
              <b>Platforms:</b> the current apps run on iPhone and iPad (iOS / iPadOS 27.2 or later).
            </li>
          </ul>
        </Section>

        <Section id="quick-start" title="Quick start">
          <p>You need a Mac with an Xcode version that includes the iOS 27.2 SDK.</p>
          <ol className="steps">
            <li>
              <div style={{ flex: 1, minWidth: 0 }}>
                Clone the repository
                <Code>{CLONE_COMMAND}</Code>
              </div>
            </li>
            <li>
              <div style={{ flex: 1, minWidth: 0 }}>
                Open an app, for example SwiftCalc
                <Code>open Native_Swift_Apps/calculator/calculator.xcodeproj</Code>
              </div>
            </li>
            <li>Choose an iPhone or iPad simulator and press Run (⌘R).</li>
          </ol>
          <p className="muted">To run on a real device, select your own development team under Signing &amp; Capabilities.</p>
        </Section>

        <Section id="structure" title="Repository structure">
          <Block>{`Native_Swift_Apps/
├── calculator/        SwiftCalc — Xcode project, README, screenshots
├── weather/           Weather — Xcode project, README, screenshots
├── Journal/           Journal — Xcode project, README, screenshots
├── website/           This explore hub (React + Vite)
├── assets/            Banner and app icons used by the READMEs
├── .github/           Issue/PR templates and the website deploy workflow
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── LICENSE            MIT`}</Block>
          <p>Each app folder contains its own <code>.xcodeproj</code>, source, unit and UI test targets and, once documented, a README and screenshots.</p>
        </Section>

        <Section id="projects" title="Projects">
          <div className="doc-table">
            {projects.map((p) => (
              <Link key={p.slug} to={`/projects/${p.slug}`} className="doc-row">
                <AppIcon project={p} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b>{p.name}</b>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {p.folder}/ · {p.tagline}
                  </div>
                </div>
                <LevelBadge project={p} />
                <StatusBadge project={p} />
              </Link>
            ))}
          </div>
          <p>
            {roadmap.length} more apps are planned: {roadmap.map((p) => p.name).join(', ')}. See the{' '}
            <a href="#/?s=roadmap" className="doc-link">
              roadmap
            </a>
            .
          </p>
          <p>
            Full per-app documentation lives in each project’s README, for example{' '}
            <a className="doc-link" href={githubReadme('calculator')} target="_blank" rel="noreferrer">
              calculator/README.md
            </a>
            .
          </p>
        </Section>

        <Section id="website" title="Using this website">
          <ul>
            <li>
              <b>Explore</b> lists every app with filters for level and technology, plus search.
            </li>
            <li>
              <b>Project pages</b> show screenshots (click to enlarge), features, what you’ll learn and copy-ready run commands.
            </li>
            <li>
              <b>Ask the hub</b> on the home page matches your question against each app’s features and technology. It runs entirely in
              your browser.
            </li>
            <li>
              <b>⌘K / Ctrl+K</b> opens a command palette for projects, features, technology and quick actions.
            </li>
            <li>
              <b>Theme:</b> follows your system setting; use the sun/moon button to switch.
            </li>
          </ul>
        </Section>

        <Section id="adding" title="Adding a project">
          <p>In the repository:</p>
          <ol className="steps">
            <li>Create a top-level folder with the Xcode project.</li>
            <li>Add a README following the existing ones (overview, screenshots, features, getting started, architecture, testing).</li>
            <li>
              Put screenshots in <code>&lt;folder&gt;/screenshots/</code> and the icon in <code>assets/</code>.
            </li>
            <li>Add a card for it in the root README.</li>
          </ol>
          <p>On the website:</p>
          <ol className="steps">
            <li>
              Add an entry to <code>projects</code> in <code>website/src/data/projects.ts</code> (and remove it from <code>roadmap</code>).
            </li>
            <li>
              If the folder is new, add it to the <code>sources</code> list in <code>website/scripts/sync-assets.mjs</code>.
            </li>
          </ol>
        </Section>

        <Section id="deploying" title="Deploying the website">
          <p>
            The site is static and uses hash routing with relative paths, so it works on GitHub Pages without extra configuration. The
            workflow <code>.github/workflows/deploy-website.yml</code> builds <code>website/</code> and publishes it on every push to{' '}
            <code>main</code> that touches the site, icons or screenshots.
          </p>
          <ol className="steps">
            <li>
              In the GitHub repository, open <b>Settings → Pages</b> and set <b>Source</b> to <b>GitHub Actions</b>.
            </li>
            <li>
              Push to <code>main</code>, or run the workflow manually from the <b>Actions</b> tab.
            </li>
            <li>
              The site is published at{' '}
              <a className="doc-link" href={SITE_URL} target="_blank" rel="noreferrer">
                {SITE_URL.replace('https://', '')}
              </a>
              .
            </li>
          </ol>
          <p>Run it locally:</p>
          <Code>cd website && npm install && npm run dev</Code>
        </Section>

        <Section id="contributing" title="Contributing">
          <p>
            Bug fixes, documentation and new ideas are welcome. Please read the{' '}
            <a className="doc-link" href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
              contributing guide
            </a>{' '}
            and{' '}
            <a className="doc-link" href={`${REPO_URL}/blob/main/CODE_OF_CONDUCT.md`} target="_blank" rel="noreferrer">
              code of conduct
            </a>
            , and report security issues privately as described in the{' '}
            <a className="doc-link" href={`${REPO_URL}/blob/main/SECURITY.md`} target="_blank" rel="noreferrer">
              security policy
            </a>
            .
          </p>
        </Section>

        <Section id="faq" title="FAQ">
          <details className="faq">
            <summary>Do the apps need any API keys or accounts?</summary>
            <p>No. SwiftCalc and Journal work fully offline. Weather uses the free Open-Meteo APIs, which need no key.</p>
          </details>
          <details className="faq">
            <summary>Do the apps run on macOS?</summary>
            <p>Not yet. The current apps target iPhone and iPad.</p>
          </details>
          <details className="faq">
            <summary>Can I use this code in my own app?</summary>
            <p>Yes — everything is MIT licensed. Check third-party data terms too, such as Open-Meteo’s for commercial use.</p>
          </details>
          <details className="faq">
            <summary>Is “Ask the hub” using AI?</summary>
            <p>No. It is a keyword search over the project data, run in your browser. Nothing is sent anywhere.</p>
          </details>
        </Section>

        <Section id="credits" title="Credits & license">
          <p>
            Native Swift Apps is created and maintained by{' '}
            <a className="doc-link" href={AUTHOR.url} target="_blank" rel="noreferrer">
              {AUTHOR.name}
            </a>
            . The code is released under the{' '}
            <a className="doc-link" href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
              MIT License
            </a>
            . Weather data in the Weather app is provided by Open-Meteo.
          </p>
        </Section>
      </motion.article>
    </div>
  )
}
