import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePageTitle } from '../components/ui'
import { Hero } from '../sections/Hero'
import { Pile, Stats } from '../sections/Story'
import { AskHub, Cta, LearningPath, Library, TechStack } from '../sections/Explore'

export function Home() {
  usePageTitle()
  const [params] = useSearchParams()
  const target = params.get('s')

  // `#/?s=path` style links scroll to a section on the home page.
  useEffect(() => {
    if (!target) return
    const id = target === 'roadmap' ? 'library' : target
    const el = document.getElementById(id)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }, [target])

  return (
    <>
      <Hero />
      <Stats />
      <Pile />
      <Library />
      <AskHub />
      <LearningPath />
      <TechStack />
      <Cta />
    </>
  )
}
