import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { TRACKS } from '../data/tracks'

interface Result {
  type: 'track' | 'module' | 'page'
  title: string
  subtitle?: string
  path: string
  icon: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const results = useMemo(() => {
    const items: Result[] = [
      { type: 'page', title: 'Home', path: '/', icon: '🏠' },
      { type: 'page', title: 'Interview Prep', path: '/interview', icon: '💬' },
    ]
    TRACKS.forEach(t => {
      items.push({ type: 'track', title: t.title, subtitle: `${t.modules.length} modules · ${t.estimatedHours}h`, path: `/tracks/${t.id}`, icon: t.icon })
      t.modules.forEach(m => {
        items.push({ type: 'module', title: m.title, subtitle: t.title, path: `/tracks/${t.id}/modules/${m.id}`, icon: '📄' })
      })
    })
    if (!query) return items.slice(0, 8)
    const q = query.toLowerCase()
    return items.filter(i => i.title.toLowerCase().includes(q) || i.subtitle?.toLowerCase().includes(q)).slice(0, 10)
  }, [query])

  useEffect(() => { setSelectedIndex(0) }, [query])

  const go = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && results[selectedIndex]) { go(results[selectedIndex].path) }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[101] top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl"
          >
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border)]">
                <Search size={18} className="text-[var(--color-text-muted)] shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search tracks, modules, pages..."
                  className="flex-1 bg-transparent text-[var(--color-text-primary)] text-sm outline-none placeholder:text-[var(--color-text-muted)]"
                />
                <kbd className="hidden sm:inline-flex text-[0.65rem] font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-muted)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
                  ESC
                </kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {results.length === 0 ? (
                  <div className="text-center py-8 text-sm text-[var(--color-text-muted)]">No results found</div>
                ) : (
                  results.map((r, i) => (
                    <button
                      key={r.path}
                      onClick={() => go(r.path)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                        i === selectedIndex ? 'bg-[var(--color-accent-soft)]' : ''
                      }`}
                    >
                      <span className="text-lg shrink-0">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{r.title}</p>
                        {r.subtitle && <p className="text-xs text-[var(--color-text-muted)] truncate">{r.subtitle}</p>}
                      </div>
                      <span className="text-[0.6rem] font-medium text-[var(--color-text-muted)] uppercase tracking-wider shrink-0">{r.type}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
