import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Trash2, Sparkles } from 'lucide-react'
import { useCurrentModule } from '../../hooks/useCurrentModule'
import { useTutor, getApiKey } from '../../context/TutorContext'
import { TUTOR_CONTENT } from '../../data/tutor-content'
import { sendTutorMessage } from '../../lib/tutor-api'
import { ChatMessage } from './ChatMessage'
import type { ChatMessage as ChatMessageType } from '../../data/types'
import { cn } from '../../lib/utils'

export function ChatMode() {
  const { module, enrichment } = useCurrentModule()
  const { state, addMessage, updateLastMessage, clearChat } = useTutor()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  if (!module) return null

  const messages = state.chatHistories[module.id] || []
  const content = TUTOR_CONTENT[module.id]
  const suggestedQuestions = content?.suggestedQuestions || []

  const apiKey = getApiKey(state.provider)
  const needsKey = ['anthropic', 'openai', 'gemini'].includes(state.provider) && !apiKey

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(text?: string) {
    const msg = (text || input).trim()
    if (!msg || loading) return

    setInput('')
    setError(null)

    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content: msg,
      timestamp: Date.now(),
    }
    addMessage(module!.id, userMessage)

    const assistantMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }
    addMessage(module!.id, assistantMessage)

    setLoading(true)
    try {
      const context = {
        title: module!.title,
        takeaways: module!.keyTakeaways,
        resourceTitles: enrichment?.resources.map(r => `${r.title} (${r.author}, ${r.year})`) || [],
      }

      const allMessages = [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))

      await sendTutorMessage(
        state.provider,
        allMessages,
        context,
        apiKey,
        (text) => updateLastMessage(module!.id, text),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response')
      updateLastMessage(module!.id, 'Sorry, I encountered an error. Please check your API key and try again.')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* API Key Warning */}
      {needsKey && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400 mb-1.5 font-medium">API key required</p>
          <p className="text-[0.65rem] text-[var(--color-text-muted)]">
            Click the <strong>settings gear</strong> above to add your {state.provider} API key. Or switch to <strong>Ollama</strong> (free, local) or <strong>Backend</strong> (server key).
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="py-6">
            <div className="text-center mb-4">
              <Sparkles size={20} className="mx-auto mb-2 text-[var(--color-text-muted)]" />
              <p className="text-xs text-[var(--color-text-muted)]">
                Ask anything about <strong>{module.title}</strong>
              </p>
            </div>

            {/* Suggested questions */}
            {suggestedQuestions.length > 0 && (
              <div className="space-y-1.5">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    disabled={loading || needsKey}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-xl text-xs transition-colors',
                      'border border-[var(--color-border)] text-[var(--color-text-secondary)]',
                      needsKey
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:border-[var(--color-text-muted)] cursor-pointer'
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {loading && messages[messages.length - 1]?.content === '' && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <Loader2 size={12} className="animate-spin" />
                Thinking...
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-2 p-2 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20">
          <p className="text-[0.65rem] text-[var(--color-danger)]">{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-[var(--color-border)]">
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={() => clearChat(module.id)}
              className="flex items-center gap-1 text-[0.6rem] text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors cursor-pointer"
            >
              <Trash2 size={10} />
              Clear chat
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={needsKey ? 'Add API key in settings...' : 'Ask a question...'}
            disabled={needsKey || loading}
            className={cn(
              'flex-1 px-3 py-2 rounded-xl text-xs',
              'bg-[var(--color-surface-muted)] border border-[var(--color-border)]',
              'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
              'focus:outline-none focus:border-[var(--color-accent)]',
              (needsKey || loading) && 'opacity-50 cursor-not-allowed'
            )}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading || needsKey}
            className={cn(
              'p-2 rounded-xl transition-all cursor-pointer',
              'bg-[var(--color-accent)] text-[var(--color-accent-text)]',
              (!input.trim() || loading || needsKey) && 'opacity-30 cursor-not-allowed'
            )}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}
