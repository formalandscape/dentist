import { MotionConfig } from 'motion/react'
import { Route, Routes } from 'react-router-dom'
import { Header, Footer, RouteEffects } from './components/Layout'
import { Home } from './Home'
import { NotFound, PrivacyPage, ServicePage } from './Pages'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouteEffects />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poslugy/:id/" element={<ServicePage />} />
          <Route path="/polityka-konfidentsiinosti/" element={<PrivacyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </MotionConfig>
  )
}
