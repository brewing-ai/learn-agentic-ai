import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProgressProvider } from './context/ProgressContext'
import { TutorProvider } from './context/TutorContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { TrackPage } from './pages/TrackPage'
import { ModulePage } from './pages/ModulePage'
import { InterviewPage } from './pages/InterviewPage'

export default function App() {
  return (
    <ProgressProvider>
      <TutorProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="tracks/:trackId" element={<TrackPage />} />
            <Route path="tracks/:trackId/modules/:moduleId" element={<ModulePage />} />
            <Route path="interview" element={<InterviewPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
      </TutorProvider>
    </ProgressProvider>
  )
}
