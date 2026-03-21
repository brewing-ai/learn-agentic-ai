import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, BookOpen, MessageSquare, Layers } from 'lucide-react'
import { TRACKS } from '../data/tracks'
import { INTERVIEW_QUESTIONS } from '../data/interview-questions'
import { LEARNING_PATH } from '../data/learning-path'
import { useProgress } from '../context/ProgressContext'
import { ProgressBar } from '../components/ProgressBar'
import { staggerContainer, staggerItem, fadeInUp } from '../lib/motion'

const totalModules = TRACKS.reduce((s, t) => s + t.modules.length, 0)
const totalHours = TRACKS.reduce((s, t) => s + t.estimatedHours, 0)
const totalQuestions = INTERVIEW_QUESTIONS.conceptual.length + INTERVIEW_QUESTIONS.security.length + INTERVIEW_QUESTIONS.systemDesign.length

const stats = [
  { label: 'TRACKS', value: TRACKS.length, icon: Layers },
  { label: 'MODULES', value: totalModules, icon: BookOpen },
  { label: 'QUESTIONS', value: `${totalQuestions}+`, icon: MessageSquare },
  { label: 'HOURS', value: totalHours, icon: Clock },
]

export function HomePage() {
  const { overallProgress, trackProgress } = useProgress()
  const progress = overallProgress()

  return (
    <motion.div {...fadeInUp} className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
      {/* Hero */}
      <div className="mb-16">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-4">
          For Data Scientists & ML Engineers
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.04em] text-[var(--color-text-primary)] leading-[1.1] mb-5">
          Master Agentic<br />AI Systems.
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
          A structured path from RAG & GenAI to production-grade agents, security, and acing AI engineering interviews.
        </p>
      </div>

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
      >
        {stats.map(s => (
          <motion.div
            key={s.label}
            variants={staggerItem}
            className="border border-[var(--color-border)] rounded-2xl p-5 text-center"
          >
            <div className="text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">{s.value}</div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)] mt-1">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Overall Progress */}
      <div className="mb-16">
        <ProgressBar pct={progress.pct} label="Overall progress" />
      </div>

      {/* Track Grid */}
      <div className="mb-16">
        <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-6">
          All Tracks
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {TRACKS.map(track => {
            const tp = trackProgress(track.id)
            return (
              <motion.div key={track.id} variants={staggerItem}>
                <Link
                  to={`/tracks/${track.id}`}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-all hover:shadow-sm"
                >
                  <span className="text-2xl shrink-0">{track.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate group-hover:translate-x-0.5 transition-transform">{track.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{track.modules.length} modules · {track.estimatedHours}h</p>
                  </div>
                  {tp.pct > 0 && (
                    <span className="text-[0.6rem] font-semibold text-[var(--color-success)]">{tp.pct}%</span>
                  )}
                  <ArrowRight size={14} className="text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Learning Roadmap */}
      <div>
        <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-6">
          Learning Roadmap
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-4"
        >
          {LEARNING_PATH.map((phase, i) => (
            <motion.div key={i} variants={staggerItem}>
              <Link
                to={`/tracks/${phase.tracks[0]}`}
                className="group block p-6 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-all hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] flex items-center justify-center text-sm font-bold text-[var(--color-text-muted)] shrink-0 group-hover:border-[var(--color-text-secondary)] transition-colors">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-1">
                      <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                        {phase.phase.replace(/Phase \d+: /, '')}
                      </h3>
                      <span className="text-xs text-[var(--color-text-muted)] font-medium">{phase.duration}</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2">{phase.description}</p>
                    <p className="text-xs text-[var(--color-success)] font-medium">{phase.milestone}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
