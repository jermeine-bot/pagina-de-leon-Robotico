import { useEffect, useState } from 'react'
import { CmsProvider } from '@/cms/CmsContext'
import { AdminApp } from '@/cms/AdminApp'
import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { MarqueeStrip } from '@/components/MarqueeStrip'
import { LearningCards } from '@/components/LearningCards'
import { LearningJourney } from '@/components/LearningJourney'
import { WorkshopGallery } from '@/components/WorkshopGallery'
import { ActivityCarousel } from '@/components/ActivityCarousel'
import { ProjectsSection } from '@/components/ProjectsSection'
import { KidsRobots } from '@/components/KidsRobots'
import { InstitutionalSection } from '@/components/InstitutionalSection'
import { FAQSection } from '@/components/FAQSection'
import { RegistrationForm } from '@/components/RegistrationForm'
import { Footer } from '@/components/Footer'
import { Preloader } from '@/components/Preloader'
import { ScrollProgress } from '@/components/ScrollProgress'
import { FloatingCTA } from '@/components/FloatingCTA'

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return hash
}

export default function App() {
  const hash = useHash()
  const isAdmin = hash.startsWith('#admin')

  useEffect(() => {
    const safety = setTimeout(() => {
      const el = document.querySelector('.preloader-root')
      if (el) el.classList.add('out')
    }, 10000)
    return () => clearTimeout(safety)
  }, [])

  return (
    <CmsProvider>
      {isAdmin ? (
        <AdminApp />
      ) : (
        <div className="min-h-screen bg-white text-brand-deep antialiased">
          <Preloader onComplete={() => {}} />
          <ScrollProgress />
          <Navbar />
          <main>
            <HeroSection />
            <MarqueeStrip />
            <LearningCards />
            <LearningJourney />
            <WorkshopGallery />
            <ActivityCarousel />
            <ProjectsSection />
            <KidsRobots />
            <InstitutionalSection />
            <FAQSection />
            <RegistrationForm />
          </main>
          <Footer />
          <FloatingCTA />
        </div>
      )}
    </CmsProvider>
  )
}
