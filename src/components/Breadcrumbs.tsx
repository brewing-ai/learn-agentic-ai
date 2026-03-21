import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm mb-8 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={14} className="text-[var(--color-text-muted)]" />}
          {item.to ? (
            <Link to={item.to} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--color-text-secondary)] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
