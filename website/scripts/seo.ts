// Builds the SEO parts of index.html from src/data/projects.ts, so search
// engines see every project — including the community apps — without
// running JavaScript:
//   <!--seo:jsonld-->    JSON-LD structured data (WebSite, Person, ItemList)
//   <!--seo:noscript-->  a plain list of links inside <noscript>
import { AUTHOR, REPO_URL, SITE_URL, allProjects, community, githubRepoUrl, githubTree, projects, type Project } from '../src/data/projects'
import { sitePages } from '../src/data/pages'

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const pageUrl = (p: Project) => `${SITE_URL}#/projects/${p.slug}`
const codeUrl = (p: Project) => (p.repo ? githubRepoUrl(p.repo) : githubTree(p.folder ?? ''))
const licenseUrl = (p: Project) =>
  p.repo ? (p.license && p.license !== 'Custom' ? `https://spdx.org/licenses/${p.license}.html` : githubRepoUrl(p.repo)) : 'https://opensource.org/licenses/MIT'

function sourceCode(p: Project) {
  return {
    '@type': 'SoftwareSourceCode',
    name: p.name,
    description: `${p.tagline} ${p.description}`,
    url: pageUrl(p),
    codeRepository: codeUrl(p),
    programmingLanguage: 'Swift',
    runtimePlatform: p.platforms?.replace(/ \d.*$/, '').split(' · ') ?? [],
    license: licenseUrl(p),
    keywords: [...p.tech, p.level].join(', '),
    ...(p.repo ? {} : { author: { '@id': '#author' } }),
  }
}

export function jsonLd() {
  const graph = [
    {
      '@type': 'WebSite',
      '@id': '#website',
      name: 'Native Swift Apps',
      url: SITE_URL,
      description: `Explore hub for open-source native Swift and SwiftUI apps: ${projects.length} apps in the Native Swift Apps repository and ${community.length} hand-picked community apps, sorted by level.`,
      inLanguage: 'en',
      author: { '@id': '#author' },
    },
    {
      '@type': 'Person',
      '@id': '#author',
      name: AUTHOR.name,
      url: AUTHOR.url,
      sameAs: [AUTHOR.url],
    },
    {
      '@type': 'SoftwareSourceCode',
      name: 'Native Swift Apps',
      description: 'An open-source collection of native Swift and SwiftUI apps for Apple platforms, built for learning.',
      codeRepository: REPO_URL,
      programmingLanguage: 'Swift',
      runtimePlatform: ['iOS', 'iPadOS'],
      license: 'https://opensource.org/licenses/MIT',
      author: { '@id': '#author' },
    },
    {
      '@type': 'ItemList',
      name: 'Native Swift Apps projects and community Swift apps',
      numberOfItems: allProjects.length,
      itemListElement: allProjects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: sourceCode(p) })),
    },
  ]
  // `<` is escaped so no text in the data can close the script tag.
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">\n${json}\n</script>`
}

export function noscript() {
  const item = (p: Project) =>
    `<li><a href="${escapeHtml(codeUrl(p))}">${escapeHtml(p.name)}</a> — ${escapeHtml(p.level)}${
      p.platforms ? `, ${escapeHtml(p.platforms)}` : ''
    }. ${escapeHtml(p.tagline)}</li>`
  return [
    `<h1>Native Swift Apps</h1>`,
    `<p>Open-source Swift and SwiftUI apps by ${escapeHtml(AUTHOR.name)}, plus hand-picked community apps. Source code: <a href="${REPO_URL}">${REPO_URL.replace('https://', '')}</a>.</p>`,
    `<h2>Apps in this repository</h2>`,
    `<ul>${projects.map(item).join('')}</ul>`,
    `<h2>Community apps</h2>`,
    `<ul>${community.map(item).join('')}</ul>`,
    `<h2>Pages</h2>`,
    `<ul>${sitePages.map((p) => `<li><a href="${SITE_URL}#${p.path}">${escapeHtml(p.title)}</a> — ${escapeHtml(p.description)}</li>`).join('')}</ul>`,
  ].join('\n      ')
}
