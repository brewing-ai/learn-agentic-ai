import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ArrowLeft, ArrowRight, ExternalLink, Lightbulb, Cpu, Wrench } from 'lucide-react'
import { TRACKS } from '../data/tracks'
import { MODULE_ENRICHMENTS } from '../data/module-enrichments'
import { useProgress } from '../context/ProgressContext'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Prose } from '../components/Prose'
import { QuestionCard } from '../components/QuestionCard'
import { fadeInUp } from '../lib/motion'
import { cn } from '../lib/utils'

const TYPE_LABELS: Record<string, string> = {
  paper: 'Research Paper',
  blog: 'Blog Post',
  article: 'Article',
  docs: 'Documentation',
  video: 'Video',
  course: 'Course',
}

const TYPE_COLORS: Record<string, string> = {
  paper: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  blog: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  article: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  docs: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  video: 'bg-red-500/10 text-red-400 border-red-500/20',
  course: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
}

export function ModulePage() {
  const { trackId, moduleId } = useParams()
  const track = TRACKS.find(t => t.id === trackId)
  const { toggle, isComplete } = useProgress()

  if (!track) return <Navigate to="/" replace />

  const modIndex = track.modules.findIndex(m => m.id === moduleId)
  const mod = track.modules[modIndex]

  if (!mod) return <Navigate to={`/tracks/${track.id}`} replace />

  const done = isComplete(mod.id)
  const prev = modIndex > 0 ? track.modules[modIndex - 1] : null
  const next = modIndex < track.modules.length - 1 ? track.modules[modIndex + 1] : null
  const enrichment = MODULE_ENRICHMENTS[mod.id]

  return (
    <motion.div {...fadeInUp} className="max-w-3xl mx-auto px-6 py-10">
      <Breadcrumbs items={[
        { label: 'Home', to: '/' },
        { label: track.title, to: `/tracks/${track.id}` },
        { label: mod.title },
      ]} />

      {/* Module Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] mb-2">
          {mod.title}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Module {modIndex + 1} of {track.modules.length} · {track.title}
        </p>
      </div>

      {/* Complete Button */}
      <div className="mb-10">
        <button
          onClick={() => toggle(mod.id)}
          className={cn(
            'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer',
            done
              ? 'bg-[var(--color-success)] text-white'
              : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
          )}
        >
          {done && <Check size={16} />}
          {done ? 'Completed' : 'Mark complete'}
        </button>
      </div>

      {/* Content */}
      <Prose content={mod.content} />

      {/* Practical Tips */}
      {enrichment?.practicalTips && enrichment.practicalTips.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Wrench size={14} className="text-amber-400" />
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-amber-400">
              Practical Tips
            </h3>
          </div>
          <div className="space-y-3">
            {enrichment.practicalTips.map((tip, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-amber-500/15 bg-amber-500/5"
              >
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                  {tip.title}
                </h4>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How Claude Uses This */}
      {enrichment?.claudeConnections && enrichment.claudeConnections.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={14} className="text-[#D97706]" />
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#D97706]">
              How This is Used in Building Claude
            </h3>
          </div>
          <div className="space-y-3">
            {enrichment.claudeConnections.map((conn, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-[#D97706]/15 bg-[#D97706]/5"
              >
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">
                  {conn.title}
                </h4>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {conn.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Takeaways */}
      {mod.keyTakeaways.length > 0 && (
        <div className="mt-10 p-6 rounded-2xl border border-[var(--color-success)]/20 bg-[var(--color-success)]/5">
          <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-success)] mb-4">
            Key Takeaways
          </h3>
          <ul className="space-y-2">
            {mod.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                <span className="text-[var(--color-success)] mt-0.5 shrink-0">•</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Groundbreaking Resources */}
      {enrichment?.resources && enrichment.resources.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={14} className="text-[var(--color-text-muted)]" />
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Essential Reading & Resources
            </h3>
          </div>
          <div className="space-y-2.5">
            {enrichment.resources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={cn(
                        'text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                        TYPE_COLORS[res.type] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      )}>
                        {TYPE_LABELS[res.type] || res.type}
                      </span>
                      <span className="text-[0.65rem] text-[var(--color-text-muted)]">
                        {res.author} · {res.year}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors mb-1">
                      {res.title}
                    </h4>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      {res.description}
                    </p>
                  </div>
                  <ExternalLink size={14} className="text-[var(--color-text-muted)] shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Interview Questions */}
      {mod.interviewQuestions.length > 0 && (
        <div className="mt-10">
          <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)] mb-4">
            Practice Questions
          </h3>
          <div className="space-y-3">
            {mod.interviewQuestions.map((q, i) => (
              <QuestionCard key={i} question={q.q} answer={q.a} />
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between gap-4 pt-8 border-t border-[var(--color-border)]">
        {prev ? (
          <Link
            to={`/tracks/${track.id}/modules/${prev.id}`}
            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">{prev.title}</span>
            <span className="sm:hidden">Previous</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link
            to={`/tracks/${track.id}/modules/${next.id}`}
            className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-right"
          >
            <span className="hidden sm:inline">{next.title}</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight size={14} />
          </Link>
        ) : <div />}
      </div>
    </motion.div>
  )
}
