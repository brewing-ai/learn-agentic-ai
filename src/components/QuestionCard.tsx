import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Lightbulb } from 'lucide-react'
import { cn } from '../lib/utils'

const diffColors = {
  Easy: 'bg-emerald-500/10 text-emerald-600',
  Medium: 'bg-amber-500/10 text-amber-600',
  Hard: 'bg-red-500/10 text-red-600',
}

interface Props {
  question: string
  answer?: string
  hints?: string[]
  difficulty?: 'Easy' | 'Medium' | 'Hard'
}

export function QuestionCard({ question, answer, hints, difficulty }: Props) {
  const [open, setOpen] = useState(false)
  const [showHints, setShowHints] = useState(false)

  return (
    <div
      className={cn(
        'border border-[var(--color-border)] rounded-xl transition-all duration-200',
        open ? 'bg-[var(--color-surface-subtle)]' : 'hover:border-[var(--color-text-muted)]'
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 flex items-start gap-3 cursor-pointer"
      >
        <div className="flex-1">
          <p className="font-medium text-[var(--color-text-primary)] text-[0.92rem] leading-relaxed">{question}</p>
          {difficulty && (
            <span className={cn('inline-block mt-2 text-[0.65rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full', diffColors[difficulty])}>
              {difficulty}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[var(--color-text-muted)] mt-1 shrink-0"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-[var(--color-border-subtle)] pt-4">
              {answer && (
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{answer}</p>
              )}
              {hints && hints.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowHints(!showHints) }}
                    className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer"
                  >
                    <Lightbulb size={14} />
                    {showHints ? 'Hide hints' : 'Reveal hints'}
                  </button>
                  <AnimatePresence>
                    {showHints && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-3 space-y-2 overflow-hidden"
                      >
                        {hints.map((hint, i) => (
                          <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                            <span className="text-[var(--color-warning)] mt-0.5">•</span>
                            {hint}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
