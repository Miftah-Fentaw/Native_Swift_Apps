import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { jsonLd, noscript } from './scripts/seo'
import { changelog, patternCode } from './scripts/repo-content'
import { validateData } from './scripts/validate'
import { community } from './src/data/projects'

/** Fills the SEO placeholders in index.html from the project data. */
function seo(): Plugin {
  return {
    name: 'native-swift-apps-seo',
    transformIndexHtml: (html) =>
      html
        .replace('<!--seo:jsonld-->', jsonLd())
        .replace('<!--seo:noscript-->', noscript())
        .replaceAll('{{COMMUNITY_COUNT}}', String(community.length)),
  }
}

/**
 * Serves content read from the rest of the repository as virtual modules:
 * `virtual:pattern-code` (Swift excerpts) and `virtual:changelog` (CHANGELOG.md).
 */
function repoContent(): Plugin {
  const modules: Record<string, () => unknown> = {
    'virtual:pattern-code': patternCode,
    'virtual:changelog': changelog,
  }
  return {
    name: 'native-swift-apps-repo-content',
    buildStart: validateData,
    resolveId: (id) => (id in modules ? `\0${id}` : undefined),
    load(id) {
      const name = id.startsWith('\0') ? id.slice(1) : ''
      if (!(name in modules)) return
      return `export default ${JSON.stringify(modules[name]())}`
    },
  }
}

// `base: './'` keeps asset paths relative, and the app uses hash routing,
// so the build works on GitHub Pages under /Native_Swift_Apps/ (or any path)
// without a 404.html redirect.
export default defineConfig({
  base: './',
  plugins: [react(), seo(), repoContent()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Long-lived vendor chunks that rarely change between deploys.
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client', 'react-router-dom'],
          motion: ['motion'],
        },
      },
    },
  },
})
