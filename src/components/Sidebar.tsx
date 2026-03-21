import { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, MessageSquare, Search } from 'lucide-react'
import { TRACKS } from '../data/tracks'
import { INTERVIEW_QUESTIONS } from '../data/interview-questions'
import { useProgress } from '../context/ProgressContext'
import { ProgressBar } from './ProgressBar'
import { cn } from '../lib/utils'

interface Props {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: Props) {
  const [search, setSearch] = useState('')
  const location = useLocation()
  const { overallProgress, trackProgress } = useProgress()
  const progress = overallProgress()

  const totalQuestions = INTERVIEW_QUESTIONS.conceptual.length + INTERVIEW_QUESTIONS.security.length + INTERVIEW_QUESTIONS.systemDesign.length

  const filteredTracks = useMemo(() => {
    if (!search) return TRACKS
    const q = search.toLowerCase()
    return TRACKS.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.modules.some(m => m.title.toLowerCase().includes(q))
    )
  }, [search])

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />
      )}

      <aside className={cn(
        'fixed lg:sticky top-0 left-0 z-50 h-screen w-[272px] bg-[var(--color-surface-subtle)] border-r border-[var(--color-border-subtle)] flex flex-col overflow-hidden transition-transform duration-300 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Brand */}
        <div className="px-5 pt-6 pb-4">
          <Link to="/" onClick={onClose} className="block">
            <h1 className="text-sm font-extrabold tracking-tight text-[var(--color-text-primary)]">AGENTIC AI</h1>
            <p className="text-[0.7rem] text-[var(--color-text-muted)] tracking-wide">Learn · Build · Master</p>
          </Link>
        </div>

        {/* Progress */}
        <div className="px-5 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[var(--color-text-muted)]">Progress</span>
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">{progress.done} / {progress.total}</span>
          </div>
          <ProgressBar pct={progress.pct} showLabel={false} />
        </div>

        {/* Search */}
        <div className="px-5 mb-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-[var(--color-surface-muted)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] border border-transparent focus:border-[var(--color-border)]"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          <div className="mb-1">
            <span className="px-3 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Navigate</span>
          </div>

          <Link
            to="/"
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5',
              isActive('/') ? 'bg-[var(--color-accent-soft)] font-medium text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
            )}
          >
            <Home size={15} />
            Home
          </Link>

          <Link
            to="/interview"
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5',
              isActive('/interview') ? 'bg-[var(--color-accent-soft)] font-medium text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
            )}
          >
            <MessageSquare size={15} />
            Interview Prep
            <span className="ml-auto text-[0.65rem] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] px-1.5 py-0.5 rounded-full font-medium">{totalQuestions}</span>
          </Link>

          <div className="mt-4 mb-1">
            <span className="px-3 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">Tracks</span>
          </div>

          {filteredTracks.map(track => {
            const tp = trackProgress(track.id)
            const active = location.pathname.startsWith(`/tracks/${track.id}`)
            return (
              <Link
                key={track.id}
                to={`/tracks/${track.id}`}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 group',
                  active ? 'bg-[var(--color-accent-soft)] font-medium text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                )}
              >
                <span className="text-base shrink-0">{track.icon}</span>
                <span className="truncate flex-1">{track.title}</span>
                {tp.done > 0 && (
                  <span className="text-[0.6rem] text-[var(--color-success)] font-medium shrink-0">
                    {tp.done}/{tp.total}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
