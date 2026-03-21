import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'
import { CommandPalette } from './CommandPalette'
import { TutorBot } from './tutor/TutorBot'
import { useTheme } from '../hooks/useTheme'
import { useScrollTop } from '../hooks/useScrollTop'
import { TRACKS } from '../data/tracks'

function getTitle(pathname: string): string {
  if (pathname === '/') return 'Home'
  if (pathname === '/interview') return 'Interview Prep'

  const parts = pathname.split('/')
  const trackId = parts[2]
  const moduleId = parts[4]

  const track = TRACKS.find(t => t.id === trackId)
  if (!track) return 'Agentic AI'

  if (moduleId) {
    const mod = track.modules.find(m => m.id === moduleId)
    return mod?.title || track.title
  }

  return track.title
}

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  useScrollTop()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const title = getTitle(location.pathname)

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          title={title}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
        />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <ScrollToTop />
      <CommandPalette />
      <TutorBot />
    </div>
  )
}
