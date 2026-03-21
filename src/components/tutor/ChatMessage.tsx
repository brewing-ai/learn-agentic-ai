import { Bot, User } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '../../data/types'
import { cn } from '../../lib/utils'

interface Props {
  message: ChatMessageType
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-2.5', isUser && 'flex-row-reverse')}>
      <div className={cn(
        'shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5',
        isUser
          ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)]'
          : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]'
      )}>
        {isUser ? <User size={12} /> : <Bot size={12} />}
      </div>
      <div className={cn(
        'max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed',
        isUser
          ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)] rounded-br-md'
          : 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] rounded-bl-md'
      )}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 pt-2 border-t border-[var(--color-border)]/30">
            <p className="text-[0.6rem] font-medium opacity-70 mb-0.5">Sources:</p>
            {message.citations.map((c, i) => (
              <p key={i} className="text-[0.6rem] opacity-60">{c}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
