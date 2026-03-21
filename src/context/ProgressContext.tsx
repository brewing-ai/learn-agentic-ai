import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import { TRACKS } from '../data/tracks'

interface ProgressState {
  completed: string[]
}

type Action = { type: 'TOGGLE'; id: string } | { type: 'RESET' }

function reducer(state: ProgressState, action: Action): ProgressState {
  switch (action.type) {
    case 'TOGGLE': {
      const next = state.completed.includes(action.id)
        ? state.completed.filter(c => c !== action.id)
        : [...state.completed, action.id]
      localStorage.setItem('done', JSON.stringify(next))
      return { completed: next }
    }
    case 'RESET':
      localStorage.removeItem('done')
      return { completed: [] }
    default:
      return state
  }
}

function getInitial(): ProgressState {
  try {
    const saved = localStorage.getItem('done')
    return { completed: saved ? JSON.parse(saved) : [] }
  } catch {
    return { completed: [] }
  }
}

const totalModules = TRACKS.reduce((sum, t) => sum + t.modules.length, 0)

interface ProgressContextValue {
  completed: string[]
  toggle: (id: string) => void
  isComplete: (id: string) => boolean
  trackProgress: (trackId: string) => { done: number; total: number; pct: number }
  overallProgress: () => { done: number; total: number; pct: number }
}

const Ctx = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitial)

  const toggle = useCallback((id: string) => dispatch({ type: 'TOGGLE', id }), [])
  const isComplete = useCallback((id: string) => state.completed.includes(id), [state.completed])

  const trackProgress = useCallback((trackId: string) => {
    const track = TRACKS.find(t => t.id === trackId)
    if (!track) return { done: 0, total: 0, pct: 0 }
    const done = track.modules.filter(m => state.completed.includes(m.id)).length
    return { done, total: track.modules.length, pct: track.modules.length ? Math.round((done / track.modules.length) * 100) : 0 }
  }, [state.completed])

  const overallProgress = useCallback(() => {
    const done = state.completed.length
    return { done, total: totalModules, pct: totalModules ? Math.round((done / totalModules) * 100) : 0 }
  }, [state.completed])

  return (
    <Ctx.Provider value={{ completed: state.completed, toggle, isComplete, trackProgress, overallProgress }}>
      {children}
    </Ctx.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProgress must be within ProgressProvider')
  return ctx
}
