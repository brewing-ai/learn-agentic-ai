import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { TRACKS } from '../data/tracks'
import { useProgress } from '../context/ProgressContext'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { ProgressBar } from '../components/ProgressBar'
import { staggerContainer, staggerItem, fadeInUp } from '../lib/motion'

export function TrackPage() {
  const { trackId } = useParams()
  const track = TRACKS.find(t => t.id === trackId)
  const { trackProgress, isComplete } = useProgress()

  if (!track) return <Navigate to="/" replace />

  const progress = trackProgress(track.id)

  return (
    <motion.div {...fadeInUp} className="max-w-3xl mx-auto px-6 py-10">
      <Breadcrumbs items={[
        { label: 'Home', to: '/' },
        { label: track.title },
      ]} />

      {/* Track Hero */}
      <div className="mb-10">
        <span className="text-4xl mb-4 block">{track.icon}</span>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] mb-3">
          {track.title}
        </h1>
        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">{track.description}</p>
        <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
          <span>{track.modules.length} modules</span>
          <span>~{track.estimatedHours} hours</span>
          <span>{progress.done}/{progress.total} completed</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-10">
        <ProgressBar pct={progress.pct} label="Track progress" />
      </div>

      {/* Module List */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-2"
      >
        {track.modules.map((mod, i) => {
          const done = isComplete(mod.id)
          return (
            <motion.div key={mod.id} variants={staggerItem}>
              <Link
                to={`/tracks/${track.id}/modules/${mod.id}`}
                className="group flex items-center gap-4 p-5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-all hover:shadow-sm"
              >
                <div className="shrink-0">
                  {done ? (
                    <CheckCircle2 size={22} className="text-[var(--color-success)]" />
                  ) : (
                    <div className="w-[22px] h-[22px] rounded-full border-2 border-[var(--color-border)] flex items-center justify-center text-[0.65rem] font-bold text-[var(--color-text-muted)] group-hover:border-[var(--color-text-secondary)] transition-colors">
                      {i + 1}
                    </div>
                  )}
                </div>
                <span className="flex-1 text-sm font-medium text-[var(--color-text-primary)] group-hover:translate-x-0.5 transition-transform">
                  {mod.title}
                </span>
                <ArrowRight size={14} className="text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
