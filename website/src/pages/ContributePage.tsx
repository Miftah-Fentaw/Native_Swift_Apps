import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { REPO_URL, community, githubRepoUrl } from '../data/projects'
import { PLATFORMS } from '../data/learn'
import { AppIcon, Icon, PageHead, Reveal, usePageTitle } from '../components/ui'

const WAYS = [
  { title: 'Report a bug', body: 'Something broken in an app or on this site? Tell us how to reproduce it.', href: `${REPO_URL}/issues/new?template=bug_report.md`, cta: 'Open a bug report' },
  { title: 'Request a feature', body: 'An improvement to an app, or a new app for the roadmap.', href: `${REPO_URL}/issues/new?template=feature_request.md`, cta: 'Request a feature' },
  { title: 'Improve the docs', body: 'Clarify a README, fix a typo or add a missing setup step.', href: `${REPO_URL}/issues/new?template=documentation.md`, cta: 'Suggest a docs change' },
  { title: 'Send a pull request', body: 'Fix a bug or build an agreed improvement. Keep changes scoped to one project.', href: `${REPO_URL}/blob/main/CONTRIBUTING.md#making-changes`, cta: 'Read the workflow' },
]

const FIRST_STEPS = [
  'Fork the repository and clone your fork.',
  'Create a branch such as fix/short-description or docs/short-description.',
  'Open the project folder in Xcode, make a focused change and run the tests (⌘U).',
  'Update the project’s README if features, requirements or setup changed.',
  'Open a pull request and fill in the template.',
]

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const

/** Accepts `owner/repo` or any github.com URL and returns `owner/repo`. */
const parseRepo = (input: string) => {
  const m = input.trim().match(/^(?:https?:\/\/)?(?:www\.)?(?:github\.com\/)?([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?(?:[#?].*)?$/i)
  return m ? `${m[1]}/${m[2]}` : null
}

function SuggestForm() {
  const [repoInput, setRepoInput] = useState('')
  const [name, setName] = useState('')
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('Beginner')
  const [platforms, setPlatforms] = useState<string[]>(['iOS'])
  const [license, setLicense] = useState('')
  const [learn, setLearn] = useState('')
  const [needs, setNeeds] = useState('')

  const repo = parseRepo(repoInput)
  const existing = repo ? community.find((p) => p.repo?.toLowerCase() === repo.toLowerCase()) : undefined
  const ready = Boolean(repo && learn.trim() && !existing)

  const body = useMemo(
    () =>
      [
        '**Repository**',
        repo ? githubRepoUrl(repo) : '',
        '',
        '**Level**',
        level,
        '',
        '**Platforms**',
        platforms.join(', '),
        '',
        '**What can someone learn from it?**',
        learn.trim(),
        '',
        '**License**',
        license.trim() || 'Not sure',
        '',
        '**Anything needed to run it**',
        needs.trim() || 'Nothing extra',
      ].join('\n'),
    [repo, level, platforms, learn, license, needs],
  )

  const title = `[Community app] ${name.trim() || repo?.split('/')[1] || ''}`
  const url = `${REPO_URL}/issues/new?${new URLSearchParams({ title, labels: 'community-app', body })}`
  const toggle = (p: string) => setPlatforms((list) => (list.includes(p) ? list.filter((x) => x !== p) : [...list, p]))

  return (
    <div className="suggest">
      <form className="suggest-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          <span>GitHub repository *</span>
          <input value={repoInput} onChange={(e) => setRepoInput(e.target.value)} placeholder="owner/repo or https://github.com/owner/repo" autoComplete="off" spellCheck={false} />
          {repoInput && !repo && <small className="field-error">That doesn’t look like a GitHub repository.</small>}
          {existing && (
            <small className="field-ok">
              Already listed: <Link to={`/projects/${existing.slug}`}>{existing.name}</Link>
            </small>
          )}
        </label>
        <label>
          <span>App name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="As the author writes it" />
        </label>
        <fieldset>
          <legend>Level</legend>
          <div className="seg">
            {LEVELS.map((l) => (
              <button type="button" key={l} className={level === l ? 'active' : ''} onClick={() => setLevel(l)}>
                {l}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Platforms</legend>
          <div className="chip-row">
            {PLATFORMS.map((p) => (
              <button type="button" key={p} className={`chip ${platforms.includes(p) ? 'active' : ''}`} onClick={() => toggle(p)} aria-pressed={platforms.includes(p)}>
                {p}
              </button>
            ))}
          </div>
        </fieldset>
        <label>
          <span>License</span>
          <input value={license} onChange={(e) => setLicense(e.target.value)} placeholder="For example MIT or GPL-3.0" />
        </label>
        <label>
          <span>What can someone learn from it? *</span>
          <textarea value={learn} onChange={(e) => setLearn(e.target.value)} rows={4} placeholder="The frameworks, patterns or architecture that make it worth reading." />
        </label>
        <label>
          <span>Anything needed to run it</span>
          <input value={needs} onChange={(e) => setNeeds(e.target.value)} placeholder="API key, server, minimum Xcode…" />
        </label>
      </form>

      <div className="suggest-preview">
        <div className="suggest-preview-head">
          <b>Issue preview</b>
          <small className="muted">You can edit it on GitHub before submitting.</small>
        </div>
        <div className="suggest-title">{title}</div>
        <pre>{body}</pre>
        <a
          className={`btn btn-primary ${ready ? '' : 'disabled'}`}
          href={ready ? url : undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!ready}
          onClick={(e) => !ready && e.preventDefault()}
        >
          {Icon.github} Open on GitHub
        </a>
        {!ready && !existing && <small className="muted">Add the repository and what it teaches to continue.</small>}
      </div>
    </div>
  )
}

export function ContributePage() {
  usePageTitle('Contribute', 'Ways to contribute to Native Swift Apps: report bugs, improve documentation, send pull requests or suggest an open-source Swift app.')
  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <PageHead
        eyebrow="Contribute"
        title="Help make it better"
        lead="Contributions of every size are welcome — a typo fix, a clearer README, a bug fix or a great open-source app for the community list."
      />

      <div className="ways">
        {WAYS.map((w, i) => (
          <Reveal key={w.title} delay={i * 0.05}>
            <a className="way" href={w.href} target="_blank" rel="noreferrer">
              <h3>{w.title}</h3>
              <p>{w.body}</p>
              <span className="way-cta">
                {w.cta} {Icon.arrow}
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <section className="about-section" id="suggest">
        <Reveal>
          <div className="eyebrow">Community apps</div>
          <h2 className="h-section" style={{ fontSize: 34 }}>
            Suggest an app
          </h2>
          <p className="lead" style={{ marginBottom: 28 }}>
            Fill this in and we’ll open a pre-filled issue on GitHub for you to check and submit. Nothing is sent until you do.
          </p>
        </Reveal>
        <SuggestForm />
        <div className="suggest-recent">
          <span className="muted">Recently listed:</span>
          {community.slice(-5).map((p) => (
            <Link key={p.slug} to={`/projects/${p.slug}`} className="app-chip">
              <AppIcon project={p} size={20} />
              <span>{p.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-section two-col">
        <Reveal>
          <div className="card" style={{ height: '100%' }}>
            <h4>Your first pull request</h4>
            <ol className="steps">
              {FIRST_STEPS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="card" style={{ height: '100%' }}>
            <h4>House rules</h4>
            <ul>
              <li>Follow the Swift API Design Guidelines and the style of the project you’re editing.</li>
              <li>Prefer SwiftUI and Apple frameworks; avoid new dependencies.</li>
              <li>Never commit secrets, xcuserdata/ or .DS_Store.</li>
              <li>Never copy another project’s code or screenshots — link to them.</li>
              <li>Be kind. The code of conduct applies everywhere.</li>
            </ul>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
              <a className="btn btn-ghost" href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
                CONTRIBUTING.md
              </a>
              <a className="btn btn-ghost" href={`${REPO_URL}/blob/main/CODE_OF_CONDUCT.md`} target="_blank" rel="noreferrer">
                Code of conduct
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="notice">
        Found a security issue? Please don’t open a public issue —{' '}
        <a className="doc-link" href={`${REPO_URL}/security/advisories/new`} target="_blank" rel="noreferrer">
          report it privately
        </a>{' '}
        as described in the security policy.
      </div>
    </div>
  )
}
