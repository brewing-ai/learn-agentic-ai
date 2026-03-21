import { useState } from 'react'
import { motion } from 'framer-motion'
import { INTERVIEW_QUESTIONS } from '../data/interview-questions'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { QuestionCard } from '../components/QuestionCard'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/motion'
import { cn } from '../lib/utils'

const filters = ['All', 'Easy', 'Medium', 'Hard'] as const

export function InterviewPage() {
  const [filter, setFilter] = useState<string>('All')

  const filterQ = <T extends { difficulty: string }>(qs: T[]) =>
    filter === 'All' ? qs : qs.filter(q => q.difficulty === filter)

  const conceptual = filterQ(INTERVIEW_QUESTIONS.conceptual)
  const security = filterQ(INTERVIEW_QUESTIONS.security)
  const systemDesign = filterQ(INTERVIEW_QUESTIONS.systemDesign)

  return (
    <motion.div {...fadeInUp} className="max-w-3xl mx-auto px-6 py-10">
      <Breadcrumbs items={[
        { label: 'Home', to: '/' },
        { label: 'Interview Prep' },
      ]} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] mb-2">
          Interview Prep
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Practice questions across all difficulty levels. Click to reveal answers.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-10">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer',
              filter === f
                ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)]'
                : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Conceptual */}
      {conceptual.length > 0 && (
        <section className="mb-10">
          <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-4">Conceptual</h2>
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
            {conceptual.map((q, i) => (
              <motion.div key={i} variants={staggerItem}>
                <QuestionCard question={q.q} answer={q.a} difficulty={q.difficulty} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Security */}
      {security.length > 0 && (
        <section className="mb-10">
          <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-4">Security & Safety</h2>
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
            {security.map((q, i) => (
              <motion.div key={i} variants={staggerItem}>
                <QuestionCard question={q.q} answer={q.a} difficulty={q.difficulty} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* System Design */}
      {systemDesign.length > 0 && (
        <section className="mb-10">
          <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-4">System Design</h2>
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
            {systemDesign.map((q, i) => (
              <motion.div key={i} variants={staggerItem}>
                <QuestionCard question={q.q} hints={q.hints} difficulty={q.difficulty} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
    </motion.div>
  )
}
