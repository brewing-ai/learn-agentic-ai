import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, CheckCircle2, XCircle, Trophy } from 'lucide-react'
import { useCurrentModule } from '../../hooks/useCurrentModule'
import { useTutor } from '../../context/TutorContext'
import { TUTOR_CONTENT } from '../../data/tutor-content'
import { cn } from '../../lib/utils'

export function QuizMode() {
  const { module } = useCurrentModule()
  const { state, answerQuiz, resetQuiz } = useTutor()
  const [selected, setSelected] = useState<number | null>(null)
  const [currentQ, setCurrentQ] = useState(0)

  if (!module) return null

  const content = TUTOR_CONTENT[module.id]
  const questions = content?.conceptChecks

  // Fallback to interviewQuestions if no concept checks
  if (!questions || questions.length === 0) {
    return (
      <div className="p-4">
        <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
          No quizzes available for this module yet. Check the Practice Questions section in the module content.
        </p>
      </div>
    )
  }

  const quizState = state.quizScores[module.id]
  const answered = quizState?.answered || []
  const score = quizState?.score || 0
  const isAnswered = answered.includes(currentQ)
  const q = questions[currentQ]
  const allDone = answered.length === questions.length

  function handleSelect(optionIndex: number) {
    if (isAnswered) return
    setSelected(optionIndex)
    answerQuiz(module!.id, currentQ, optionIndex === q.correctIndex)
  }

  function handleNext() {
    setSelected(null)
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    }
  }

  function handleReset() {
    resetQuiz(module!.id)
    setCurrentQ(0)
    setSelected(null)
  }

  if (allDone) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8"
        >
          <Trophy size={40} className={cn('mx-auto mb-3', pct >= 80 ? 'text-[var(--color-success)]' : 'text-amber-400')} />
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
            {pct >= 80 ? 'Great job!' : pct >= 50 ? 'Good effort!' : 'Keep learning!'}
          </h3>
          <p className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-1">
            {score}/{questions.length}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mb-6">
            {pct}% correct
          </p>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)] transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[0.65rem] font-medium text-[var(--color-text-muted)]">
          Question {currentQ + 1} of {questions.length}
        </span>
        <span className="text-[0.65rem] font-medium text-[var(--color-success)]">
          Score: {score}/{answered.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-[var(--color-surface-muted)] mb-5">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 leading-relaxed">
            {q.question}
          </h3>

          <div className="space-y-2">
            {q.options.map((option, i) => {
              const isCorrect = i === q.correctIndex
              const isSelected = selected === i || (isAnswered && answered.includes(currentQ) && i === q.correctIndex)
              const showResult = isAnswered

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={isAnswered}
                  className={cn(
                    'w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer',
                    'border',
                    showResult && isCorrect
                      ? 'border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-text-primary)]'
                      : showResult && selected === i && !isCorrect
                        ? 'border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[var(--color-text-primary)]'
                        : isSelected
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5 text-[var(--color-text-primary)]'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]',
                    isAnswered && 'cursor-default'
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span className={cn(
                      'inline-flex items-center justify-center w-5 h-5 rounded-full text-[0.6rem] font-bold shrink-0 mt-0.5',
                      showResult && isCorrect ? 'bg-[var(--color-success)] text-white' :
                      showResult && selected === i && !isCorrect ? 'bg-[var(--color-danger)] text-white' :
                      'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]'
                    )}>
                      {showResult && isCorrect ? <CheckCircle2 size={12} /> :
                       showResult && selected === i && !isCorrect ? <XCircle size={12} /> :
                       String.fromCharCode(65 + i)}
                    </span>
                    <span className="leading-relaxed">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-3 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)]"
            >
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {q.explanation}
              </p>
            </motion.div>
          )}

          {/* Next button */}
          {isAnswered && !allDone && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              className="mt-4 w-full py-2 rounded-xl text-xs font-medium bg-[var(--color-accent)] text-[var(--color-accent-text)] hover:opacity-90 transition-opacity cursor-pointer"
            >
              Next Question
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
