import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { ProjectGallery } from '@/sections/ProjectGallery'
import { Architecture } from '@/sections/Architecture'
import { TechStack } from '@/sections/TechStack'
import { Security } from '@/sections/Security'
import { Contact } from '@/sections/Contact'

export function Home() {
  return (
    <>
      <Hero />
      <ProjectGallery />
      <Architecture />
      <About />
      <TechStack />
      <Security />
      <Contact />
    </>
  )
}
