import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { ProviderId, ChatMessage } from '../data/types'

interface TutorState {
  isOpen: boolean
  activeTab: 'quiz' | 'explain' | 'chat'
  provider: ProviderId
  showSettings: boolean
  chatHistories: Record<string, ChatMessage[]>
  quizScores: Record<string, { answered: number[]; score: number }>
}

type Action =
  | { type: 'TOGGLE_OPEN' }
  | { type: 'SET_OPEN'; open: boolean }
  | { type: 'SET_TAB'; tab: TutorState['activeTab'] }
  | { type: 'SET_PROVIDER'; provider: ProviderId }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'ADD_MESSAGE'; moduleId: string; message: ChatMessage }
  | { type: 'UPDATE_LAST_MESSAGE'; moduleId: string; content: string }
  | { type: 'CLEAR_CHAT'; moduleId: string }
  | { type: 'ANSWER_QUIZ'; moduleId: string; questionIndex: number; correct: boolean }
  | { type: 'RESET_QUIZ'; moduleId: string }

function reducer(state: TutorState, action: Action): TutorState {
  switch (action.type) {
    case 'TOGGLE_OPEN':
      return { ...state, isOpen: !state.isOpen, showSettings: false }
    case 'SET_OPEN':
      return { ...state, isOpen: action.open, showSettings: false }
    case 'SET_TAB':
      return { ...state, activeTab: action.tab }
    case 'SET_PROVIDER':
      localStorage.setItem('tutor-provider', action.provider)
      return { ...state, provider: action.provider }
    case 'TOGGLE_SETTINGS':
      return { ...state, showSettings: !state.showSettings }
    case 'ADD_MESSAGE': {
      const history = state.chatHistories[action.moduleId] || []
      const updated = [...history, action.message]
      return { ...state, chatHistories: { ...state.chatHistories, [action.moduleId]: updated } }
    }
    case 'UPDATE_LAST_MESSAGE': {
      const history = state.chatHistories[action.moduleId] || []
      if (history.length === 0) return state
      const last = { ...history[history.length - 1], content: action.content }
      return { ...state, chatHistories: { ...state.chatHistories, [action.moduleId]: [...history.slice(0, -1), last] } }
    }
    case 'CLEAR_CHAT':
      return { ...state, chatHistories: { ...state.chatHistories, [action.moduleId]: [] } }
    case 'ANSWER_QUIZ': {
      const prev = state.quizScores[action.moduleId] || { answered: [], score: 0 }
      if (prev.answered.includes(action.questionIndex)) return state
      const scores = {
        ...state.quizScores,
        [action.moduleId]: {
          answered: [...prev.answered, action.questionIndex],
          score: prev.score + (action.correct ? 1 : 0),
        },
      }
      localStorage.setItem('tutor-quiz', JSON.stringify(scores))
      return { ...state, quizScores: scores }
    }
    case 'RESET_QUIZ': {
      const scores = { ...state.quizScores }
      delete scores[action.moduleId]
      localStorage.setItem('tutor-quiz', JSON.stringify(scores))
      return { ...state, quizScores: scores }
    }
    default:
      return state
  }
}

function getInitial(): TutorState {
  try {
    const provider = (localStorage.getItem('tutor-provider') as ProviderId) || 'anthropic'
    const quizScores = JSON.parse(localStorage.getItem('tutor-quiz') || '{}')
    return { isOpen: false, activeTab: 'quiz', provider, showSettings: false, chatHistories: {}, quizScores }
  } catch {
    return { isOpen: false, activeTab: 'quiz', provider: 'anthropic', showSettings: false, chatHistories: {}, quizScores: {} }
  }
}

// API key management (separate from state to avoid re-renders)
export function getApiKey(provider: ProviderId): string {
  return localStorage.getItem(`tutor-key-${provider}`) || ''
}

export function setApiKey(provider: ProviderId, key: string) {
  if (key) localStorage.setItem(`tutor-key-${provider}`, key)
  else localStorage.removeItem(`tutor-key-${provider}`)
}

interface TutorContextValue {
  state: TutorState
  toggleOpen: () => void
  setOpen: (open: boolean) => void
  setTab: (tab: TutorState['activeTab']) => void
  setProvider: (provider: ProviderId) => void
  toggleSettings: () => void
  addMessage: (moduleId: string, message: ChatMessage) => void
  updateLastMessage: (moduleId: string, content: string) => void
  clearChat: (moduleId: string) => void
  answerQuiz: (moduleId: string, questionIndex: number, correct: boolean) => void
  resetQuiz: (moduleId: string) => void
}

const Ctx = createContext<TutorContextValue | null>(null)

export function TutorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitial)

  const value: TutorContextValue = {
    state,
    toggleOpen: useCallback(() => dispatch({ type: 'TOGGLE_OPEN' }), []),
    setOpen: useCallback((open: boolean) => dispatch({ type: 'SET_OPEN', open }), []),
    setTab: useCallback((tab: TutorState['activeTab']) => dispatch({ type: 'SET_TAB', tab }), []),
    setProvider: useCallback((provider: ProviderId) => dispatch({ type: 'SET_PROVIDER', provider }), []),
    toggleSettings: useCallback(() => dispatch({ type: 'TOGGLE_SETTINGS' }), []),
    addMessage: useCallback((moduleId: string, message: ChatMessage) => dispatch({ type: 'ADD_MESSAGE', moduleId, message }), []),
    updateLastMessage: useCallback((moduleId: string, content: string) => dispatch({ type: 'UPDATE_LAST_MESSAGE', moduleId, content }), []),
    clearChat: useCallback((moduleId: string) => dispatch({ type: 'CLEAR_CHAT', moduleId }), []),
    answerQuiz: useCallback((moduleId: string, questionIndex: number, correct: boolean) => dispatch({ type: 'ANSWER_QUIZ', moduleId, questionIndex, correct }), []),
    resetQuiz: useCallback((moduleId: string) => dispatch({ type: 'RESET_QUIZ', moduleId }), []),
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTutor() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTutor must be within TutorProvider')
  return ctx
}
