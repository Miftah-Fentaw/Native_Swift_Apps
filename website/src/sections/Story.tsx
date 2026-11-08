import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView, animate, type MotionValue } from 'motion/react'
import { useEffect, useState } from 'react'
import { allScreens, allTech, projects, roadmap } from '../data/projects'

// Alternate between apps so the pile shows more than one project.
const pileScreens = (() => {
  const lists = projects.map((p) => p.screens).filter((l) => l.length > 0)
  const out = []
  for (let i = 0; out.length < allScreens.length; i++) {
    for (const list of lists) if (list[i]) out.push(list[i])
  }
  return out
})()
import { Phone } from '../components/ui'

const clamp = (v: number) => Math.min(1, Math.max(0, v))

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.4, ease: [0.2, 0.7, 0.2, 1], onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])
  return <span ref={ref}>{value}</span>
}

export function Stats() {
  const stats = [
    { value: projects.length, label: 'Apps in the repo' },
    { value: allScreens.length, label: 'Real screenshots' },
    { value: allTech.length, label: 'Apple technologies' },
    { value: roadmap.length, label: 'Apps on the roadmap' },
  ]
  return (
    <div className="container">
      <div className="stats">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-value">
              <CountUp to={s.value} />
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Deterministic scatter so the pile looks the same on every visit.
const scatter = [
  { x: -520, y: -220, r: -14 },
  { x: 430, y: -250, r: 11 },
  { x: -380, y: 210, r: 9 },
  { x: 520, y: 170, r: -8 },
  { x: -120, y: -300, r: 6 },
  { x: 180, y: 290, r: -12 },
  { x: -620, y: 30, r: 4 },
  { x: 640, y: -30, r: -5 },
  { x: -250, y: 330, r: -3 },
  { x: 300, y: -340, r: 15 },
]

function PileCard({ index, total, progress }: { index: number; total: number; progress: MotionValue<number> }) {
  const screen = pileScreens[index]
  const start = scatter[index % scatter.length]
  const isNarrow = typeof window !== 'undefined' && window.innerWidth < 720
  const scale = isNarrow ? 0.45 : 1
  const spacing = isNarrow ? 100 : 165
  const endX = (index - (total - 1) / 2) * spacing

  const x = useTransform(progress, [0, 0.55], [start.x * scale, endX])
  const y = useTransform(progress, [0, 0.55], [start.y * scale, 40])
  const rotate = useTransform(progress, [0, 0.55], [start.r, 0])
  // Function form keeps opacity on the same JS-driven timeline as x/y
  // (the array form can be hardware-accelerated and drift out of sync).
  const opacity = useTransform(progress, (v) => 0.35 + 0.65 * clamp(v / 0.1))

  return (
    <motion.div className="pile-card" style={{ x, y, rotate, opacity, zIndex: index }}>
      <Phone screen={screen} />
    </motion.div>
  )
}

/** Scroll-driven section: a messy pile of screenshots settles into one tidy row. */
export function Pile() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const total = Math.min(allScreens.length, 7)
  const firstOpacity = useTransform(scrollYProgress, (v) => 1 - clamp((v - 0.25) / 0.1))
  const secondOpacity = useTransform(scrollYProgress, (v) => clamp((v - 0.35) / 0.15))
  const secondY = useTransform(scrollYProgress, [0.35, 0.5], [20, 0])
  const copyY = useTransform(scrollYProgress, [0, 0.55], [0, -180])

  return (
    <section className="pile-section" ref={ref}>
      <div className="pile-sticky">
        <div className="pile-stage">
          {Array.from({ length: total }, (_, i) => (
            <PileCard key={i} index={i} total={total} progress={scrollYProgress} />
          ))}
        </div>
        <motion.div className="pile-copy" style={{ y: copyY }}>
          <motion.div style={{ opacity: firstOpacity }}>
            <h2 className="h-section">
              Tutorials stop at the hard part.
              <br />
              <span className="muted">Scattered snippets. Toy examples.</span>
            </h2>
          </motion.div>
          <motion.div style={{ opacity: secondOpacity, y: secondY, position: 'absolute', inset: 0 }}>
            <h2 className="h-section">
              Here, every app is finished.
              <br />
              <span className="muted">Clone it. Run it. Read it.</span>
            </h2>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
