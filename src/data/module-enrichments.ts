import type { ModuleEnrichment } from "./types"

export const MODULE_ENRICHMENTS: Record<string, ModuleEnrichment> = {
  // ─── REASONING MODELS ────────────────────────────────────────
  "rm-1": {
    resources: [
      {
        title: "Scaling LLM Test-Time Compute Optimally Can Be More Effective Than Scaling Model Parameters",
        url: "https://arxiv.org/abs/2408.03314",
        type: "paper",
        author: "Snell et al.",
        year: 2024,
        description: "Proves that letting models 'think longer' at inference time (test-time compute) can outperform simply making models bigger. This is the theoretical backbone of reasoning models."
      },
      {
        title: "Let's Verify Step by Step",
        url: "https://arxiv.org/abs/2305.20050",
        type: "paper",
        author: "Lightman et al. (OpenAI)",
        year: 2023,
        description: "Introduces process reward models (PRMs) that verify each reasoning step, not just the final answer. Critical for training reasoning models to self-correct."
      },
      {
        title: "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
        url: "https://arxiv.org/abs/2501.12948",
        type: "paper",
        author: "DeepSeek AI",
        year: 2025,
        description: "Open-source reasoning model that achieved o1-level performance using RL. Shows how reasoning emerges from reward signals rather than explicit supervision."
      },
      {
        title: "The Bitter Lesson",
        url: "http://www.incompleteideas.net/IncsightIdea/BitterLesson.html",
        type: "blog",
        author: "Rich Sutton",
        year: 2019,
        description: "Foundational essay arguing that scaling compute beats hand-engineered solutions. Reasoning models are the latest vindication of this principle."
      },
      {
        title: "Thinking Claude - Extended Thinking Guide",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Official Anthropic documentation on Extended Thinking. Shows how to use budget_tokens to control thinking depth."
      }
    ],
    claudeConnections: [
      {
        title: "Extended Thinking in Claude",
        description: "Claude's Extended Thinking feature is a direct implementation of test-time compute scaling. When you set budget_tokens, you're allocating how much 'thinking' Claude does before responding. Internally, Claude uses this to decompose problems, consider multiple approaches, and self-verify -- the exact process described in the Snell et al. paper."
      },
      {
        title: "Claude's Constitutional AI and Reasoning",
        description: "Claude's safety training (Constitutional AI) relies heavily on reasoning capabilities. The model must reason about whether a response violates its principles, which is fundamentally a chain-of-thought process. Better reasoning = better safety alignment."
      },
      {
        title: "Claude Code's Agent Loop",
        description: "Claude Code uses reasoning models (Claude with Extended Thinking) for complex tasks like multi-file refactoring and debugging. The agent loop decides WHEN to enable extended thinking based on task complexity -- exactly the cost-performance tradeoff discussed in this module."
      }
    ],
    practicalTips: [
      {
        title: "Start with standard models, upgrade selectively",
        description: "Don't default to reasoning models for everything. Profile your tasks: if accuracy on a task is below 80% with a standard model, try a reasoning model. Often a well-crafted prompt with a standard model beats a lazy prompt with a reasoning model."
      },
      {
        title: "Use budget_tokens strategically",
        description: "For Claude Extended Thinking, start with budget_tokens=4000 and increase only if quality is insufficient. Each doubling roughly doubles cost. Most tasks plateau in quality around 8000-10000 thinking tokens."
      },
      {
        title: "Build a reasoning model router",
        description: "In production, use a lightweight classifier (or even regex rules) to route simple queries to fast models and complex queries to reasoning models. This can cut costs by 60-80% with minimal quality loss."
      }
    ]
  },

  "rm-2": {
    resources: [
      {
        title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
        url: "https://arxiv.org/abs/2201.11903",
        type: "paper",
        author: "Wei et al. (Google Brain)",
        year: 2022,
        description: "The foundational CoT paper. Showed that simply adding 'Let's think step by step' dramatically improves LLM reasoning. One of the most cited papers in modern AI."
      },
      {
        title: "Tree of Thoughts: Deliberate Problem Solving with Large Language Models",
        url: "https://arxiv.org/abs/2305.10601",
        type: "paper",
        author: "Yao et al.",
        year: 2023,
        description: "Extends CoT to explore multiple reasoning paths simultaneously (like BFS/DFS over thoughts). Key pattern for agent planning."
      },
      {
        title: "ReAct: Synergizing Reasoning and Acting in Language Models",
        url: "https://arxiv.org/abs/2210.03629",
        type: "paper",
        author: "Yao et al.",
        year: 2022,
        description: "THE foundational paper for AI agents. Introduced the Think-Act-Observe loop that powers virtually every production agent system today."
      },
      {
        title: "Large Language Models are Zero-Shot Reasoners",
        url: "https://arxiv.org/abs/2205.11916",
        type: "paper",
        author: "Kojima et al.",
        year: 2022,
        description: "Discovered that 'Let's think step by step' works without examples (zero-shot). Simple yet groundbreaking -- one sentence changes model behavior dramatically."
      },
      {
        title: "Prompt Engineering Guide",
        url: "https://www.promptingguide.ai/",
        type: "docs",
        author: "DAIR.AI",
        year: 2024,
        description: "Comprehensive, community-maintained guide to prompting techniques. Great reference for all the patterns discussed in this module."
      },
      {
        title: "Self-Consistency Improves Chain of Thought Reasoning",
        url: "https://arxiv.org/abs/2203.11171",
        type: "paper",
        author: "Wang et al.",
        year: 2022,
        description: "Shows that sampling multiple reasoning chains and taking majority vote dramatically improves accuracy. Used in high-stakes production systems."
      }
    ],
    claudeConnections: [
      {
        title: "Claude's Internal Reasoning",
        description: "When Claude uses Extended Thinking, it internally applies CoT, self-consistency, and backtracking -- essentially an internalized version of the prompting strategies in this module. The <thinking> blocks you see are Claude's chain-of-thought made visible."
      },
      {
        title: "System Prompts in Claude Products",
        description: "Claude's system prompts (in Claude.ai, Claude Code, and the API) heavily use structured prompting patterns. The system prompt for Claude Code, for instance, uses ReAct-style instructions telling Claude to Think -> Plan -> Act -> Verify."
      },
      {
        title: "Claude's Tool Use is ReAct",
        description: "Every time Claude calls a tool (search, code execution, file read), it's executing the ReAct loop: it reasons about what information it needs, takes an action (tool call), observes the result, and reasons about the next step. ReAct is not just a prompting technique -- it's Claude's operating architecture."
      }
    ],
    practicalTips: [
      {
        title: "CoT is free with reasoning models",
        description: "If you're using Claude with Extended Thinking or o1/o3, you don't need to prompt for CoT -- it happens automatically in the thinking phase. Save CoT prompting for standard models."
      },
      {
        title: "ReAct in practice: build the loop, not the prompts",
        description: "Instead of prompting for ReAct format, build the loop in code: call the LLM, check for tool calls, execute tools, feed results back. The code IS the ReAct pattern. See Claude's tool use documentation for the canonical implementation."
      },
      {
        title: "Self-consistency is expensive but powerful",
        description: "Sample 3-5 responses and majority-vote. Use this for critical decisions (e.g., should this agent escalate to a human?) but not for every call. At $0.003/1K tokens, 5 samples of a 500-token response costs ~$0.0075 -- still cheap for high-stakes decisions."
      }
    ]
  },

  "rm-3": {
    resources: [
      {
        title: "Anthropic API Documentation - Extended Thinking",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Official docs for implementing Extended Thinking. Includes budget_tokens tuning, streaming thinking blocks, and best practices."
      },
      {
        title: "OpenAI Reasoning Guide",
        url: "https://platform.openai.com/docs/guides/reasoning",
        type: "docs",
        author: "OpenAI",
        year: 2025,
        description: "Official OpenAI docs for o1/o3/o4-mini models. Covers reasoning_effort parameter, token usage, and limitations."
      },
      {
        title: "Building Effective Agents",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        type: "blog",
        author: "Anthropic",
        year: 2024,
        description: "Anthropic's own guide to building agents. Covers when to use extended thinking in agent loops and how to balance cost/quality."
      }
    ],
    claudeConnections: [
      {
        title: "Claude API's Thinking Parameter",
        description: "The thinking parameter in Claude's API ({type: 'enabled', budget_tokens: N}) is a direct control over test-time compute. Anthropic exposed this because they found that different tasks need different thinking depths -- a simple classification needs 1000 tokens, a complex code review might need 20000."
      },
      {
        title: "Claude Code's Model Selection",
        description: "Claude Code dynamically switches between standard Claude (fast, cheap) and Extended Thinking Claude (slow, expensive, accurate) based on task complexity. Simple file reads use standard mode; complex refactoring triggers extended thinking. This is a production example of the tiered approach discussed here."
      }
    ],
    practicalTips: [
      {
        title: "Stream thinking blocks for UX",
        description: "When using Extended Thinking in a user-facing app, stream the thinking blocks to show 'Claude is thinking...' with a progress indicator. Users are more patient when they can see the model is working. Use the streaming API with event type 'content_block_delta' and check for 'thinking' type."
      },
      {
        title: "Cache thinking-heavy responses",
        description: "If users ask similar complex questions, cache the full response (including thinking). Reasoning tokens are the most expensive part -- don't recompute them for identical queries. Use prompt caching with Anthropic's API for even better savings."
      },
      {
        title: "Profile your token usage",
        description: "Track thinking_tokens vs output_tokens separately. If thinking tokens are consistently 10x output tokens, your budget is probably too high. Aim for a 3-5x ratio for most tasks."
      }
    ]
  },

  // ─── TOOL USE ────────────────────────────────────────────────
  "tu-1": {
    resources: [
      {
        title: "Toolformer: Language Models Can Teach Themselves to Use Tools",
        url: "https://arxiv.org/abs/2302.04761",
        type: "paper",
        author: "Schick et al. (Meta)",
        year: 2023,
        description: "Showed that LLMs can learn to use tools (calculator, search, calendar) through self-supervised learning. Foundational for understanding why tool use works."
      },
      {
        title: "Gorilla: Large Language Model Connected with Massive APIs",
        url: "https://arxiv.org/abs/2305.15334",
        type: "paper",
        author: "Patil et al. (UC Berkeley)",
        year: 2023,
        description: "Trained an LLM to accurately call 1600+ APIs. Key insight: LLMs hallucinate API calls without proper grounding. The Gorilla approach reduces hallucination significantly."
      },
      {
        title: "Anthropic Tool Use Documentation",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Official Anthropic docs for tool use. Covers input_schema, tool_choice, error handling, and the full tool use loop."
      },
      {
        title: "Berkeley Function-Calling Leaderboard",
        url: "https://gorilla.cs.berkeley.edu/leaderboard.html",
        type: "article",
        author: "UC Berkeley",
        year: 2024,
        description: "Live leaderboard comparing LLMs on function calling accuracy. Claude consistently ranks near the top. Essential for benchmarking your tool use implementation."
      },
      {
        title: "API-Bank: A Comprehensive Benchmark for Tool-Augmented LLMs",
        url: "https://arxiv.org/abs/2304.08244",
        type: "paper",
        author: "Li et al.",
        year: 2023,
        description: "Benchmark for evaluating tool-augmented LLMs across 73 APIs. Defines the metrics (tool selection accuracy, argument accuracy) you should track in production."
      }
    ],
    claudeConnections: [
      {
        title: "Claude's Tool Use Architecture",
        description: "Claude was trained with tool use as a first-class capability, not bolted on. The model natively understands JSON Schema for input validation, can request parallel tool calls, and handles tool errors gracefully. This training shows in benchmarks -- Claude leads on the Berkeley Function-Calling Leaderboard."
      },
      {
        title: "MCP: Anthropic's Open Standard for Tool Use",
        description: "Anthropic created the Model Context Protocol (MCP) to standardize how LLMs connect to external tools. Instead of every app defining tools differently, MCP provides a universal protocol. Claude Desktop, Claude Code, and third-party apps all use MCP servers for tool integration."
      },
      {
        title: "Claude Code's 20+ Built-in Tools",
        description: "Claude Code ships with tools for file reading, editing, searching (grep/glob), bash execution, and browser preview. Each tool has carefully crafted descriptions and schemas -- studying Claude Code's tool definitions is a masterclass in tool design."
      }
    ],
    practicalTips: [
      {
        title: "Tool descriptions matter more than you think",
        description: "The LLM picks tools based on descriptions, not names. A tool named 'search' with description 'Search the knowledge base for customer support articles by keyword' will be used correctly. A tool named 'search' with description 'Search' will be misused. Invest 80% of your tool design time in descriptions."
      },
      {
        title: "Always validate tool inputs server-side",
        description: "Never trust the LLM's JSON output blindly. Validate against the schema, check for injection attacks (especially in SQL/command tools), and enforce rate limits. The LLM is a user -- treat its inputs like user inputs."
      },
      {
        title: "Return structured errors, not stack traces",
        description: "When a tool fails, return a structured error like {error: 'NOT_FOUND', message: 'No user with ID 123'}. The LLM can reason about structured errors and retry intelligently. A Python traceback is noise that wastes tokens."
      }
    ]
  },

  "tu-2": {
    resources: [
      {
        title: "Model Context Protocol Specification",
        url: "https://modelcontextprotocol.io/",
        type: "docs",
        author: "Anthropic",
        year: 2024,
        description: "The official MCP specification. Defines how tools, resources, and prompts are exposed to LLMs through a standardized protocol. This is becoming the USB-C of AI tool connectivity."
      },
      {
        title: "Structured Outputs - OpenAI",
        url: "https://platform.openai.com/docs/guides/structured-outputs",
        type: "docs",
        author: "OpenAI",
        year: 2024,
        description: "OpenAI's guide to forcing valid JSON output. Useful comparison with Anthropic's approach to structured tool responses."
      },
      {
        title: "Function Calling Best Practices",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        type: "blog",
        author: "Anthropic",
        year: 2024,
        description: "Anthropic's engineering blog on building agents with effective tool use patterns. Covers parallel tool calls, error handling, and composition."
      }
    ],
    claudeConnections: [
      {
        title: "Parallel Tool Calls in Claude",
        description: "Claude can request multiple tool calls in a single response. Claude Code exploits this heavily -- when it needs to read multiple files, it issues parallel Read tool calls rather than sequential ones. This is why Claude Code feels fast despite making many tool calls."
      },
      {
        title: "MCP Servers in Claude Desktop",
        description: "Claude Desktop uses MCP to connect to local tools (filesystem, databases, APIs). Each MCP server exposes tools that Claude can discover and use. This is tool composition in production -- Claude Desktop doesn't hardcode tools, it discovers them through MCP."
      },
      {
        title: "Tool Choice in Claude's API",
        description: "Claude's tool_choice parameter ('auto', 'any', 'tool') maps directly to the patterns here. Claude Code uses 'auto' for general queries and forces specific tools when it knows exactly what's needed (e.g., forcing the Edit tool when modifying a file)."
      }
    ],
    practicalTips: [
      {
        title: "Build an MCP server for your domain",
        description: "Instead of hardcoding tools, build an MCP server. Any MCP-compatible client (Claude Desktop, Claude Code, Cursor) can instantly use your tools. Start with the MCP TypeScript SDK: 'npm create @anthropic-ai/mcp-server'."
      },
      {
        title: "Fan-out/fan-in is your most useful pattern",
        description: "When a user asks a question that requires multiple data sources, fan out to parallel tool calls, then fan in to synthesize. Example: user asks 'How is our Q4 revenue?' -> parallel calls to sales_db, billing_api, forecast_sheet -> synthesize into one answer."
      },
      {
        title: "Implement tool call budgets",
        description: "Set a max_tool_calls limit (e.g., 20) per agent turn. Without limits, agents can get stuck in infinite tool-calling loops. Claude Code uses this pattern -- it has guardrails that prevent runaway tool use."
      }
    ]
  },

  // ─── AGENT FUNDAMENTALS ──────────────────────────────────────
  "af-1": {
    resources: [
      {
        title: "LLM Powered Autonomous Agents",
        url: "https://lilianweng.github.io/posts/2023-06-23-agent/",
        type: "blog",
        author: "Lilian Weng (OpenAI)",
        year: 2023,
        description: "THE definitive blog post on LLM agents. Covers planning, memory, tool use, and agent architectures. Required reading for anyone building agents. Cited by virtually every agent paper since."
      },
      {
        title: "A Survey on Large Language Model based Autonomous Agents",
        url: "https://arxiv.org/abs/2308.11432",
        type: "paper",
        author: "Wang et al.",
        year: 2023,
        description: "Comprehensive survey of 100+ agent papers. Taxonomizes agent architectures into profile, memory, planning, and action modules. Great for understanding the design space."
      },
      {
        title: "The Landscape of Emerging AI Agent Architectures for Reasoning, Planning, and Tool Calling",
        url: "https://arxiv.org/abs/2404.11584",
        type: "paper",
        author: "Masterman et al.",
        year: 2024,
        description: "Maps the evolution from simple ReAct agents to complex multi-agent systems. Provides a framework for choosing the right architecture for your use case."
      },
      {
        title: "Cognitive Architectures for Language Agents",
        url: "https://arxiv.org/abs/2309.02427",
        type: "paper",
        author: "Sumers et al.",
        year: 2023,
        description: "Proposes CoALA -- a formal framework connecting LLM agents to cognitive science. Defines memory (working, episodic, semantic), reasoning, and action spaces."
      },
      {
        title: "Building Effective Agents",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        type: "blog",
        author: "Anthropic",
        year: 2024,
        description: "Anthropic's official guide to building agents. Covers the agent loop, when to use agents vs. workflows, and practical design patterns. Written by the team that builds Claude."
      }
    ],
    claudeConnections: [
      {
        title: "Claude Code IS an Agent",
        description: "Claude Code is a production agent built on the exact loop described here: receive task -> reason about approach -> select tool -> execute -> observe result -> reason about next step -> repeat until done. Every Claude Code session is a live demonstration of the agent loop."
      },
      {
        title: "Claude's Agent SDK",
        description: "Anthropic provides the Claude Agent SDK for building custom agents. It implements the agent loop with built-in tool management, conversation history, and error handling. Instead of building the loop from scratch, you can extend the SDK with your own tools and logic."
      },
      {
        title: "Agents vs. Workflows at Anthropic",
        description: "Anthropic's 'Building Effective Agents' blog distinguishes agents (autonomous, flexible) from workflows (deterministic, predictable). Claude Code is an agent (decides what to do). Claude's system prompt pipeline is a workflow (fixed steps). Most production systems use both."
      }
    ],
    practicalTips: [
      {
        title: "Build the loop before adding intelligence",
        description: "Start with the simplest possible agent loop: LLM call -> tool execution -> feed result back. Get this working with a single tool before adding planning, memory, or complex routing. Most agent failures are loop bugs, not reasoning bugs."
      },
      {
        title: "Log everything in the agent loop",
        description: "Log every LLM call (input/output), every tool call (name, args, result), and every decision point. When an agent goes wrong, you need the full trace to debug. Anthropic uses detailed logging in Claude Code -- it's essential for production agents."
      },
      {
        title: "Set a maximum iterations limit",
        description: "Always cap the agent loop (e.g., max 25 iterations). Without this, agents can spin forever on impossible tasks. Claude Code has this built in. When the limit hits, gracefully report what was accomplished and what remains."
      }
    ]
  },

  "af-2": {
    resources: [
      {
        title: "Generative Agents: Interactive Simulacra of Human Behavior",
        url: "https://arxiv.org/abs/2304.03442",
        type: "paper",
        author: "Park et al. (Stanford)",
        year: 2023,
        description: "The 'Smallville' paper. Created 25 AI agents with memory, reflection, and planning that formed social relationships and organized events. Groundbreaking demonstration of agent memory systems."
      },
      {
        title: "MemGPT: Towards LLMs as Operating Systems",
        url: "https://arxiv.org/abs/2310.08560",
        type: "paper",
        author: "Packer et al. (UC Berkeley)",
        year: 2023,
        description: "Treats LLM context as 'virtual memory' with paging. The agent manages its own memory, moving information between working memory (context) and long-term storage. Essential reading for agents that need to handle more information than fits in context."
      },
      {
        title: "Reflexion: Language Agents with Verbal Reinforcement Learning",
        url: "https://arxiv.org/abs/2303.11366",
        type: "paper",
        author: "Shinn et al.",
        year: 2023,
        description: "Agents that learn from their mistakes through self-reflection. After failing a task, the agent writes a reflection ('I failed because...') and uses it in future attempts. Achieves 91% on HumanEval vs 80% without reflection."
      },
      {
        title: "Voyager: An Open-Ended Embodied Agent with Large Language Models",
        url: "https://arxiv.org/abs/2305.16291",
        type: "paper",
        author: "Wang et al. (NVIDIA)",
        year: 2023,
        description: "An agent that plays Minecraft, building a skill library of reusable code. Demonstrates how agents can accumulate capabilities over time through a growing memory of learned skills."
      }
    ],
    claudeConnections: [
      {
        title: "Claude's Context Window as Working Memory",
        description: "Claude's 200K token context window is essentially its working memory. The MemGPT approach of managing memory is exactly what Claude Code does -- it summarizes earlier conversation when approaching the context limit, keeping recent and relevant information in 'working memory' while compressing older context."
      },
      {
        title: "Conversation History in Claude API",
        description: "The messages array in Claude's API IS the agent's episodic memory. Each message (user, assistant, tool_result) is a memory entry. Claude Code carefully manages this array -- pruning, summarizing, and restructuring it to keep the agent effective over long sessions."
      },
      {
        title: "Claude's MEMORY.md Pattern",
        description: "Claude Code uses MEMORY.md files as persistent semantic memory across sessions. This is a practical implementation of the Reflexion pattern -- the agent writes down what it learned (project structure, user preferences, debugging insights) so future sessions start with accumulated knowledge."
      }
    ],
    practicalTips: [
      {
        title: "Implement a 3-tier memory system",
        description: "Working memory = current context window. Short-term memory = recent conversation summary stored as a system message. Long-term memory = vector store or file-based store for facts, user preferences, and past decisions. Query long-term memory at the start of each turn."
      },
      {
        title: "Use reflection after failures",
        description: "When your agent fails a task, add a reflection step: 'What went wrong? What should I try differently?' Store this reflection and inject it into future attempts. This is the Reflexion pattern and it dramatically improves success rates (80% -> 91% on coding benchmarks)."
      },
      {
        title: "Summarize, don't truncate",
        description: "When context gets long, never just drop old messages. Summarize them: 'Earlier, the user asked about X, I found that Y, and we decided Z.' Claude Code does this automatically -- it compresses prior conversation to fit within context limits while preserving key information."
      }
    ]
  },

  "af-3": {
    resources: [
      {
        title: "Understanding the Planning of LLM Agents: A Survey",
        url: "https://arxiv.org/abs/2402.02716",
        type: "paper",
        author: "Huang et al.",
        year: 2024,
        description: "Comprehensive survey of planning methods in LLM agents. Covers task decomposition, multi-plan selection, external planner integration, and plan refinement."
      },
      {
        title: "HuggingGPT: Solving AI Tasks with ChatGPT and its Friends in Hugging Face",
        url: "https://arxiv.org/abs/2303.17580",
        type: "paper",
        author: "Shen et al.",
        year: 2023,
        description: "Uses an LLM as a task planner that coordinates specialized models. Demonstrates how planning enables an agent to solve tasks it couldn't handle alone by decomposing and delegating."
      },
      {
        title: "Plan-and-Solve Prompting",
        url: "https://arxiv.org/abs/2305.04091",
        type: "paper",
        author: "Wang et al.",
        year: 2023,
        description: "Simple but effective: ask the LLM to first create a plan, then solve each step. Outperforms zero-shot CoT on complex reasoning tasks. The simplest planning pattern that works."
      },
      {
        title: "Anthropic's Research on AI Planning",
        url: "https://www.anthropic.com/research",
        type: "article",
        author: "Anthropic",
        year: 2025,
        description: "Anthropic's research page covering their work on planning, reasoning, and agent capabilities. Includes papers on evaluation and safety of planning agents."
      }
    ],
    claudeConnections: [
      {
        title: "Claude Code's Planning Mode",
        description: "Claude Code has an explicit planning mode where it creates a structured plan before executing. This is the Plan-and-Solve pattern in production -- Claude first decomposes the task into subtasks, then executes them sequentially, checking off completed steps."
      },
      {
        title: "TodoWrite: Planning as a Tool",
        description: "Claude Code uses a TodoWrite tool to create and track task lists. This externalizes the planning process -- instead of keeping the plan in the LLM's context, it's written to a structured format that both the model and user can see and track."
      },
      {
        title: "Subagents for Task Decomposition",
        description: "Claude Code can spawn subagents for independent subtasks. This is HuggingGPT-style planning: the main agent decomposes the task, delegates subtasks to specialized subagents (research, code editing, testing), and synthesizes the results."
      }
    ],
    practicalTips: [
      {
        title: "Plan explicitly for tasks with 3+ steps",
        description: "For any task requiring 3+ steps, have the agent create a plan first. Even a simple numbered list ('1. Read the file, 2. Find the bug, 3. Fix and test') dramatically improves completion rates. Make the plan visible to the user."
      },
      {
        title: "Re-plan after failures",
        description: "When a plan step fails, don't just retry -- re-plan from the current state. The agent should ask: 'Given what I've learned, is my original plan still valid?' This prevents agents from repeatedly hitting the same wall."
      },
      {
        title: "Use structured plans, not free-form text",
        description: "Have the agent output plans as JSON or structured todo lists, not paragraphs. Structured plans are easier to track, checkpoint, and resume. Claude Code's TodoWrite produces structured plans that survive context window compression."
      }
    ]
  },

  // ─── AGENTIC PATTERNS ────────────────────────────────────────
  "ap-1": {
    resources: [
      {
        title: "Building Effective Agents",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        type: "blog",
        author: "Anthropic",
        year: 2024,
        description: "Anthropic's canonical guide to agent patterns. Distinguishes workflows (deterministic) from agents (autonomous). Covers prompt chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer patterns."
      },
      {
        title: "Practices for Governing Agentic AI Systems",
        url: "https://cdn.openai.com/papers/practices-for-governing-agentic-ai-systems.pdf",
        type: "paper",
        author: "OpenAI",
        year: 2023,
        description: "OpenAI's framework for governing autonomous agents. Covers visibility, controllability, consent, and safety. Critical for anyone deploying agents in production."
      },
      {
        title: "The Shift from Models to Compound AI Systems",
        url: "https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/",
        type: "blog",
        author: "Zaharia et al. (Berkeley AI Research)",
        year: 2024,
        description: "Argues that the future of AI is not bigger models but compound systems combining multiple models, retrievers, and tools. Defines the design space for agentic architectures."
      },
      {
        title: "An Introduction to LLM Agents",
        url: "https://developer.nvidia.com/blog/introduction-to-llm-agents/",
        type: "blog",
        author: "NVIDIA",
        year: 2024,
        description: "Practical introduction to agent design patterns with code examples. Good complement to Anthropic's more conceptual guide."
      }
    ],
    claudeConnections: [
      {
        title: "Claude Code Uses Multiple Patterns",
        description: "Claude Code is a living textbook of agentic patterns. It uses: routing (deciding which tool to use), prompt chaining (reading a file then editing it), parallelization (reading multiple files at once), and orchestrator-workers (spawning subagents for independent tasks)."
      },
      {
        title: "Anthropic's Workflow vs Agent Distinction",
        description: "Anthropic's blog makes a critical distinction: workflows are deterministic pipelines (A->B->C), agents are autonomous decision-makers. Most production systems are workflows with agent-like components at specific decision points. Claude Code is one of the few fully agentic systems."
      },
      {
        title: "Evaluator-Optimizer in Claude",
        description: "Claude's training uses an evaluator-optimizer pattern: generate a response, evaluate it against constitutional principles, optimize and regenerate. This same pattern appears in Claude Code when it runs tests after writing code -- the test results evaluate the code, and Claude optimizes by fixing failures."
      }
    ],
    practicalTips: [
      {
        title: "Start with workflows, graduate to agents",
        description: "Don't build an autonomous agent when a deterministic workflow will do. Start with prompt chaining (LLM call 1 -> LLM call 2 -> ...). Only add autonomous decision-making where the workflow needs flexibility. Most production 'agents' are actually workflows."
      },
      {
        title: "The routing pattern solves 80% of use cases",
        description: "A classifier that routes queries to specialized handlers (support bot -> billing handler, tech handler, general handler) is simple, testable, and effective. Build this before building a general-purpose agent."
      },
      {
        title: "Evaluate with real users, not just benchmarks",
        description: "Agent benchmarks (SWE-bench, GAIA) measure capability but not usability. Deploy to 10 internal users, watch them use it, and iterate. Anthropic does this with Claude Code -- internal dogfooding drives more improvements than benchmark optimization."
      }
    ]
  },

  "ap-2": {
    resources: [
      {
        title: "LATS: Language Agent Tree Search Unifies Reasoning, Acting, and Planning",
        url: "https://arxiv.org/abs/2310.04406",
        type: "paper",
        author: "Zhou et al.",
        year: 2023,
        description: "Combines Monte Carlo Tree Search with LLM agents. The agent explores multiple action paths, evaluates outcomes, and backtracks. Achieves state-of-the-art on reasoning and coding tasks."
      },
      {
        title: "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?",
        url: "https://arxiv.org/abs/2310.06770",
        type: "paper",
        author: "Jimenez et al.",
        year: 2023,
        description: "THE benchmark for coding agents. 2294 real GitHub issues from 12 Python repos. Tests whether agents can actually fix real bugs. Claude + agentic scaffolding achieves top-tier performance."
      },
      {
        title: "Design Patterns for AI Agents",
        url: "https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/",
        type: "article",
        author: "Andrew Ng (DeepLearning.AI)",
        year: 2024,
        description: "Andrew Ng's practical framework for agent design patterns: reflection, tool use, planning, and multi-agent collaboration. Accessible introduction with real-world examples."
      },
      {
        title: "Reflexion: Language Agents with Verbal Reinforcement Learning",
        url: "https://arxiv.org/abs/2303.11366",
        type: "paper",
        author: "Shinn et al.",
        year: 2023,
        description: "Self-reflection pattern where agents learn from failures. After each attempt, the agent writes a verbal reflection that's added to its prompt for the next attempt."
      }
    ],
    claudeConnections: [
      {
        title: "Claude on SWE-bench",
        description: "Claude (with agentic scaffolding) achieves top-tier performance on SWE-bench. The patterns that make this work are exactly the ones in this module: planning (understand the issue), tool use (read/search code), reflection (verify the fix), and iterative refinement (run tests, fix failures)."
      },
      {
        title: "Self-Correction in Claude Code",
        description: "When Claude Code runs a test and it fails, it reads the error, reflects on what went wrong, and modifies its approach. This is the Reflexion pattern in production. The agent doesn't just retry -- it reasons about the failure and adapts."
      },
      {
        title: "LATS-like Search in Complex Tasks",
        description: "For complex refactoring tasks, Claude Code implicitly uses tree-search-like reasoning: it considers multiple approaches in its thinking, evaluates trade-offs, and picks the best path. Extended Thinking makes this explicit -- you can see Claude exploring and backtracking."
      }
    ],
    practicalTips: [
      {
        title: "Implement the retry-with-reflection pattern",
        description: "When a tool call fails or produces unexpected results: (1) capture the error, (2) add it to the conversation as 'Previous attempt failed because: [error]', (3) ask the LLM to try a different approach. This 3-step pattern solves 60% of agent failures."
      },
      {
        title: "Test your agent on SWE-bench Lite",
        description: "SWE-bench Lite (300 issues) is a practical benchmark for coding agents. Run your agent against it to find weaknesses. Most agents fail on: multi-file changes, test generation, and understanding existing code patterns."
      },
      {
        title: "Build evaluation into the loop, not after it",
        description: "Don't evaluate agent quality post-hoc. Build evaluation into the agent loop: after each major action, have the agent verify its work (run tests, check output, validate assumptions). Claude Code does this -- it runs tests after code changes, not just at the end."
      }
    ]
  },

  // ─── AGENT FRAMEWORKS ────────────────────────────────────────
  "fw-1": {
    resources: [
      {
        title: "LangGraph Documentation",
        url: "https://langchain-ai.github.io/langgraph/",
        type: "docs",
        author: "LangChain",
        year: 2024,
        description: "Official LangGraph docs. LangGraph uses directed graphs to define agent workflows with state management, checkpointing, and human-in-the-loop. The most popular framework for building complex agents."
      },
      {
        title: "Claude Agent SDK",
        url: "https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk/overview",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Anthropic's official SDK for building agents with Claude. Provides the agent loop, tool management, and guardrails out of the box."
      },
      {
        title: "Why LangChain Sucks (and What to Use Instead)",
        url: "https://www.octomind.dev/blog/why-we-no-longer-use-langchain-for-building-our-ai-agents",
        type: "blog",
        author: "Octomind",
        year: 2024,
        description: "Critical perspective on framework complexity. Argues for simpler approaches (raw API calls) over heavy frameworks. Important counterpoint to framework enthusiasm."
      },
      {
        title: "Do You Even Need a Framework?",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        type: "blog",
        author: "Anthropic",
        year: 2024,
        description: "Anthropic explicitly recommends starting WITHOUT frameworks: 'Use frameworks only when the complexity of your application justifies it.' Most agents can be built with raw API calls + a loop."
      }
    ],
    claudeConnections: [
      {
        title: "Claude Agent SDK vs Frameworks",
        description: "Anthropic's Agent SDK takes a minimalist approach compared to LangChain/LangGraph. It provides the agent loop, tool calling, and guardrails without heavy abstractions. This reflects Anthropic's philosophy: frameworks should help, not hide what's happening."
      },
      {
        title: "Claude Code: No Framework Needed",
        description: "Claude Code is built without LangChain, LangGraph, or any third-party agent framework. It uses raw Claude API calls in a custom agent loop. This proves Anthropic's point that you don't need a framework for production agents -- you need a well-engineered loop."
      }
    ],
    practicalTips: [
      {
        title: "Start without a framework",
        description: "Build your first agent with raw API calls. You'll understand the agent loop, tool calling, and state management deeply. Only adopt a framework when you need features you can't easily build (like LangGraph's checkpointing or human-in-the-loop)."
      },
      {
        title: "If you use a framework, learn what it hides",
        description: "LangGraph hides the agent loop behind graph definitions. LangChain hides prompt construction behind chains. Know what's under the abstraction so you can debug when things go wrong. Read the framework source code."
      },
      {
        title: "Framework choice depends on team, not tech",
        description: "LangGraph for teams that think in graphs/state machines. CrewAI for teams that think in roles/personas. Raw API for teams that want full control. The 'best' framework is the one your team can debug at 2am."
      }
    ]
  },

  "fw-2": {
    resources: [
      {
        title: "CrewAI Documentation",
        url: "https://docs.crewai.com/",
        type: "docs",
        author: "CrewAI",
        year: 2024,
        description: "CrewAI's official docs. Role-based multi-agent framework where you define agents with roles, goals, and tools, then orchestrate them as a 'crew'."
      },
      {
        title: "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation",
        url: "https://arxiv.org/abs/2308.08155",
        type: "paper",
        author: "Wu et al. (Microsoft)",
        year: 2023,
        description: "Microsoft's multi-agent framework. Agents communicate through conversations. Good for understanding how multi-agent communication protocols work."
      },
      {
        title: "Vercel AI SDK",
        url: "https://sdk.vercel.ai/docs",
        type: "docs",
        author: "Vercel",
        year: 2024,
        description: "TypeScript/React-focused AI SDK with streaming, tool calling, and agent capabilities. If you're building web apps with agents, this is the most practical starting point."
      }
    ],
    claudeConnections: [
      {
        title: "Multi-Agent in Claude Code",
        description: "Claude Code uses subagents (spawned via the Agent tool) for parallelizing independent tasks. Each subagent is a mini Claude instance with its own context. This is a lightweight multi-agent system -- no framework needed, just spawn additional Claude instances."
      },
      {
        title: "Claude's Role-Playing Capability",
        description: "CrewAI's role-based approach works well with Claude because Claude excels at adopting personas through system prompts. You can create a 'Research Agent' and a 'Code Review Agent' by giving each Claude instance a different system prompt. Claude's strong instruction-following makes it ideal for role-based multi-agent setups."
      }
    ],
    practicalTips: [
      {
        title: "CrewAI is great for prototyping, not production",
        description: "CrewAI's role-based metaphor makes it easy to prototype multi-agent ideas. But for production, you'll likely outgrow it and want more control over communication protocols, error handling, and state management."
      },
      {
        title: "Evaluate frameworks on error handling, not happy path",
        description: "Every framework demo shows the happy path. Test: What happens when a tool call fails? When an agent produces invalid output? When the context window fills up? When you need to debug a 10-step agent chain? The framework's error handling determines its production readiness."
      }
    ]
  },

  "fw-3": {
    resources: [
      {
        title: "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines",
        url: "https://arxiv.org/abs/2310.03714",
        type: "paper",
        author: "Khattab et al. (Stanford)",
        year: 2023,
        description: "DSPy replaces hand-written prompts with compiled, optimized prompts. You define what you want (signatures), and DSPy figures out the best prompts through optimization. Paradigm-shifting approach to prompt engineering."
      },
      {
        title: "Instructor: Structured Output Library",
        url: "https://python.useinstructor.com/",
        type: "docs",
        author: "Jason Liu",
        year: 2024,
        description: "Pydantic-based structured output library. Instead of parsing JSON manually, define a Pydantic model and Instructor guarantees valid output. Simple, practical, and production-ready."
      },
      {
        title: "Pydantic AI",
        url: "https://ai.pydantic.dev/",
        type: "docs",
        author: "Pydantic",
        year: 2024,
        description: "Agent framework from the Pydantic team. Type-safe, model-agnostic, and production-focused. Good choice if you're already using Pydantic for data validation."
      }
    ],
    claudeConnections: [
      {
        title: "Structured Output in Claude",
        description: "Claude supports forced JSON output through tool use (define a tool with the desired output schema, force the model to call it). Instructor and Pydantic AI both work with Claude's API. This is how Claude Code ensures structured responses when it needs them -- it uses tool definitions as output schemas."
      },
      {
        title: "Prompt Optimization at Anthropic",
        description: "DSPy's prompt optimization is conceptually similar to how Anthropic iterates on Claude's system prompts. Instead of hand-tuning prompts, they systematically evaluate prompt variations against benchmarks. You can use DSPy to do the same for your agent's prompts."
      }
    ],
    practicalTips: [
      {
        title: "Use Instructor for structured output today",
        description: "If you need structured LLM output in production, Instructor is the fastest path. Install with 'pip install instructor', define a Pydantic model, and get validated output in 3 lines of code. It handles retries, validation errors, and partial responses."
      },
      {
        title: "DSPy is worth learning for complex pipelines",
        description: "If you have a multi-step LLM pipeline (retrieve -> reason -> classify -> respond), DSPy can optimize all the prompts jointly. The learning curve is steep, but the payoff is significant for pipelines with 3+ LLM calls."
      }
    ]
  },

  // ─── AGENTIC RAG ─────────────────────────────────────────────
  "ar-1": {
    resources: [
      {
        title: "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection",
        url: "https://arxiv.org/abs/2310.11511",
        type: "paper",
        author: "Asai et al.",
        year: 2023,
        description: "The model decides WHEN to retrieve, WHAT to retrieve, and whether the retrieved info is actually useful. Foundational paper for agentic RAG -- retrieval as a decision, not a fixed step."
      },
      {
        title: "Corrective RAG (CRAG)",
        url: "https://arxiv.org/abs/2401.15884",
        type: "paper",
        author: "Yan et al.",
        year: 2024,
        description: "Adds a self-correction step to RAG: evaluate retrieved documents for relevance, and if they're not good enough, reformulate the query or try different sources. Production-essential pattern."
      },
      {
        title: "RAPTOR: Recursive Abstractive Processing for Tree-Organized Retrieval",
        url: "https://arxiv.org/abs/2401.18059",
        type: "paper",
        author: "Sarthi et al.",
        year: 2024,
        description: "Builds a tree of document summaries at multiple abstraction levels. Retrieval traverses the tree, combining high-level context with specific details. Dramatically improves RAG on long, complex documents."
      },
      {
        title: "Adaptive RAG: Learning to Adapt Retrieval-Augmented Large Language Models through Question Complexity",
        url: "https://arxiv.org/abs/2403.14403",
        type: "paper",
        author: "Jeong et al.",
        year: 2024,
        description: "Routes queries to different RAG strategies based on complexity. Simple questions get single retrieval, complex questions get multi-step agentic RAG. The routing pattern applied to RAG."
      },
      {
        title: "RAG is Dead, Long Live RAG",
        url: "https://www.rungalileo.io/blog/rag-is-dead-long-live-rag",
        type: "blog",
        author: "Galileo",
        year: 2024,
        description: "Provocative blog arguing that naive RAG is dead but agentic RAG (with self-correction, query rewriting, multi-hop retrieval) is the future. Good overview of where the field is heading."
      }
    ],
    claudeConnections: [
      {
        title: "Claude's 200K Context vs RAG",
        description: "Claude's massive 200K token context window changes the RAG calculus. For small-to-medium knowledge bases (<500 pages), you can often stuff everything into context instead of using RAG. But for larger KBs, RAG is still essential -- and Claude's reasoning ability makes it excel at agentic RAG patterns like query reformulation and relevance evaluation."
      },
      {
        title: "Claude Code's Codebase Search",
        description: "Claude Code uses agentic RAG for codebase understanding: it uses Grep/Glob tools to retrieve relevant code, evaluates whether the results are sufficient, reformulates queries if needed, and combines information from multiple files. This is CRAG + multi-hop retrieval in a production system."
      },
      {
        title: "Prompt Caching for RAG with Claude",
        description: "Anthropic's prompt caching feature is a game-changer for RAG: cache your system prompt + retrieved context, and subsequent queries against the same context cost 90% less. This makes agentic RAG (multiple LLM calls per query) economically viable."
      }
    ],
    practicalTips: [
      {
        title: "Always evaluate retrieval quality before generation",
        description: "After retrieval, add a step: 'Are these documents relevant to the query?' If not, reformulate the query and retrieve again. This single step (from CRAG) eliminates the most common RAG failure: generating confident answers from irrelevant context."
      },
      {
        title: "Hybrid search = dense + sparse",
        description: "Use both embedding-based (dense) and keyword-based (sparse/BM25) retrieval. Dense search captures semantic similarity, sparse search catches exact terms. Combine with reciprocal rank fusion. Most vector DBs (Pinecone, Weaviate) support this natively."
      },
      {
        title: "Chunk at semantic boundaries, not fixed sizes",
        description: "Don't chunk at 500 tokens. Chunk at paragraph, section, or function boundaries. Use Claude to identify semantic boundaries if your documents are complex. Bad chunking is the #1 cause of RAG quality issues."
      }
    ]
  },

  "ar-2": {
    resources: [
      {
        title: "From Local to Global: A Graph RAG Approach to Query-Focused Summarization",
        url: "https://arxiv.org/abs/2404.16130",
        type: "paper",
        author: "Edge et al. (Microsoft)",
        year: 2024,
        description: "Microsoft's GraphRAG: builds a knowledge graph from documents, then uses the graph structure for retrieval. Dramatically better at 'big picture' questions that require synthesizing information across documents."
      },
      {
        title: "Multi-Modal RAG",
        url: "https://blog.llamaindex.ai/multi-modal-rag-621de7525fea",
        type: "blog",
        author: "LlamaIndex",
        year: 2024,
        description: "Guide to building RAG systems that handle images, tables, and text together. Uses multi-modal embeddings and Claude's vision capabilities for retrieval over visual content."
      },
      {
        title: "Evaluation of RAG Systems",
        url: "https://docs.ragas.io/en/stable/",
        type: "docs",
        author: "RAGAS",
        year: 2024,
        description: "RAGAS framework for evaluating RAG quality. Measures faithfulness, answer relevancy, context precision, and context recall. Essential for production RAG systems."
      }
    ],
    claudeConnections: [
      {
        title: "Claude's Vision for Multi-Modal RAG",
        description: "Claude's native vision capability makes it uniquely suited for multi-modal RAG. You can retrieve images (diagrams, charts, screenshots) alongside text and have Claude reason about both. Claude Code uses this for screenshot analysis -- it reads images as part of its retrieval and reasoning process."
      },
      {
        title: "Claude's Long Context for GraphRAG",
        description: "GraphRAG generates community summaries that can be large. Claude's 200K context lets you include more graph context per query than other models, improving synthesis quality on 'big picture' questions."
      }
    ],
    practicalTips: [
      {
        title: "Use RAGAS to measure RAG quality",
        description: "Before and after every RAG system change, run RAGAS evaluation: faithfulness (is the answer grounded in context?), relevancy (does it answer the question?), context precision (is retrieved context relevant?). Without metrics, you're guessing."
      },
      {
        title: "GraphRAG is worth it for connected knowledge",
        description: "If your documents reference each other (legal docs, codebases, research papers), GraphRAG dramatically outperforms vector RAG. The setup cost is high (entity extraction, graph construction) but the quality improvement for 'how does X relate to Y?' questions is massive."
      },
      {
        title: "Start with vector RAG, add graph incrementally",
        description: "Don't build GraphRAG from day one. Start with simple vector RAG, identify where it fails (usually cross-document reasoning), and add graph-based retrieval for those specific failure cases. Hybrid vector+graph is usually better than pure graph."
      }
    ]
  },

  // ─── MULTI-AGENT ─────────────────────────────────────────────
  "ma-1": {
    resources: [
      {
        title: "Communicative Agents for Software Development",
        url: "https://arxiv.org/abs/2307.07924",
        type: "paper",
        author: "Qian et al. (ChatDev)",
        year: 2023,
        description: "ChatDev: a multi-agent system where CEO, CTO, Programmer, and Tester agents collaborate to build software through natural language communication. Demonstrates role-based multi-agent collaboration."
      },
      {
        title: "MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework",
        url: "https://arxiv.org/abs/2308.00352",
        type: "paper",
        author: "Hong et al.",
        year: 2023,
        description: "Multi-agent framework that uses Standard Operating Procedures (SOPs) to coordinate agents. Each agent has a role and follows structured protocols. Generates complete software projects from natural language specs."
      },
      {
        title: "More Agents Is All You Need",
        url: "https://arxiv.org/abs/2402.05120",
        type: "paper",
        author: "Li et al.",
        year: 2024,
        description: "Counterintuitive finding: simply sampling more agents and taking majority vote improves performance on complex tasks. Similar to self-consistency but across agents. Simple and effective."
      },
      {
        title: "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation",
        url: "https://arxiv.org/abs/2308.08155",
        type: "paper",
        author: "Wu et al. (Microsoft)",
        year: 2023,
        description: "Microsoft's multi-agent framework. Agents communicate through conversations, enabling flexible collaboration patterns. Includes human-in-the-loop capabilities."
      }
    ],
    claudeConnections: [
      {
        title: "Claude Code's Subagent Architecture",
        description: "Claude Code spawns specialized subagents for independent tasks. A research subagent explores the codebase while the main agent plans the implementation. Each subagent gets its own Claude instance with a focused prompt. This is a lightweight multi-agent system without the complexity of frameworks like AutoGen."
      },
      {
        title: "Anthropic's Multi-Model Approach",
        description: "Anthropic offers models at different capability/cost points (Haiku, Sonnet, Opus). A well-designed multi-agent system uses Haiku for simple routing/classification, Sonnet for standard tasks, and Opus for complex reasoning. This tiered approach mirrors how Anthropic thinks about model deployment."
      },
      {
        title: "Claude's Collaboration Style",
        description: "Claude is trained to be a good collaborator -- it can adopt roles, follow protocols, and communicate structured information clearly. This makes it particularly effective in multi-agent setups where agents need to exchange information reliably without miscommunication."
      }
    ],
    practicalTips: [
      {
        title: "Use multi-agent only when single-agent fails",
        description: "Multi-agent systems are complex to debug. Start with a single agent. Only split into multiple agents when you have: (1) truly independent subtasks, (2) different capability requirements per subtask, or (3) the need for parallel execution. 'More agents' is not always 'better agents'."
      },
      {
        title: "Define communication protocols explicitly",
        description: "Don't let agents communicate in free-form text. Define structured message formats: {from: 'researcher', to: 'coder', type: 'findings', data: {...}}. This prevents the #1 multi-agent failure: agents misunderstanding each other."
      },
      {
        title: "Use a supervisor agent for coordination",
        description: "In any multi-agent system with 3+ agents, add a supervisor agent that assigns tasks, checks results, and handles failures. Without a supervisor, agents can deadlock, duplicate work, or work at cross-purposes."
      }
    ]
  },

  // ─── PRODUCTION ──────────────────────────────────────────────
  "pr-1": {
    resources: [
      {
        title: "Challenges in Deploying LLM Agents in Production",
        url: "https://arxiv.org/abs/2404.07471",
        type: "paper",
        author: "Chen et al.",
        year: 2024,
        description: "Comprehensive survey of production challenges: latency, cost, reliability, safety, evaluation, and monitoring. Based on interviews with 30+ teams deploying agents in production."
      },
      {
        title: "Weights & Biases: LLMOps Guide",
        url: "https://wandb.ai/site/solutions/llmops",
        type: "article",
        author: "Weights & Biases",
        year: 2024,
        description: "Practical guide to LLM operations: experiment tracking, evaluation, monitoring, and deployment. The MLOps equivalent for LLM-based systems."
      },
      {
        title: "LangSmith Documentation",
        url: "https://docs.smith.langchain.com/",
        type: "docs",
        author: "LangChain",
        year: 2024,
        description: "LLM observability platform. Trace every LLM call, tool invocation, and agent step. Essential for debugging production agents. Works with any LLM, not just LangChain."
      },
      {
        title: "Braintrust AI",
        url: "https://www.braintrustdata.com/docs",
        type: "docs",
        author: "Braintrust",
        year: 2024,
        description: "Enterprise-grade evaluation and observability for LLM applications. Supports A/B testing, prompt versioning, and online evaluation. Good alternative to LangSmith."
      }
    ],
    claudeConnections: [
      {
        title: "Claude API's Production Features",
        description: "Anthropic's API includes production-critical features: prompt caching (90% cost reduction on repeated context), batch API (50% cost reduction for async workloads), rate limits with automatic retries, and usage tracking. These features exist because Anthropic operates Claude at massive scale internally."
      },
      {
        title: "Claude Code's Production Architecture",
        description: "Claude Code is a production agent serving thousands of developers daily. Its architecture handles: context window management (automatic compression), error recovery (retry with backoff), cost control (model selection based on task complexity), and observability (logging every tool call)."
      },
      {
        title: "Anthropic's Safety in Production",
        description: "Anthropic deploys Claude with multiple safety layers: input classifiers, output filters, usage monitoring, and Constitutional AI training. For production agents, replicate this layered approach: don't rely on a single safety check."
      }
    ],
    practicalTips: [
      {
        title: "Implement observability from day one",
        description: "Log every LLM call with: input, output, latency, tokens used, model version, and cost. Use LangSmith, Braintrust, or even a simple database. You WILL need this data to debug production issues. Retroactively adding logging is painful."
      },
      {
        title: "Use prompt caching aggressively",
        description: "Anthropic's prompt caching reduces costs by 90% for the cached portion. Cache your system prompt, tool definitions, and any repeated context. For agentic loops, the system prompt is the same every turn -- cache it."
      },
      {
        title: "Set up cost alerts before launch",
        description: "Agent loops can be expensive if they run away. Set up cost alerts (daily, hourly) and hard limits. Anthropic's API supports usage tracking -- build a middleware that kills requests exceeding your per-user budget."
      }
    ]
  },

  "pr-2": {
    resources: [
      {
        title: "Anthropic's Responsible Scaling Policy",
        url: "https://www.anthropic.com/index/anthropics-responsible-scaling-policy",
        type: "article",
        author: "Anthropic",
        year: 2023,
        description: "Anthropic's framework for responsible AI deployment. Defines AI Safety Levels (ASL) and the evaluations required at each level. Blueprint for responsible agent deployment."
      },
      {
        title: "OWASP Top 10 for LLM Applications",
        url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
        type: "article",
        author: "OWASP",
        year: 2025,
        description: "Security risks specific to LLM applications: prompt injection, insecure output handling, training data poisoning, model denial of service, supply chain vulnerabilities. Must-read for production deployment."
      },
      {
        title: "How to Evaluate LLM Applications",
        url: "https://www.anthropic.com/engineering/evaluating-ai-systems",
        type: "blog",
        author: "Anthropic",
        year: 2024,
        description: "Anthropic's approach to evaluating AI systems. Covers human evaluation, automated evaluation, and red-teaming. Practical guide for building evaluation pipelines."
      },
      {
        title: "Continuous Evaluation for LLM Applications",
        url: "https://hamel.dev/blog/posts/evals/",
        type: "blog",
        author: "Hamel Husain",
        year: 2024,
        description: "Practical guide to building evaluation pipelines for LLM apps. Argues for continuous evaluation (not just pre-deploy) and LLM-as-judge patterns. Battle-tested advice from an industry practitioner."
      }
    ],
    claudeConnections: [
      {
        title: "Anthropic's Evaluation Philosophy",
        description: "Anthropic evaluates Claude with a combination of automated benchmarks, human evaluation, and red-teaming. For production agents, adopt the same approach: automated tests for regression detection, human eval for quality, and red-teaming for safety. No single evaluation method is sufficient."
      },
      {
        title: "Claude's Safety Layers",
        description: "Claude's production safety includes: Constitutional AI training (model-level), input/output classifiers (API-level), usage policies (product-level), and monitoring (operational-level). For your agents, implement at least 2-3 of these layers."
      },
      {
        title: "Anthropic's Red Teaming",
        description: "Anthropic employs red teams to find Claude's failure modes before deployment. For production agents, do the same: have team members try to break your agent before users do. Focus on prompt injection, tool misuse, and information leakage."
      }
    ],
    practicalTips: [
      {
        title: "Build an evaluation suite before optimizing",
        description: "Before changing prompts, models, or architecture, build an evaluation suite: 50-100 test cases covering normal use, edge cases, and adversarial inputs. Run evals after every change. Without evals, you're optimizing blindly."
      },
      {
        title: "Use LLM-as-judge for scalable evaluation",
        description: "For subjective quality (helpfulness, accuracy, tone), use Claude as a judge: 'Rate this response on a scale of 1-5 for helpfulness. Explain your reasoning.' LLM-as-judge correlates well with human evaluation and scales infinitely."
      },
      {
        title: "Red-team your agent for 2 hours before launch",
        description: "Spend 2 focused hours trying to break your agent: prompt injection, tool misuse, context manipulation, edge cases. Document every failure. Fix the critical ones. Accept the minor ones. This 2-hour investment prevents embarrassing production incidents."
      }
    ]
  },

  // ─── SYSTEM DESIGN ───────────────────────────────────────────
  "sd-1": {
    resources: [
      {
        title: "Designing Autonomous AI Agent Systems",
        url: "https://arxiv.org/abs/2404.11584",
        type: "paper",
        author: "Masterman et al.",
        year: 2024,
        description: "Framework for designing agent systems from first principles. Covers architecture patterns, communication protocols, and scalability considerations."
      },
      {
        title: "System Design for AI/ML Engineers",
        url: "https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers",
        type: "course",
        author: "Educative",
        year: 2024,
        description: "Comprehensive system design course covering traditional + AI system design. Good preparation for system design interviews at AI companies."
      },
      {
        title: "MLOps: Machine Learning Operations",
        url: "https://ml-ops.org/",
        type: "article",
        author: "ML-Ops Community",
        year: 2024,
        description: "Community resource for ML operations. Covers deployment patterns, monitoring, CI/CD for ML, and model serving. The operational foundation for production agents."
      }
    ],
    claudeConnections: [
      {
        title: "Claude's Architecture Decisions",
        description: "Claude's API is designed for system design simplicity: stateless (no server-side conversation state), synchronous with optional streaming, and horizontally scalable. When designing agent systems, follow the same principles: keep the API stateless, manage state client-side, and design for horizontal scaling."
      },
      {
        title: "Claude Code's System Design",
        description: "Claude Code's architecture is a case study in agent system design: a CLI client that manages conversation state locally, communicates with Claude's API, executes tools in a sandboxed environment, and provides observability through structured logging. Study it as a reference architecture."
      }
    ],
    practicalTips: [
      {
        title: "Design for the happy path first, then add resilience",
        description: "In system design interviews and real systems: sketch the simplest architecture that works for the happy path. Then add: caching, retry logic, circuit breakers, fallback models, and monitoring. Don't over-engineer from the start."
      },
      {
        title: "Always include a human escalation path",
        description: "Every production agent system needs a 'call a human' escape hatch. Design for it: when should the agent escalate? How does the human take over? Can the agent resume after human intervention? This is the most underdesigned part of most agent systems."
      }
    ]
  },

  "sd-2": {
    resources: [
      {
        title: "GAIA: A Benchmark for General AI Assistants",
        url: "https://arxiv.org/abs/2311.12983",
        type: "paper",
        author: "Mialon et al. (Meta)",
        year: 2023,
        description: "Benchmark for general-purpose AI assistants. Tests multi-step reasoning, tool use, and real-world knowledge. Great for evaluating end-to-end agent capabilities."
      },
      {
        title: "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering",
        url: "https://arxiv.org/abs/2405.15793",
        type: "paper",
        author: "Yang et al. (Princeton)",
        year: 2024,
        description: "Research on optimal agent-computer interfaces. Shows that the interface design (how the agent interacts with the environment) matters as much as the model itself. Critical for agent system design."
      },
      {
        title: "System Design Interview - AI/ML Edition",
        url: "https://www.amazon.com/Machine-Learning-System-Design-Interview/dp/B09YQWX59Z",
        type: "article",
        author: "Ali Aminian & Alex Xu",
        year: 2023,
        description: "Book covering ML system design interviews. Includes chapters on recommendation systems, search ranking, and content generation systems relevant to AI agent design."
      }
    ],
    claudeConnections: [
      {
        title: "SWE-agent and Claude Code Comparison",
        description: "SWE-agent and Claude Code both solve the same problem (automated software engineering) but with different interface designs. SWE-agent uses custom terminal commands, Claude Code uses natural tool interfaces (Read, Edit, Bash). Comparing them illustrates why agent-computer interface design matters."
      },
      {
        title: "Claude on GAIA Benchmark",
        description: "Claude performs well on GAIA because it excels at the core agent capabilities tested: multi-step reasoning, tool use, and real-world knowledge. Understanding GAIA's evaluation criteria helps you design agents that handle real-world tasks, not just benchmarks."
      }
    ],
    practicalTips: [
      {
        title: "Practice system design with agent-specific scenarios",
        description: "Interview prep: practice designing these systems: (1) A coding assistant like Claude Code, (2) A customer support agent with tool access, (3) A multi-agent research system, (4) An agentic RAG system with self-correction. For each, define components, data flow, failure modes, and scaling strategy."
      },
      {
        title: "Quantify everything in system design",
        description: "Don't say 'it's fast' -- say 'p50 latency is 2s, p99 is 8s'. Don't say 'it's cheap' -- say '$0.02 per query at 500 tokens average'. System design interviews (and real systems) require numbers: QPS, latency, cost, token usage, error rates."
      }
    ]
  },

  // ─── PROJECTS ────────────────────────────────────────────────
  "cp-1": {
    resources: [
      {
        title: "Full Stack AI Agent Development",
        url: "https://www.deeplearning.ai/short-courses/",
        type: "course",
        author: "DeepLearning.AI",
        year: 2024,
        description: "Collection of short courses on building AI agents, RAG systems, and multi-agent applications. Free and practical. Great for capstone project inspiration."
      },
      {
        title: "Awesome LLM Apps",
        url: "https://github.com/Shubhamsaboo/awesome-llm-apps",
        type: "article",
        author: "Community",
        year: 2024,
        description: "Curated list of LLM-powered applications with source code. Great for finding project ideas and seeing how others structure their agent applications."
      },
      {
        title: "Building Production-Grade AI Applications",
        url: "https://huyenchip.com/2024/01/14/ai-engineering.html",
        type: "blog",
        author: "Chip Huyen",
        year: 2024,
        description: "Chip Huyen's guide to AI engineering. Covers the gap between prototype and production, evaluation strategies, and the skills needed for AI engineering roles."
      }
    ],
    claudeConnections: [
      {
        title: "Build Your Projects with Claude's API",
        description: "Use Claude's API as the backbone for your capstone projects. Anthropic offers free API credits for developers, and Claude's tool use + extended thinking capabilities make it ideal for building impressive agent demos."
      },
      {
        title: "Claude Code as a Reference Implementation",
        description: "Study Claude Code's open-source architecture as a reference for your capstone projects. It demonstrates production patterns: error handling, context management, tool design, user interaction, and safety. Your projects can follow the same architectural patterns."
      },
      {
        title: "Contribute to the MCP Ecosystem",
        description: "Build an MCP server as a capstone project. The MCP ecosystem is growing rapidly, and Anthropic actively promotes community-built MCP servers. A well-built MCP server demonstrates tool design, protocol implementation, and ecosystem contribution -- impressive on a resume."
      }
    ],
    practicalTips: [
      {
        title: "Build 2 projects: one simple, one ambitious",
        description: "Project 1: A focused agent that does one thing well (e.g., code review agent, meeting summarizer, research assistant). Ship it. Project 2: A complex multi-agent system (e.g., automated PR reviewer, agentic RAG over company docs). The simple project shows you can ship; the complex one shows you can architect."
      },
      {
        title: "Document your design decisions",
        description: "For each project, write a 1-page design doc: problem statement, architecture diagram, key design decisions (and alternatives considered), evaluation results, and lessons learned. Interviewers care more about your thinking than your code."
      },
      {
        title: "Deploy publicly and share metrics",
        description: "Deploy your projects (Vercel, Railway, fly.io). Track and share metrics: queries handled, success rate, average latency, cost per query. A live demo with real metrics is 10x more impressive than a GitHub repo with no deployment."
      }
    ]
  },

  // ─── LLM SECURITY ───────────────────────────────────────────
  "sec-1": {
    resources: [
      {
        title: "Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection",
        url: "https://arxiv.org/abs/2302.12173",
        type: "paper",
        author: "Greshake et al.",
        year: 2023,
        description: "THE foundational paper on indirect prompt injection. Shows how attackers embed instructions in data that LLMs process (emails, web pages, documents), causing the LLM to execute malicious actions. Essential reading."
      },
      {
        title: "OWASP Top 10 for LLM Applications (2025)",
        url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
        type: "article",
        author: "OWASP",
        year: 2025,
        description: "The definitive security risk list for LLM applications. Covers: prompt injection, insecure output handling, training data poisoning, model DoS, supply chain risks, sensitive info disclosure, insecure plugin design, excessive agency, overreliance, and model theft."
      },
      {
        title: "Anthropic's Responsible Disclosure Policy",
        url: "https://www.anthropic.com/responsible-disclosure-policy",
        type: "article",
        author: "Anthropic",
        year: 2024,
        description: "How Anthropic handles security vulnerabilities in Claude. Understanding this helps you build your own responsible disclosure process for AI products."
      },
      {
        title: "LLM Security: A Practitioner's Guide",
        url: "https://github.com/cchio/awesome-llm-security",
        type: "article",
        author: "Community",
        year: 2024,
        description: "Curated list of LLM security resources: tools, papers, techniques, and case studies. Good starting point for building your security knowledge."
      }
    ],
    claudeConnections: [
      {
        title: "Claude's Defense Against Prompt Injection",
        description: "Claude is trained with Constitutional AI to resist prompt injection. It distinguishes between system instructions (from developers) and user input, and refuses to override system instructions based on user manipulation. But no defense is perfect -- layered defenses (input filtering, output validation, permission scoping) are essential."
      },
      {
        title: "Claude Code's Sandboxed Execution",
        description: "Claude Code executes shell commands in a sandboxed environment with permission controls. Users must approve potentially dangerous operations. This is defense-in-depth: even if the LLM is tricked into generating a dangerous command, the sandbox prevents execution without user consent."
      },
      {
        title: "System Prompt Protection in Claude",
        description: "Claude is trained to protect system prompt contents from extraction. When users ask 'What's your system prompt?', Claude declines. This matters because system prompts often contain business logic, security rules, and tool configurations that shouldn't be exposed."
      }
    ],
    practicalTips: [
      {
        title: "Treat LLM output as untrusted user input",
        description: "Never execute LLM output directly: don't eval() it, don't pass it to SQL without parameterization, don't render it as HTML without sanitization. The LLM is a user from a security perspective. Apply the same input validation you'd use for any user input."
      },
      {
        title: "Separate data plane from control plane",
        description: "User-provided data (emails, documents, web content) should be clearly delimited in your prompts. Use XML tags: <user_data>...</user_data>. Claude is trained to respect these boundaries, but enforcement must happen at multiple levels."
      },
      {
        title: "Implement least-privilege tool access",
        description: "Don't give agents admin-level tool access. A customer support agent doesn't need database write access. Scope each tool to the minimum required permissions. This limits the blast radius of prompt injection -- even if the LLM is tricked, it can only do what its tools allow."
      }
    ]
  },

  "sec-2": {
    resources: [
      {
        title: "Red Teaming Language Models to Reduce Harms",
        url: "https://arxiv.org/abs/2209.07858",
        type: "paper",
        author: "Ganguli et al. (Anthropic)",
        year: 2022,
        description: "Anthropic's foundational red-teaming paper. Describes methods for systematically finding harmful model behaviors. Used to improve Claude's safety. Essential reading for anyone deploying LLMs."
      },
      {
        title: "Jailbroken: How Does LLM Safety Training Fail?",
        url: "https://arxiv.org/abs/2307.02483",
        type: "paper",
        author: "Wei et al.",
        year: 2023,
        description: "Systematic analysis of jailbreak techniques. Categorizes attacks into pretending (roleplay), attention shifting, privilege escalation, and more. Crucial for understanding what you're defending against."
      },
      {
        title: "Universal and Transferable Adversarial Attacks on Aligned Language Models",
        url: "https://arxiv.org/abs/2307.15043",
        type: "paper",
        author: "Zou et al.",
        year: 2023,
        description: "Discovered automated methods to generate adversarial suffixes that jailbreak any aligned LLM. Showed that safety training can be systematically bypassed. Sparked major defensive research."
      },
      {
        title: "Anthropic Red Teaming Report",
        url: "https://www.anthropic.com/research/red-teaming",
        type: "article",
        author: "Anthropic",
        year: 2024,
        description: "Anthropic's public red-teaming reports and methodology. Shows how Anthropic systematically tests Claude for vulnerabilities before release."
      }
    ],
    claudeConnections: [
      {
        title: "Anthropic Invented Modern Red Teaming for LLMs",
        description: "Anthropic's 2022 red-teaming paper established the methodology now used across the industry. They use both human red-teamers and AI-assisted red-teaming (having Claude generate potential attacks) to find vulnerabilities. This dual approach is significantly more effective than either alone."
      },
      {
        title: "Constitutional AI as a Defense",
        description: "Claude's Constitutional AI training is Anthropic's primary defense against jailbreaks. The model is trained to evaluate its own outputs against a set of principles and revise harmful responses. Understanding this defense mechanism helps you build complementary defenses in your applications."
      },
      {
        title: "Claude's Refusal Training",
        description: "Claude is trained to refuse harmful requests while being helpful for legitimate ones. This balance is carefully calibrated -- too many refusals makes the model useless, too few makes it unsafe. When building agents, calibrate your own safety thresholds similarly."
      }
    ],
    practicalTips: [
      {
        title: "Red-team with a checklist",
        description: "Systematically test these attack categories: (1) Direct harmful requests, (2) Roleplay/pretend attacks, (3) Encoding tricks (base64, ROT13), (4) Multi-turn manipulation, (5) Indirect injection via data, (6) Tool misuse, (7) Information extraction. Don't just try random attacks -- be systematic."
      },
      {
        title: "Use AI-assisted red-teaming",
        description: "Use Claude to generate attack prompts against your system. Prompt: 'You are a red-teamer. Generate 10 prompts that might cause [your system] to [undesired behavior]. Be creative.' Then test each one. AI finds attack vectors humans miss."
      },
      {
        title: "Build a jailbreak test suite",
        description: "Maintain a growing list of jailbreak attempts (from your red-teaming, public disclosures, and real user attempts). Run this test suite after every model or prompt change. Regression in jailbreak defense is the most common post-deployment failure."
      }
    ]
  },

  "sec-3": {
    resources: [
      {
        title: "Prompt Injection Defenses: A Taxonomy and Benchmark",
        url: "https://arxiv.org/abs/2401.03024",
        type: "paper",
        author: "Liu et al.",
        year: 2024,
        description: "Comprehensive taxonomy of prompt injection defenses: input filtering, output filtering, instruction hierarchy, and sandboxing. Benchmarks each defense against known attacks. Essential for choosing your defense strategy."
      },
      {
        title: "Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions",
        url: "https://arxiv.org/abs/2404.13208",
        type: "paper",
        author: "Wallace et al. (OpenAI)",
        year: 2024,
        description: "Trains models to prioritize system prompts over user inputs. Directly addresses indirect prompt injection by creating an instruction hierarchy. Foundational for secure agent design."
      },
      {
        title: "Simon Willison's Prompt Injection Blog Series",
        url: "https://simonwillison.net/series/prompt-injection/",
        type: "blog",
        author: "Simon Willison",
        year: 2024,
        description: "The most comprehensive and up-to-date blog series on prompt injection. Written by a security researcher who's been tracking this threat since day one. Practical, detailed, and constantly updated."
      }
    ],
    claudeConnections: [
      {
        title: "Claude's Instruction Hierarchy",
        description: "Claude implements an instruction hierarchy: system prompt > user messages > tool results > embedded content. This means instructions in a system prompt take precedence over user attempts to override them. Anthropic trains this hierarchy into the model -- it's not just prompt engineering."
      },
      {
        title: "Claude Code's Permission System",
        description: "Claude Code implements defense-in-depth for tool execution: (1) The model decides to use a tool, (2) The tool call is shown to the user, (3) The user approves or denies. This three-step process prevents both prompt injection and accidental destructive actions."
      },
      {
        title: "Anthropic's Input/Output Classifiers",
        description: "Anthropic runs classifiers on both inputs (detecting attack attempts) and outputs (detecting harmful content) in production. These classifiers operate independently of the model -- even if the model is jailbroken, the output classifier can catch harmful responses."
      }
    ],
    practicalTips: [
      {
        title: "Layer your defenses (defense-in-depth)",
        description: "No single defense stops all attacks. Layer: (1) Input filtering (detect known attack patterns), (2) Instruction hierarchy (system prompt > user input), (3) Output validation (check for policy violations), (4) Permission scoping (limit tool access), (5) Monitoring (detect anomalous behavior). Any 3 of these gives strong protection."
      },
      {
        title: "Use XML delimiters for untrusted content",
        description: "Wrap all user-provided content in XML tags: <user_input>untrusted content</user_input>. In your system prompt, instruct the model to treat content within these tags as data, never as instructions. Claude is specifically trained to respect these boundaries."
      },
      {
        title: "Monitor for prompt injection attempts",
        description: "Log all inputs and flag patterns like: 'ignore previous instructions', 'you are now', 'system:', encoded text (base64), and repeated special characters. Alert on high concentrations. This gives you visibility into attack attempts before they succeed."
      }
    ]
  },

  "sec-4": {
    resources: [
      {
        title: "Extracting Training Data from Large Language Models",
        url: "https://arxiv.org/abs/2012.07805",
        type: "paper",
        author: "Carlini et al.",
        year: 2021,
        description: "Seminal paper showing that LLMs memorize and can regurgitate training data. Demonstrates privacy risks of LLM deployment. Essential for understanding data leakage threats."
      },
      {
        title: "Scalable Extraction of Training Data from (Production) Language Models",
        url: "https://arxiv.org/abs/2311.17035",
        type: "paper",
        author: "Nasr et al. (Google DeepMind)",
        year: 2023,
        description: "Scaled up data extraction attacks to production models. Extracted training data from ChatGPT using simple prompts. Shows that even deployed models are vulnerable to data extraction."
      },
      {
        title: "Privacy in LLMs: A Survey",
        url: "https://arxiv.org/abs/2402.00888",
        type: "paper",
        author: "Yao et al.",
        year: 2024,
        description: "Comprehensive survey of privacy risks in LLMs: memorization, inference attacks, attribute extraction, and defenses. Good overview of the threat landscape."
      }
    ],
    claudeConnections: [
      {
        title: "Anthropic's Data Privacy Approach",
        description: "Anthropic takes data privacy seriously: Claude doesn't train on API conversations by default, offers zero-data-retention options for enterprise customers, and has published research on preventing data memorization. Understanding Anthropic's approach helps you design similarly privacy-conscious systems."
      },
      {
        title: "Claude's PII Handling",
        description: "Claude is trained to be cautious with PII (personally identifiable information). It won't repeat back credit card numbers, SSNs, or passwords that appear in context. For your agents, implement similar PII detection and masking in tool outputs."
      }
    ],
    practicalTips: [
      {
        title: "Never put secrets in prompts",
        description: "API keys, database passwords, and internal URLs should never be in system prompts or tool descriptions. Use environment variables and have tools access secrets server-side. Prompts can be extracted -- treat them as semi-public."
      },
      {
        title: "Implement PII detection on tool outputs",
        description: "Before feeding tool results back to the LLM, scan for PII (email, phone, SSN, credit card patterns). Mask or redact PII that the LLM doesn't need. Libraries like Microsoft's Presidio make this easy."
      },
      {
        title: "Audit what data flows through your agent",
        description: "Map every data path: what user data enters the agent? What data do tools return? What data goes to the LLM? What data appears in logs? Many data leaks happen through logging -- you log the full LLM conversation including user PII to a third-party observability platform."
      }
    ]
  },

  // ─── GUARDRAILS ──────────────────────────────────────────────
  "gr-1": {
    resources: [
      {
        title: "NeMo Guardrails: A Toolkit for Controllable and Safe LLM Applications with Programmable Rails",
        url: "https://arxiv.org/abs/2310.10501",
        type: "paper",
        author: "Rebedea et al. (NVIDIA)",
        year: 2023,
        description: "NVIDIA's open-source guardrails toolkit. Uses Colang (a custom language) to define conversational rails. Supports input/output filtering, topic control, and fact-checking. Production-ready and well-documented."
      },
      {
        title: "Guardrails AI",
        url: "https://www.guardrailsai.com/docs",
        type: "docs",
        author: "Guardrails AI",
        year: 2024,
        description: "Python framework for adding validation to LLM outputs. Define validators (no PII, valid JSON, no toxicity) and the framework automatically retries on validation failures. Practical and easy to integrate."
      },
      {
        title: "Constitutional AI: Harmlessness from AI Feedback",
        url: "https://arxiv.org/abs/2212.08073",
        type: "paper",
        author: "Bai et al. (Anthropic)",
        year: 2022,
        description: "THE paper on Constitutional AI -- Anthropic's approach to making LLMs safe. The model critiques and revises its own outputs based on a set of principles. This is how Claude learns to be helpful AND harmless."
      },
      {
        title: "Llama Guard: LLM-based Input-Output Safeguard for Human-AI Conversations",
        url: "https://arxiv.org/abs/2312.06674",
        type: "paper",
        author: "Inan et al. (Meta)",
        year: 2023,
        description: "A specialized LLM trained to classify inputs and outputs as safe/unsafe. Can be used as a guardrail layer in front of any LLM. Open-source and practical."
      }
    ],
    claudeConnections: [
      {
        title: "Constitutional AI IS Claude's Guardrail System",
        description: "Claude's safety isn't bolted on -- it's trained in through Constitutional AI. The model evaluates its own outputs against principles like 'Be helpful', 'Be harmless', 'Be honest'. This self-critique loop is essentially an internal guardrail system. Understanding CAI helps you design external guardrails that complement Claude's internal ones."
      },
      {
        title: "Claude's Usage Policy as a Guardrail Spec",
        description: "Anthropic's Acceptable Use Policy defines what Claude should and shouldn't do. This policy is both a training signal (Claude is trained to follow it) and a specification for external guardrails. When building your own guardrails, start with a similar policy document for your use case."
      },
      {
        title: "Claude Code's Tool Permission Guardrails",
        description: "Claude Code implements guardrails through its permission system: some tools are always allowed (Read), some require user approval (Edit, Bash), and some are always blocked (destructive operations). This is a practical guardrail pattern: classify actions by risk level and gate accordingly."
      }
    ],
    practicalTips: [
      {
        title: "Start with output guardrails, then add input guardrails",
        description: "Output guardrails (checking what the LLM says) catch more real-world issues than input guardrails (checking what users say). Users find creative ways around input filters. Output filters catch harmful content regardless of how the input was crafted."
      },
      {
        title: "Use Guardrails AI for structured output validation",
        description: "If your agent produces structured output (JSON, SQL, code), use Guardrails AI to validate it. Define validators: 'SQL must be read-only', 'JSON must match schema', 'Code must not contain eval()'. Automatic retry on validation failure is incredibly useful."
      },
      {
        title: "Don't rely solely on the LLM's built-in safety",
        description: "Claude's Constitutional AI is strong but not infallible. Always add at least one external guardrail layer. The defense-in-depth principle: if the model's internal safety fails, your external guardrail catches it. This is how Anthropic deploys Claude internally."
      }
    ]
  },

  "gr-2": {
    resources: [
      {
        title: "Human-in-the-Loop Machine Learning",
        url: "https://www.manning.com/books/human-in-the-loop-machine-learning",
        type: "article",
        author: "Robert Monarch",
        year: 2021,
        description: "Book on designing human-in-the-loop ML systems. Covers annotation, active learning, and human oversight patterns. Applicable to agent systems where human approval is needed for high-stakes actions."
      },
      {
        title: "Anthropic's Claude Acceptable Use Policy",
        url: "https://www.anthropic.com/aup",
        type: "article",
        author: "Anthropic",
        year: 2024,
        description: "Anthropic's policy defining acceptable and prohibited uses of Claude. Use this as a template for defining your own agent's guardrail policies."
      },
      {
        title: "Anthropic's Core Views on AI Safety",
        url: "https://www.anthropic.com/research/core-views-on-ai-safety",
        type: "article",
        author: "Anthropic",
        year: 2023,
        description: "Anthropic's foundational safety philosophy. Explains why they prioritize safety research and how it informs Claude's design. Understanding this helps you make principled safety decisions for your own systems."
      }
    ],
    claudeConnections: [
      {
        title: "Human-in-the-Loop in Claude Code",
        description: "Claude Code's permission system is a human-in-the-loop guardrail: the agent proposes an action, the human approves or denies. The user can configure permission levels (allow all, allow some, approve all). This sliding scale of autonomy is a design pattern worth adopting."
      },
      {
        title: "Anthropic's Approach to Sensitive Topics",
        description: "Claude handles sensitive topics (medical advice, legal questions, financial decisions) with calibrated caution: it provides information but recommends professional consultation. For your agents, implement similar topic-aware guardrails that adjust behavior based on topic sensitivity."
      }
    ],
    practicalTips: [
      {
        title: "Implement a confidence-based escalation system",
        description: "Have the agent assess its confidence for each action. High confidence (>0.9): execute automatically. Medium (0.6-0.9): execute with logging. Low (<0.6): require human approval. This balances autonomy with safety."
      },
      {
        title: "Log guardrail triggers, not just blocks",
        description: "When a guardrail fires, log: the input, the guardrail that triggered, the action taken (block/modify/escalate), and the user context. This data helps you tune guardrails -- too many false positives degrade UX, too few miss real threats."
      }
    ]
  },

  "gr-3": {
    resources: [
      {
        title: "Toxicity Detection: A Benchmark for Evaluating Content Moderation",
        url: "https://arxiv.org/abs/2404.09785",
        type: "paper",
        author: "Various",
        year: 2024,
        description: "Benchmark for content moderation systems. Covers toxicity, hate speech, harassment, and misinformation detection. Useful for evaluating your guardrail classifiers."
      },
      {
        title: "Perspective API",
        url: "https://perspectiveapi.com/",
        type: "docs",
        author: "Google Jigsaw",
        year: 2024,
        description: "Free API for detecting toxic content. Returns scores for toxicity, threat, insult, and profanity. Easy to integrate as a guardrail layer."
      },
      {
        title: "OpenAI Moderation API",
        url: "https://platform.openai.com/docs/guides/moderation",
        type: "docs",
        author: "OpenAI",
        year: 2024,
        description: "Free content moderation API. Classifies text into categories: hate, harassment, self-harm, sexual, violence. Can be used as a guardrail even if you're using Claude as your primary model."
      }
    ],
    claudeConnections: [
      {
        title: "Claude's Content Classification",
        description: "Anthropic uses multiple classification layers for content safety: pre-processing classifiers (before Claude sees the input), Claude's own judgment (Constitutional AI), and post-processing classifiers (after Claude generates output). Building a similar multi-layer classification system for your agents ensures robust content safety."
      },
      {
        title: "Claude's Nuanced Content Policy",
        description: "Claude doesn't use binary safe/unsafe classification. It uses nuanced categories: always refuse (CSAM, weapons), contextually refuse (medical advice without disclaimers), allow with caution (controversial topics). This nuanced approach reduces false positives while maintaining safety."
      }
    ],
    practicalTips: [
      {
        title: "Combine multiple moderation APIs",
        description: "Use both Perspective API (free, good at toxicity) and OpenAI Moderation API (free, good at categorization) as guardrail layers. Different APIs catch different things. The combined signal is much stronger than either alone."
      },
      {
        title: "Build domain-specific guardrails",
        description: "Generic toxicity detection misses domain-specific risks. A healthcare agent needs guardrails for: medical advice without disclaimers, drug interactions, emergency situations. A financial agent needs guardrails for: investment advice, unauthorized transactions, regulatory compliance. Build custom classifiers for your domain."
      }
    ]
  },

  // ─── SECURE AI SYSTEMS ───────────────────────────────────────
  "sa-1": {
    resources: [
      {
        title: "Securing LLM Systems Against Prompt Injection",
        url: "https://developer.nvidia.com/blog/securing-llm-systems-against-prompt-injection/",
        type: "blog",
        author: "NVIDIA",
        year: 2024,
        description: "Practical guide to securing LLM systems in production. Covers architecture patterns, input validation, output sanitization, and monitoring. Actionable and engineering-focused."
      },
      {
        title: "NIST AI Risk Management Framework",
        url: "https://www.nist.gov/artificial-intelligence/executive-order-safe-secure-and-trustworthy-artificial-intelligence",
        type: "article",
        author: "NIST",
        year: 2024,
        description: "US government framework for managing AI risks. Covers governance, mapping, measuring, and managing risks. Required reading for enterprise AI deployments."
      },
      {
        title: "The EU AI Act: A Practical Guide",
        url: "https://artificialintelligenceact.eu/",
        type: "article",
        author: "EU",
        year: 2024,
        description: "Guide to the EU AI Act. Classifies AI systems by risk level and defines requirements for each. If your agent serves EU users, you need to comply."
      },
      {
        title: "Anthropic's Safety Research",
        url: "https://www.anthropic.com/research",
        type: "article",
        author: "Anthropic",
        year: 2025,
        description: "Anthropic's published safety research. Covers interpretability, alignment, evaluation, and red-teaming. Understanding this research helps you build safer agents."
      }
    ],
    claudeConnections: [
      {
        title: "Anthropic's Responsible Scaling Policy (RSP)",
        description: "Anthropic's RSP defines AI Safety Levels (ASL-1 through ASL-4) with specific safety requirements at each level. This framework influences how Claude is deployed: more capable versions require more rigorous safety evaluations. For your agents, define similar capability-safety tiers."
      },
      {
        title: "Claude's Trust Architecture",
        description: "Claude's trust model: system prompts are most trusted (developer instructions), user messages are less trusted, and tool results/embedded content are least trusted. This hierarchy is enforced through training. Mirror this trust architecture in your agent's design."
      },
      {
        title: "Anthropic's Interpretability Research",
        description: "Anthropic leads research in understanding what happens inside neural networks (mechanistic interpretability). Their published papers on 'Features' and 'Circuit Analysis' help explain why Claude behaves the way it does. This research informs debugging when agents produce unexpected outputs."
      }
    ],
    practicalTips: [
      {
        title: "Design your agent's trust boundaries",
        description: "Draw a diagram showing: what's trusted (your code, system prompt), what's semi-trusted (authenticated user input), and what's untrusted (external data, tool results, user-uploaded files). Every crossing of a trust boundary needs validation."
      },
      {
        title: "Implement security logging and alerting",
        description: "Log security-relevant events: guardrail triggers, permission escalation attempts, unusual tool usage patterns, and high-volume requests from single users. Set up alerts for anomalies. Security without monitoring is security theater."
      },
      {
        title: "Conduct threat modeling for your agent",
        description: "Use STRIDE (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) adapted for agents: Can users spoof the agent? Can they tamper with tool results? Can they extract private information? Systematic threat modeling finds risks that ad-hoc testing misses."
      }
    ]
  },

  "sa-2": {
    resources: [
      {
        title: "Anthropic's Interpretability Research: Mapping the Mind of Claude",
        url: "https://www.anthropic.com/research/mapping-mind-language-model",
        type: "article",
        author: "Anthropic",
        year: 2024,
        description: "Landmark research identifying 'features' (concepts) inside Claude's neural network. Shows that Claude has internal representations for concepts like 'deception', 'safety', and 'code'. Groundbreaking for AI safety and debugging."
      },
      {
        title: "Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet",
        url: "https://www.anthropic.com/research/mapping-mind-language-model",
        type: "paper",
        author: "Anthropic",
        year: 2024,
        description: "Anthropic's breakthrough in AI interpretability. Found millions of interpretable features in Claude, including features for deception, bias, and safety. This is the cutting edge of understanding how LLMs work internally."
      },
      {
        title: "AI Safety Fundamentals",
        url: "https://aisafetyfundamentals.com/",
        type: "course",
        author: "BlueDot Impact",
        year: 2024,
        description: "Free course on AI safety fundamentals. Covers alignment, interpretability, governance, and technical safety. Good foundation for thinking about secure AI system design."
      },
      {
        title: "Anthropic's Sleeper Agents Paper",
        url: "https://arxiv.org/abs/2401.05566",
        type: "paper",
        author: "Hubinger et al. (Anthropic)",
        year: 2024,
        description: "Showed that LLMs can be trained with hidden behaviors that activate under specific conditions (like a sleeper agent). Standard safety training doesn't remove these behaviors. Critical for understanding supply chain risks in LLM deployment."
      }
    ],
    claudeConnections: [
      {
        title: "Anthropic IS an AI Safety Company",
        description: "Anthropic's primary mission is AI safety research, with Claude as a product that funds the research. Understanding this context explains why Claude has features like Constitutional AI, Extended Thinking transparency, and strong refusal behavior. Every Claude feature is designed with safety as a first-class concern."
      },
      {
        title: "Interpretability for Debugging",
        description: "Anthropic's interpretability research has practical applications: when Claude produces unexpected output, researchers can look at which features activated to understand why. While you can't do this for Claude's internals, you can apply the same principle to your agent: make every decision inspectable and explainable."
      },
      {
        title: "The Sleeper Agent Threat Model",
        description: "Anthropic's sleeper agents paper is relevant to anyone using fine-tuned or open-source models. A model could have hidden behaviors that activate in specific contexts. Mitigation: use models from trusted providers (like Anthropic), implement output monitoring, and don't rely solely on model-level safety."
      }
    ],
    practicalTips: [
      {
        title: "Make your agent's reasoning inspectable",
        description: "Log the full chain of reasoning for every agent action: what was the input? What did the model consider? Which tool did it choose and why? What was the output? Inspectable reasoning is the practical equivalent of interpretability research -- it lets you debug and audit agent behavior."
      },
      {
        title: "Trust but verify: monitor model providers",
        description: "Even when using trusted providers like Anthropic, monitor for behavior changes after model updates. Run your evaluation suite after every model version change. Model updates can subtly change behavior in ways that affect your application."
      },
      {
        title: "Build an incident response plan for AI failures",
        description: "Before deploying, define: What's an AI incident? (harmful output, data leak, prompt injection success) Who gets alerted? What's the immediate response? (kill switch, fallback to human) How do you investigate? Having this plan ready prevents panic when incidents happen."
      }
    ]
  },

  // ─── PRODUCTION GUIDE ────────────────────────────────────────
  "pg-1": {
    resources: [
      {
        title: "Core Views on AI Safety",
        url: "https://www.anthropic.com/research",
        type: "blog",
        author: "Anthropic",
        year: 2024,
        description: "Anthropic's foundational document on their approach to AI safety and responsible development"
      },
      {
        title: "Constitutional AI: Harmlessness from AI Feedback",
        url: "https://arxiv.org/abs/2212.08073",
        type: "paper",
        author: "Bai et al.",
        year: 2022,
        description: "The foundational paper introducing Constitutional AI — how Claude achieves alignment through principles rather than human labeling"
      },
      {
        title: "Claude Model Documentation",
        url: "https://docs.anthropic.com/en/docs/about-claude/models",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Official documentation covering Claude model family, capabilities, context windows, and pricing"
      },
      {
        title: "Emerging Architectures for LLM Applications",
        url: "https://a16z.com/emerging-architectures-for-llm-applications/",
        type: "blog",
        author: "a16z",
        year: 2024,
        description: "Comprehensive overview of production LLM application architectures and emerging patterns"
      }
    ],
    claudeConnections: [
      {
        title: "Claude's Model Family Strategy",
        description: "Claude offers Haiku (fast/cheap), Sonnet (balanced), and Opus (maximum capability) — a textbook production pattern of tiered service levels that lets developers optimize for cost, latency, or quality"
      },
      {
        title: "Constitutional AI as Architecture",
        description: "Claude's alignment is not a bolt-on filter but a training methodology embedded in model weights, making safety a first-class architectural concern rather than an afterthought"
      }
    ],
    practicalTips: [
      {
        title: "Start with Architecture Diagrams",
        description: "Before writing code, draw your production AI system's layered architecture — model, inference, API, product, and safety layers"
      },
      {
        title: "Plan for Model Tiering",
        description: "Design your system to support model routing from day one, even if you start with a single model — switching later is expensive"
      },
      {
        title: "Document the Request Lifecycle",
        description: "Map the full request lifecycle for your team — most production bugs live in the layers between the model and the user"
      }
    ]
  },

  "pg-2": {
    resources: [
      {
        title: "Constitutional AI: Harmlessness from AI Feedback",
        url: "https://arxiv.org/abs/2212.08073",
        type: "paper",
        author: "Bai et al.",
        year: 2022,
        description: "The foundational paper on Constitutional AI — replacing human feedback with principle-based AI self-critique"
      },
      {
        title: "Training a Helpful and Harmless Assistant with RLHF",
        url: "https://arxiv.org/abs/2204.05862",
        type: "paper",
        author: "Anthropic",
        year: 2022,
        description: "Anthropic's research on training AI assistants using reinforcement learning from human feedback"
      },
      {
        title: "Claude's Character",
        url: "https://docs.anthropic.com/en/docs/about-claude/claude-s-character",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Official documentation on Claude's personality traits, values, and behavioral principles"
      },
      {
        title: "Learning to Summarize with Human Feedback",
        url: "https://arxiv.org/abs/2009.01325",
        type: "paper",
        author: "Stiennon et al.",
        year: 2020,
        description: "Foundational RLHF paper that established the reward model training paradigm"
      }
    ],
    claudeConnections: [
      {
        title: "Claude's Constitution",
        description: "Claude is trained on a specific set of principles that govern its behavior — these principles are public and explain why Claude responds the way it does in edge cases"
      },
      {
        title: "RLAIF at Scale",
        description: "Claude uses AI-generated feedback at scale to improve alignment, meaning safety gets better with each iteration without proportionally increasing human labeling costs"
      }
    ],
    practicalTips: [
      {
        title: "Read Anthropic's Published Guidelines",
        description: "Study Claude's character documentation to understand WHY it responds certain ways — this helps you write better system prompts"
      },
      {
        title: "Work WITH Alignment",
        description: "When Claude refuses a request, reframe the use case rather than trying to override safety — alignment is a feature, not a bug"
      },
      {
        title: "Use Alignment as a Product Feature",
        description: "Claude's built-in safety reduces the custom guardrails you need to build — factor this into your architecture planning"
      }
    ]
  },

  "pg-3": {
    resources: [
      {
        title: "Extended Thinking Documentation",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Official guide to using Extended Thinking for complex reasoning tasks with budget control"
      },
      {
        title: "Scaling LLM Test-Time Compute",
        url: "https://arxiv.org/abs/2408.03314",
        type: "paper",
        author: "Snell et al.",
        year: 2024,
        description: "Research showing how additional thinking time at inference improves reasoning quality"
      },
      {
        title: "Inner Monologue: Embodied Reasoning through Planning with Language Models",
        url: "https://arxiv.org/abs/2207.05608",
        type: "paper",
        author: "Huang et al.",
        year: 2022,
        description: "How language models can plan through inner monologue — foundational for agent planning"
      },
      {
        title: "Claude Code Overview",
        url: "https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "How Claude Code implements planning and reasoning in a production coding agent"
      }
    ],
    claudeConnections: [
      {
        title: "Claude Code's Planning Loop",
        description: "Claude Code uses extended thinking to plan multi-file edits — deciding which files to read, what changes to make, and in what order — a real-world production planning system"
      },
      {
        title: "Adaptive Thinking Budgets",
        description: "Claude dynamically adjusts reasoning depth based on task complexity — simple file reads get minimal thinking, complex refactors get maximum budget"
      }
    ],
    practicalTips: [
      {
        title: "Start Small with Thinking Budgets",
        description: "Begin with budget_tokens=4000 and increase only if quality is insufficient — most tasks plateau around 8K-10K tokens"
      },
      {
        title: "Inspect Thinking Traces",
        description: "Log and review thinking traces during development to understand model reasoning and debug planning failures"
      },
      {
        title: "Use Structured Plans",
        description: "Output plans as structured JSON so downstream code can parse and execute them programmatically"
      }
    ]
  },

  "pg-4": {
    resources: [
      {
        title: "Model Context Protocol Introduction",
        url: "https://modelcontextprotocol.io/introduction",
        type: "docs",
        author: "Anthropic",
        year: 2024,
        description: "Official MCP specification — the open standard for connecting AI models to tools and data sources"
      },
      {
        title: "Tool Use Documentation",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Complete guide to implementing function calling with Claude including JSON Schema definitions"
      },
      {
        title: "Computer Use Documentation",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/computer-use",
        type: "docs",
        author: "Anthropic",
        year: 2024,
        description: "How to give Claude the ability to interact with computer interfaces through screenshots and actions"
      },
      {
        title: "Toolformer: Language Models Can Teach Themselves to Use Tools",
        url: "https://arxiv.org/abs/2302.04761",
        type: "paper",
        author: "Schick et al.",
        year: 2023,
        description: "Research on how language models learn to use tools autonomously"
      }
    ],
    claudeConnections: [
      {
        title: "Claude Code as MCP Client",
        description: "Claude Code is the premier MCP client — it discovers and invokes MCP servers automatically, demonstrating the protocol's power in a real coding assistant"
      },
      {
        title: "Computer Use Safety",
        description: "Claude's Computer Use implements multiple safety layers — screenshot verification, action confirmation, restricted system access — showing how to give agents GUI access safely"
      }
    ],
    practicalTips: [
      {
        title: "Write Descriptions for Humans",
        description: "Tool descriptions should read like instructions for a new team member — Claude relies on natural language descriptions to choose the right tool"
      },
      {
        title: "Implement Timeouts",
        description: "Always add timeout and retry logic in tool handlers — production tools fail in unexpected ways"
      },
      {
        title: "Start with MCP",
        description: "Use MCP for new tool integrations — the standardized protocol saves significant effort and enables ecosystem reuse"
      }
    ]
  },

  "pg-5": {
    resources: [
      {
        title: "Anthropic API Documentation",
        url: "https://docs.anthropic.com/en/api/getting-started",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Complete API reference for the Claude Messages API including streaming, batching, and vision"
      },
      {
        title: "Prompt Caching Documentation",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "How to use prompt caching to reduce costs by up to 90% for repetitive workloads"
      },
      {
        title: "Claude Agent SDK",
        url: "https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk/overview",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Build production agents with the official Claude Agent SDK — agent loops, tools, and guardrails"
      },
      {
        title: "Prompt Engineering Guide",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Official best practices for designing effective prompts and system prompts"
      }
    ],
    claudeConnections: [
      {
        title: "Claude Code's Agent Loop",
        description: "Claude Code implements a Read-Plan-Edit-Verify loop with built-in safety checks — Anthropic's vision of what a production coding agent should look like"
      },
      {
        title: "Prompt Caching in Practice",
        description: "Anthropic's prompt caching automatically caches system prompts and long prefixes, reducing costs for applications with repetitive prompt structures by up to 90%"
      }
    ],
    practicalTips: [
      {
        title: "Always Stream Responses",
        description: "Use streaming for all user-facing responses — perceived latency drops dramatically even though total time stays similar"
      },
      {
        title: "Exponential Backoff with Jitter",
        description: "Implement retry logic with exponential backoff AND jitter — simple retry loops cause thundering herd problems at scale"
      },
      {
        title: "Version Your System Prompts",
        description: "Track system prompts in git and record which version produced which outputs — essential for debugging regressions"
      }
    ]
  },

  "pg-6": {
    resources: [
      {
        title: "OWASP Top 10 for LLM Applications",
        url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
        type: "docs",
        author: "OWASP",
        year: 2025,
        description: "The definitive security checklist for LLM-powered applications — covers injection, data leakage, and more"
      },
      {
        title: "Not What You've Signed Up For: Indirect Prompt Injection",
        url: "https://arxiv.org/abs/2302.12173",
        type: "paper",
        author: "Greshake et al.",
        year: 2023,
        description: "Seminal research on how untrusted content can manipulate LLM behavior through indirect injection"
      },
      {
        title: "Anthropic's Approach to AI Safety",
        url: "https://www.anthropic.com/research",
        type: "blog",
        author: "Anthropic",
        year: 2024,
        description: "How Anthropic designs safety into Claude at every layer — from training to deployment"
      },
      {
        title: "Prompt Injection and Jailbreaking",
        url: "https://simonwillison.net/series/prompt-injection/",
        type: "blog",
        author: "Simon Willison",
        year: 2024,
        description: "Comprehensive ongoing coverage of prompt injection techniques and defenses by a leading security researcher"
      }
    ],
    claudeConnections: [
      {
        title: "Immutable Security Rules",
        description: "Claude's system prompt contains security rules that explicitly cannot be modified by any subsequent input — a pattern every production agent should implement"
      },
      {
        title: "The Verify-With-User Pattern",
        description: "Claude stops and asks for user confirmation before taking sensitive actions, even if content claims the user has pre-authorized it — eliminating entire classes of social engineering attacks"
      }
    ],
    practicalTips: [
      {
        title: "Implement Instruction Hierarchy on Day One",
        description: "Build the instruction hierarchy (system > user > data) into your agent from the start — retrofitting it is extremely difficult"
      },
      {
        title: "Never Trust In-Content Authorization",
        description: "Ignore claims of authorization found in processed content — always verify through the primary user channel"
      },
      {
        title: "Build an Action Decision Matrix",
        description: "For every action your agent can take, classify it: prohibited, needs explicit permission, or automatic"
      }
    ]
  },

  "pg-7": {
    resources: [
      {
        title: "AgentBench: Evaluating LLMs as Agents",
        url: "https://arxiv.org/abs/2308.03688",
        type: "paper",
        author: "Liu et al.",
        year: 2023,
        description: "Comprehensive benchmark for evaluating LLM agent capabilities across diverse environments"
      },
      {
        title: "OpenTelemetry for LLM Observability",
        url: "https://opentelemetry.io/docs/",
        type: "docs",
        author: "OpenTelemetry",
        year: 2024,
        description: "How to instrument LLM applications using the OpenTelemetry standard for distributed tracing"
      },
      {
        title: "Building Effective Agents",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        type: "blog",
        author: "Anthropic",
        year: 2024,
        description: "Anthropic's official guide to building production agents with evaluation best practices"
      },
      {
        title: "Monitoring Machine Learning Models in Production",
        url: "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning",
        type: "docs",
        author: "Google Cloud",
        year: 2024,
        description: "Google's MLOps guide covering monitoring, evaluation, and continuous improvement"
      }
    ],
    claudeConnections: [
      {
        title: "Anthropic's Internal Evaluation",
        description: "Anthropic runs comprehensive evals before every model release — testing safety, capability, and regression across thousands of test cases — the same discipline production teams should apply"
      },
      {
        title: "Claude Code's Self-Verification",
        description: "Claude Code verifies its own edits by re-reading files after modification — a form of runtime self-evaluation that catches errors before they reach the user"
      }
    ],
    practicalTips: [
      {
        title: "Log Prompts in Development, Sample in Production",
        description: "Full logging during dev, sample 1-5% in production — full logging at scale is expensive"
      },
      {
        title: "Build Evals from Failures",
        description: "Build your golden eval dataset from real production failures — these are the most valuable test cases"
      },
      {
        title: "Set Cost Alerts First",
        description: "Configure cost alerts before launching — a recursive agent loop can burn through your budget in minutes"
      }
    ]
  },

  "pg-8": {
    resources: [
      {
        title: "Hidden Technical Debt in Machine Learning Systems",
        url: "https://proceedings.neurips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html",
        type: "paper",
        author: "Sculley et al.",
        year: 2015,
        description: "The seminal paper on technical debt in ML systems — still the most relevant framework for AI engineering"
      },
      {
        title: "Continuous Delivery for Machine Learning",
        url: "https://martinfowler.com/articles/cd4ml.html",
        type: "blog",
        author: "ThoughtWorks",
        year: 2024,
        description: "Adapting continuous delivery practices for machine learning and AI systems"
      },
      {
        title: "Anthropic Cookbook",
        url: "https://github.com/anthropics/anthropic-cookbook",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Official code examples and best practices for building with Claude"
      },
      {
        title: "Testing LLM Applications",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/develop-tests",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Anthropic's guide to testing and evaluating LLM-powered applications"
      }
    ],
    claudeConnections: [
      {
        title: "Claude Code's Git Discipline",
        description: "Claude Code follows strict git practices — creating commits only when asked, never force-pushing, investigating hook failures rather than bypassing — modeling engineering discipline for AI systems"
      },
      {
        title: "Anthropic's Red Team Testing",
        description: "Every Claude release undergoes extensive red-team testing — the same practice production teams should adopt for their agents"
      }
    ],
    practicalTips: [
      {
        title: "Treat Prompts as Code",
        description: "Every system prompt change should be a pull request with a mandatory eval run — prompts affect behavior as much as code"
      },
      {
        title: "Build a Prompt Changelog",
        description: "Record what changed in prompts, why, and what eval results showed — essential for debugging regressions"
      },
      {
        title: "Red-Team on Every Deploy",
        description: "Run automated red-team test suites on every deployment — even small prompt changes can open security holes"
      }
    ]
  },

  "pg-9": {
    resources: [
      {
        title: "Batch Processing Documentation",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/batch-processing",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "How to use Claude's Batch API for 50% cost savings on offline workloads"
      },
      {
        title: "Efficiently Scaling Transformer Inference",
        url: "https://arxiv.org/abs/2211.05102",
        type: "paper",
        author: "Pope et al.",
        year: 2023,
        description: "Research on KV caching, batching, and other techniques for efficient LLM inference at scale"
      },
      {
        title: "Rate Limits Documentation",
        url: "https://docs.anthropic.com/en/docs/about-claude/rate-limits",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Understanding and working with Claude API rate limits for production applications"
      },
      {
        title: "Prompt Caching Guide",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Reduce costs by up to 90% with automatic prompt prefix caching"
      }
    ],
    claudeConnections: [
      {
        title: "Anthropic's Prompt Caching",
        description: "Claude's API automatically caches repeated prompt prefixes, enabling dramatic cost savings — a feature designed from real production experience with high-volume applications"
      },
      {
        title: "Batch API for Offline Workloads",
        description: "Anthropic's Batch API provides 50% cost savings for non-real-time workloads, demonstrating how API design can serve different cost profiles"
      }
    ],
    practicalTips: [
      {
        title: "Track Token Usage from Day One",
        description: "Implement per-request token tracking immediately — you cannot optimize what you cannot measure"
      },
      {
        title: "Set Hard Loop Limits",
        description: "Cap agent loop iterations (e.g., max 25 steps) to prevent runaway costs — a single infinite loop can drain your budget"
      },
      {
        title: "Design for Cacheable Prefixes",
        description: "Structure system prompts as static prefixes to maximize cache hits — even small prompt changes can invalidate the cache"
      }
    ]
  },

  "pg-10": {
    resources: [
      {
        title: "Building Effective Agents",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
        type: "blog",
        author: "Anthropic",
        year: 2024,
        description: "Anthropic's official recommendations for building production agents — emphasizing simplicity and composability"
      },
      {
        title: "Claude Code Documentation",
        url: "https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview",
        type: "docs",
        author: "Anthropic",
        year: 2025,
        description: "Complete documentation for Claude Code — a production coding agent showcasing best practices"
      },
      {
        title: "Challenges in Deploying Machine Learning",
        url: "https://arxiv.org/abs/2011.09926",
        type: "paper",
        author: "Paleyes et al.",
        year: 2022,
        description: "Systematic review of challenges in deploying ML systems in production"
      },
      {
        title: "Agent Protocol Specification",
        url: "https://agentprotocol.ai/",
        type: "docs",
        author: "AI Foundation",
        year: 2024,
        description: "Open standard for agent interoperability and communication"
      }
    ],
    claudeConnections: [
      {
        title: "Claude Code's Safety Architecture",
        description: "Claude Code implements action classification (destructive git ops require confirmation), read-before-write verification, and commitment to user intent — a reference architecture for any production agent"
      },
      {
        title: "Building Effective Agents Guide",
        description: "Anthropic published their top recommendations: start simple, use single LLM + tools before multi-agent, invest in tool quality over agent complexity"
      }
    ],
    practicalTips: [
      {
        title: "Start Simple",
        description: "Begin with the simplest architecture that works (single LLM with tools) — add complexity (multi-agent, planning loops) only when proven necessary"
      },
      {
        title: "Build a Failure Mode Catalog",
        description: "List every way your agent can fail and verify you have mitigations for each — this document becomes your most valuable operational reference"
      },
      {
        title: "Launch with Human-in-the-Loop",
        description: "Start with human approval for all write operations, then gradually automate as confidence and evaluation data grow"
      }
    ]
  }
}
