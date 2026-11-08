// Copies icons and screenshots from the repository into public/repo/
// so the website always shows the same images as the app READMEs.
// Screenshots are downscaled with macOS `sips` locally, or ImageMagick
// (preinstalled on GitHub's Ubuntu runners) in CI; otherwise copied as-is.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repo = resolve(here, '..', '..')
const out = resolve(here, '..', 'public', 'repo')

const sources = [
  { from: 'assets', to: 'icons', resize: false },
  { from: 'calculator/screenshots', to: 'screens/calculator', resize: true },
  { from: 'weather/screenshots', to: 'screens/weather', resize: true },
  { from: 'Journal/screenshots', to: 'screens/journal', resize: true },
]

const has = (cmd, args) => {
  try {
    execFileSync(cmd, args, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}
const resizer = has('sips', ['--help'])
  ? (src, out) => execFileSync('sips', ['-Z', '900', src, '--out', out], { stdio: 'ignore' })
  : has('magick', ['-version'])
    ? (src, out) => execFileSync('magick', [src, '-resize', '900x900>', '-strip', out], { stdio: 'ignore' })
    : has('convert', ['-version'])
      ? (src, out) => execFileSync('convert', [src, '-resize', '900x900>', '-strip', out], { stdio: 'ignore' })
      : null

rmSync(out, { recursive: true, force: true })
let count = 0

for (const { from, to, resize } of sources) {
  const src = join(repo, from)
  if (!existsSync(src)) continue
  const dest = join(out, to)
  mkdirSync(dest, { recursive: true })

  for (const file of readdirSync(src)) {
    if (!/\.(png|jpe?g|webp)$/i.test(file)) continue
    const target = join(dest, file)
    if (resize && resizer) {
      resizer(join(src, file), target)
    } else {
      cpSync(join(src, file), target)
    }
    count++
  }
}

console.log(`Synced ${count} images into public/repo/`)
