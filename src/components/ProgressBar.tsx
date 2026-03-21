import { motion } from 'framer-motion'

interface Props {
  pct: number
  label?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
}

export function ProgressBar({ pct, label, showLabel = true, size = 'sm' }: Props) {
  return (
    <div>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-[var(--color-text-muted)]">{label || 'Progress'}</span>
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">{pct}%</span>
        </div>
      )}
      <div className={`w-full bg-[var(--color-surface-muted)] rounded-full overflow-hidden ${size === 'sm' ? 'h-1' : 'h-1.5'}`}>
        <motion.div
          className="h-full rounded-full bg-[var(--color-success)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
        />
      </div>
    </div>
  )
}
