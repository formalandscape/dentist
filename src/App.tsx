import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Header, Footer, RouteEffects } from './components/Layout'
import { Home } from './Home'
import { NotFound, PrivacyPage, ServicePage } from './Pages'
import { JourneyPage } from './Journey'
import { ReadingProgress, DetailMotion } from './components/Atmosphere'

function PageContent() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  return (
    <motion.div
      key={pathname}
      className="page-content"
      initial={false}
      animate={reduced ? {} : { opacity: [0.8, 1], y: [8, 0] }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/poslugy/:id/" element={<ServicePage />} />
        <Route path="/vash-shliakh-do-posmishky/" element={<JourneyPage />} />
        <Route path="/polityka-konfidentsiinosti/" element={<PrivacyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </motion.div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouteEffects />
      <DetailMotion />
      <ReadingProgress />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <PageContent />
      </main>
      <Footer />
    </MotionConfig>
  )
}
