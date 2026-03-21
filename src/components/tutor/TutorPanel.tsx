import { motion } from 'framer-motion'
import { X, Settings, Brain, BookOpen, MessageCircle } from 'lucide-react'
import { useTutor } from '../../context/TutorContext'
import { useCurrentModule } from '../../hooks/useCurrentModule'
import { QuizMode } from './QuizMode'
import { ExplainMode } from './ExplainMode'
import { ChatMode } from './ChatMode'
import { ProviderSettings } from './ProviderSettings'
import { cn } from '../../lib/utils'

const tabs = [
  { id: 'quiz' as const, label: 'Quiz', icon: Brain },
  { id: 'explain' as const, label: 'Explain', icon: BookOpen },
  { id: 'chat' as const, label: 'Chat', icon: MessageCircle },
]

export function TutorPanel() {
  const { state, setOpen, setTab, toggleSettings } = useTutor()
  const { module, isModulePage } = useCurrentModule()

  return (
    <>
      {/* Backdrop (mobile) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm lg:hidden"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed right-0 top-0 bottom-0 z-[60] flex flex-col',
          'w-full sm:w-[400px]',
          'bg-[var(--color-surface)]/95 backdrop-blur-xl',
          'border-l border-[var(--color-border)]',
          'shadow-2xl'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
              AI Tutor
            </h2>
            {isModulePage && module && (
              <p className="text-[0.65rem] text-[var(--color-text-muted)] truncate">
                {module.title}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleSettings}
              className={cn(
                'p-1.5 rounded-lg transition-colors cursor-pointer',
                state.showSettings
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]'
              )}
              aria-label="Settings"
            >
              <Settings size={14} />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
              aria-label="Close tutor"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {state.showSettings && (
          <div className="border-b border-[var(--color-border)]">
            <ProviderSettings />
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-[var(--color-border)]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors cursor-pointer',
                state.activeTab === tab.id
                  ? 'text-[var(--color-text-primary)] border-b-2 border-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!isModulePage ? (
            <div className="flex items-center justify-center h-full p-6">
              <div className="text-center">
                <Brain size={32} className="mx-auto mb-3 text-[var(--color-text-muted)]" />
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">Navigate to a module</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  The tutor provides context-aware quizzes, explanations, and chat for each module.
                </p>
              </div>
            </div>
          ) : (
            <>
              {state.activeTab === 'quiz' && <QuizMode />}
              {state.activeTab === 'explain' && <ExplainMode />}
              {state.activeTab === 'chat' && <ChatMode />}
            </>
          )}
        </div>
      </motion.div>
    </>
  )
}
