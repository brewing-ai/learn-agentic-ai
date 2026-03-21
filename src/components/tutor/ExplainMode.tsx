import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Baby, Microscope, AlertTriangle, Hammer, ExternalLink, ChevronDown } from 'lucide-react'
import { useCurrentModule } from '../../hooks/useCurrentModule'
import { TUTOR_CONTENT } from '../../data/tutor-content'
import { cn } from '../../lib/utils'

interface SectionProps {
  icon: React.ElementType
  title: string
  color: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function Section({ icon: Icon, title, color, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full flex items-center gap-2 px-3.5 py-2.5 text-left transition-colors cursor-pointer',
          'hover:bg-[var(--color-surface-muted)]'
        )}
      >
        <Icon size={14} className={color} />
        <span className="text-xs font-semibold text-[var(--color-text-primary)] flex-1">{title}</span>
        <ChevronDown
          size={12}
          className={cn('text-[var(--color-text-muted)] transition-transform', open && 'rotate-180')}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <div className="px-3.5 pb-3.5 pt-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ExplainMode() {
  const { module, enrichment } = useCurrentModule()

  if (!module) return null

  const content = TUTOR_CONTENT[module.id]

  if (!content) {
    return (
      <div className="p-4">
        <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
          No explanations available for this module yet.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-2.5">
      {/* ELI5 */}
      {content.eli5 && (
        <Section icon={Baby} title="Explain Like I'm 5" color="text-pink-400" defaultOpen={true}>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {content.eli5}
          </p>
        </Section>
      )}

      {/* Deep Dive */}
      {content.deepDive && (
        <Section icon={Microscope} title="Technical Deep Dive" color="text-blue-400">
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {content.deepDive}
          </p>
        </Section>
      )}

      {/* Common Misconceptions */}
      {content.commonMisconceptions.length > 0 && (
        <Section icon={AlertTriangle} title="Common Misconceptions" color="text-amber-400">
          <div className="space-y-3">
            {content.commonMisconceptions.map((m, i) => (
              <div key={i}>
                <p className="text-xs font-medium text-[var(--color-danger)] mb-0.5">
                  {m.misconception}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {m.correction}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Build Scenario */}
      {content.buildScenario && (
        <Section icon={Hammer} title="Real-World Scenario" color="text-emerald-400">
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {content.buildScenario}
          </p>
        </Section>
      )}

      {/* Resources */}
      {enrichment?.resources && enrichment.resources.length > 0 && (
        <Section icon={ExternalLink} title={`Key Resources (${enrichment.resources.length})`} color="text-purple-400">
          <div className="space-y-2">
            {enrichment.resources.slice(0, 5).map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
              >
                <span className="font-medium">{r.title}</span>
                <span className="text-[var(--color-text-muted)]"> — {r.author}, {r.year}</span>
              </a>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
