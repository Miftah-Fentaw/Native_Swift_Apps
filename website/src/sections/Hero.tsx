import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { REPO_URL, allScreens, type Screen } from '../data/projects'
import { Icon, Phone } from '../components/ui'

type Token = { type: 'word'; text: string } | { type: 'swift' }

// Headline with the Swift logo tucked between the words (it links to the repo).
const headline: Token[] = [
  { type: 'word', text: 'Where' },
  { type: 'swift' },
  { type: 'word', text: 'Swift' },
  { type: 'word', text: 'developers' },
  { type: 'word', text: 'learn' },
  { type: 'word', text: 'by' },
  { type: 'word', text: 'building' },
  { type: 'word', text: 'real' },
  { type: 'word', text: 'apps.' },
]

function MarqueeColumn({ screens, duration, reverse }: { screens: Screen[]; duration: number; reverse?: boolean }) {
  // Two copies of the list so the loop is seamless.
  const loop = [...screens, ...screens]
  return (
    <div className="marquee-col">
      <motion.div
        className="marquee-track"
        animate={{ y: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {loop.map((s, i) => (
          <Phone key={`${s.src}-${i}`} screen={s} eager={i < 3} />
        ))}
      </motion.div>
    </div>
  )
}

export function Hero() {
  // Spread the screenshots over five columns, rotating the start so neighbours differ.
  const columns = Array.from({ length: 5 }, (_, c) => {
    const rotated = [...allScreens.slice((c * 3) % allScreens.length), ...allScreens.slice(0, (c * 3) % allScreens.length)]
    return rotated.slice(0, 5)
  })

  return (
    <section className="hero">
      <div className="container hero-copy">
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Open source · Swift & SwiftUI · iOS & iPadOS
        </motion.div>

        <h1 className="h-display hero-title">
          {headline.map((token, i) => {
            const delay = 0.1 + i * 0.07
            if (token.type === 'word') {
              return (
                <motion.span
                  key={i}
                  className="word"
                  initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  {token.text}
                </motion.span>
              )
            }
            return (
              <motion.a
                key={i}
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Native Swift Apps on GitHub"
                className="inline-icon"
                initial={{ opacity: 0, scale: 0.3, rotate: -18 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 16, delay: delay + 0.15 }}
                whileHover={{ scale: 1.15, rotate: 8 }}
              >
                <img src="./swift.jpeg" alt="Swift" />
              </motion.a>
            )
          })}
        </h1>

        <motion.p
          className="lead hero-sub"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          A growing collection of complete, native apps — each with its own Xcode project, README and screenshots. Clone one, run it,
          and read how it works.
        </motion.p>

        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.15 }}
        >
          <Link to="/explore" className="btn btn-primary">
            Explore projects {Icon.arrow}
          </Link>
          <a href="#/?s=ask" className="btn btn-ghost">
            Ask the hub
          </a>
        </motion.div>
      </div>

      <motion.div
        className="marquee"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
        aria-hidden
      >
        {columns.map((screens, i) => (
          <MarqueeColumn key={i} screens={screens} duration={38 + i * 6} reverse={i % 2 === 1} />
        ))}
      </motion.div>
    </section>
  )
}
