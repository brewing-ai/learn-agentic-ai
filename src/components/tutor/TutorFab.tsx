import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { useTutor } from '../../context/TutorContext'
import { useCurrentModule } from '../../hooks/useCurrentModule'
import { cn } from '../../lib/utils'

export function TutorFab() {
  const { state, toggleOpen } = useTutor()
  const { isModulePage } = useCurrentModule()

  if (state.isOpen) return null

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      onClick={toggleOpen}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center justify-center',
        'w-12 h-12 rounded-full shadow-lg cursor-pointer',
        'bg-[var(--color-accent)] text-[var(--color-accent-text)]',
        'hover:scale-110 active:scale-95 transition-transform'
      )}
      aria-label="Open AI Tutor"
    >
      <Bot size={20} />
      {isModulePage && (
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--color-success)] border-2 border-[var(--color-surface)]">
          <span className="absolute inset-0 rounded-full bg-[var(--color-success)] animate-ping opacity-75" />
        </span>
      )}
    </motion.button>
  )
}
