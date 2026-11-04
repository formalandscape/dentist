import { useEffect } from 'react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Header, Footer, RouteEffects } from './components/Layout'
import { Home } from './Home'
import { NotFound, PrivacyPage, ServicePage } from './Pages'
import { JourneyPage } from './Journey'
import { ReadingProgress, DetailMotion, MotionEnvironment } from './components/Atmosphere'
import { sceneVariants } from './motion/presets'

function SceneLayout() {
  const location = useLocation()
  useEffect(() => {
    document.dispatchEvent(new Event('site:scene-ready'))
  }, [location.key])
  return (
    <>
      <DetailMotion />
      <Outlet />
    </>
  )
}

function PageContent() {
  const location = useLocation()
  const reduced = useReducedMotion()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="page-content"
        data-page={location.pathname}
        initial="enter"
        animate="visible"
        exit="leave"
        variants={
          reduced
            ? {
                enter: { opacity: 1, y: 0 },
                visible: { opacity: 1, y: 0, transition: { duration: 0 } },
                leave: { opacity: 1, y: 0, transition: { duration: 0 } },
              }
            : sceneVariants
        }
        onAnimationStart={(name) => {
          document
            .getElementById('main-content')
            ?.setAttribute('data-motion-phase', name === 'leave' ? 'leaving' : 'entering')
        }}
        onAnimationComplete={(name) => {
          if (name === 'visible')
            document.getElementById('main-content')?.setAttribute('data-motion-phase', 'steady')
        }}
      >
        <Routes location={location}>
          <Route element={<SceneLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/poslugy/:id/" element={<ServicePage />} />
            <Route path="/vash-shliakh-do-posmishky/" element={<JourneyPage />} />
            <Route path="/polityka-konfidentsiinosti/" element={<PrivacyPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouteEffects />
      <MotionEnvironment />
      <ReadingProgress />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <div className="scene-ambience" aria-hidden="true">
          <span />
          <span />
        </div>
        <PageContent />
      </main>
      <Footer />
    </MotionConfig>
  )
}
