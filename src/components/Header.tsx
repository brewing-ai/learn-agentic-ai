import { Moon, Sun, Menu, Command } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  title: string
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onToggleSidebar: () => void
}

export function Header({ title, theme, onToggleTheme, onToggleSidebar }: Props) {
  return (
    <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]/80 backdrop-blur-xl">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
      >
        <Menu size={18} />
      </button>

      <span className="text-sm font-medium text-[var(--color-text-secondary)] truncate max-w-[50%] mx-auto lg:mx-0">
        {title}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
            window.dispatchEvent(event)
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer border border-[var(--color-border)]"
        >
          <Command size={12} />
          <span>K</span>
        </button>
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </motion.div>
        </button>
      </div>
    </header>
  )
}
