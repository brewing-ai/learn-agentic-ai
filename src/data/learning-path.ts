import type { LearningPhase } from "./types"

export const LEARNING_PATH: LearningPhase[] = [
  {
    phase: "Phase 1: Bridge the Gap",
    duration: "Week 1-2",
    description: "Build on your RAG and GenAI knowledge to understand reasoning models and tool use.",
    tracks: ["reasoning-models", "tool-use"],
    milestone: "Can explain reasoning models, implement function calling with both OpenAI and Anthropic APIs"
  },
  {
    phase: "Phase 2: Agent Foundations",
    duration: "Week 3-4",
    description: "Master the core concepts of AI agents — the agent loop, memory, planning, and reflection.",
    tracks: ["agent-fundamentals"],
    milestone: "Can build a basic agent from scratch using raw API calls"
  },
  {
    phase: "Phase 3: Patterns & Frameworks",
    duration: "Week 5-7",
    description: "Learn agentic design patterns and popular frameworks. Build your toolkit.",
    tracks: ["agentic-patterns", "agent-frameworks"],
    milestone: "Can design multi-agent systems and implement them with LangGraph/CrewAI"
  },
  {
    phase: "Phase 4: Advanced & Specialized",
    duration: "Week 8-9",
    description: "Evolve your RAG skills into agentic RAG and master multi-agent architectures.",
    tracks: ["agentic-rag", "multi-agent"],
    milestone: "Can build self-correcting RAG systems and multi-agent architectures"
  },
  {
    phase: "Phase 5: Security & Safety",
    duration: "Week 10-12",
    description: "Master LLM security, red teaming, jailbreaking defenses, guardrails, and secure AI architecture.",
    tracks: ["llm-security", "guardrails", "secure-ai-systems"],
    milestone: "Can red-team LLM systems, build guardrail pipelines, design secure AI architectures"
  },
  {
    phase: "Phase 6: Production & Interviews",
    duration: "Week 13-15",
    description: "Learn production deployment and ace your interviews with system design practice.",
    tracks: ["production", "system-design"],
    milestone: "Can design and deploy production agentic systems, pass system design interviews"
  },
  {
    phase: "Phase 7: Build & Demonstrate",
    duration: "Week 16-20",
    description: "Build capstone projects that demonstrate your skills to employers.",
    tracks: ["projects"],
    milestone: "Portfolio of 2-3 agentic system projects with documentation"
  }
];
