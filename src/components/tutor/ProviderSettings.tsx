import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useTutor, getApiKey, setApiKey } from '../../context/TutorContext'
import type { ProviderConfig } from '../../data/types'
import { cn } from '../../lib/utils'

const PROVIDERS: ProviderConfig[] = [
  { id: 'anthropic', name: 'Anthropic', model: 'claude-haiku-4-5', requiresKey: true, placeholder: 'sk-ant-...' },
  { id: 'openai', name: 'OpenAI', model: 'gpt-4o-mini', requiresKey: true, placeholder: 'sk-...' },
  { id: 'gemini', name: 'Google Gemini', model: 'gemini-2.0-flash', requiresKey: true, placeholder: 'AIza...' },
  { id: 'ollama', name: 'Ollama (Local)', model: 'auto-detect', requiresKey: false },
  { id: 'backend', name: 'Backend Default', model: 'from server', requiresKey: false },
]

export function ProviderSettings() {
  const { state, setProvider } = useTutor()
  const currentProvider = PROVIDERS.find(p => p.id === state.provider) || PROVIDERS[0]
  const [key, setKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setKey(getApiKey(state.provider))
    setSaved(false)
  }, [state.provider])

  function handleSaveKey() {
    setApiKey(state.provider, key.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="px-4 py-3 space-y-3">
      {/* Provider Selector */}
      <div>
        <label className="text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5 block">
          AI Provider
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {PROVIDERS.map(p => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-[0.65rem] font-medium transition-all cursor-pointer text-left',
                state.provider === p.id
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)]'
                  : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
              )}
            >
              <div>{p.name}</div>
              <div className={cn(
                'text-[0.55rem]',
                state.provider === p.id ? 'opacity-70' : 'text-[var(--color-text-muted)]'
              )}>
                {p.model}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* API Key Input */}
      {currentProvider.requiresKey && (
        <div>
          <label className="text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5 block">
            API Key
          </label>
          <div className="flex gap-1.5">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={e => { setKey(e.target.value); setSaved(false) }}
                placeholder={currentProvider.placeholder}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-[var(--color-surface-muted)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] pr-8"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] cursor-pointer"
              >
                {showKey ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
            </div>
            <button
              onClick={handleSaveKey}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
                saved
                  ? 'bg-[var(--color-success)] text-white'
                  : 'bg-[var(--color-accent)] text-[var(--color-accent-text)] hover:opacity-90'
              )}
            >
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
          <p className="text-[0.55rem] text-[var(--color-text-muted)] mt-1.5">
            Stored locally in your browser. Never sent to any server except {currentProvider.name}'s API.
          </p>
        </div>
      )}

      {/* Ollama info */}
      {state.provider === 'ollama' && (
        <p className="text-[0.55rem] text-[var(--color-text-muted)]">
          Connects to Ollama at localhost:11434. Make sure Ollama is running with a model pulled (e.g., <code className="bg-[var(--color-surface-muted)] px-1 rounded">ollama pull llama3.2</code>).
        </p>
      )}

      {/* Backend info */}
      {state.provider === 'backend' && (
        <p className="text-[0.55rem] text-[var(--color-text-muted)]">
          Uses the API key configured in the server's .env file. No client-side key needed.
        </p>
      )}
    </div>
  )
}
