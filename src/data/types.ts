export interface Resource {
  title: string
  url: string
  type: 'paper' | 'blog' | 'article' | 'docs' | 'video' | 'course'
  author: string
  year: number
  description: string
}

export interface ClaudeConnection {
  title: string
  description: string
}

export interface PracticalTip {
  title: string
  description: string
}

export interface ModuleEnrichment {
  resources: Resource[]
  claudeConnections: ClaudeConnection[]
  practicalTips: PracticalTip[]
}

export interface Module {
  id: string
  title: string
  content: string
  keyTakeaways: string[]
  interviewQuestions: { q: string; a: string }[]
}

export interface Track {
  id: string
  title: string
  icon: string
  description: string
  prerequisite: string
  estimatedHours: number
  modules: Module[]
}

export interface ConceptualQuestion {
  q: string
  a: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topic: string
}

export interface SystemDesignQuestion {
  q: string
  hints: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topic: string
}

export interface InterviewQuestions {
  conceptual: ConceptualQuestion[]
  security: ConceptualQuestion[]
  systemDesign: SystemDesignQuestion[]
}

export interface LearningPhase {
  phase: string
  duration: string
  description: string
  tracks: string[]
  milestone: string
}

// ─── Tutor Bot Types ───────────────────────────────────────

export interface ConceptCheck {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Misconception {
  misconception: string
  correction: string
}

export interface TutorModuleContent {
  conceptChecks: ConceptCheck[]
  eli5: string
  deepDive: string
  commonMisconceptions: Misconception[]
  buildScenario: string
  suggestedQuestions: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  citations?: string[]
}

export type ProviderId = 'anthropic' | 'openai' | 'gemini' | 'ollama' | 'backend'

export interface ProviderConfig {
  id: ProviderId
  name: string
  model: string
  requiresKey: boolean
  placeholder?: string
}
