import type { ProviderId } from '../data/types'

interface ModuleContext {
  title: string
  takeaways: string[]
  resourceTitles: string[]
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function buildSystemPrompt(ctx: ModuleContext): string {
  return `You are a concise AI tutor helping data scientists and junior ML engineers learn about "${ctx.title}".

Key concepts from this module:
${ctx.takeaways.map(t => `- ${t}`).join('\n')}

Available resources (cite these when relevant):
${ctx.resourceTitles.map(r => `- ${r}`).join('\n')}

Rules:
- Keep answers under 150 words unless asked for detail
- Use proper technical jargon but explain acronyms on first use
- When relevant, cite specific resources from the list above
- If asked about topics outside this module, briefly answer then suggest exploring the relevant module
- Be practical — give code examples or real-world applications when helpful`
}

async function sendAnthropic(messages: Message[], systemPrompt: string, apiKey: string, onChunk: (text: string) => void) {
  const res = await fetch('/api/anthropic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  })
  await handleSSEStream(res, onChunk, 'anthropic')
}

async function sendOpenAI(messages: Message[], systemPrompt: string, apiKey: string, onChunk: (text: string) => void) {
  const res = await fetch('/api/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 400,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      stream: true,
    }),
  })
  await handleSSEStream(res, onChunk, 'openai')
}

async function sendGemini(messages: Message[], systemPrompt: string, apiKey: string, onChunk: (text: string) => void) {
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const res = await fetch(`/api/gemini?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { maxOutputTokens: 400 },
    }),
  })

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`)
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.'
  onChunk(text)
}

async function sendOllama(messages: Message[], systemPrompt: string, _apiKey: string, onChunk: (text: string) => void) {
  const res = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      stream: true,
    }),
  })

  if (!res.ok) throw new Error('Ollama not running or model not available. Run: ollama pull llama3.2')
  const reader = res.body?.getReader()
  if (!reader) return

  const decoder = new TextDecoder()
  let accumulated = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value, { stream: true })
    for (const line of text.split('\n').filter(Boolean)) {
      try {
        const json = JSON.parse(line)
        if (json.message?.content) {
          accumulated += json.message.content
          onChunk(accumulated)
        }
      } catch { /* skip malformed lines */ }
    }
  }
}

async function sendBackend(messages: Message[], systemPrompt: string, _apiKey: string, onChunk: (text: string) => void) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt, stream: true }),
  })
  await handleSSEStream(res, onChunk, 'anthropic')
}

async function handleSSEStream(res: Response, onChunk: (text: string) => void, format: 'anthropic' | 'openai') {
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API error ${res.status}: ${err.slice(0, 200)}`)
  }

  const reader = res.body?.getReader()
  if (!reader) return

  const decoder = new TextDecoder()
  let accumulated = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') return

      try {
        const json = JSON.parse(data)
        if (format === 'anthropic') {
          if (json.type === 'content_block_delta' && json.delta?.text) {
            accumulated += json.delta.text
            onChunk(accumulated)
          }
        } else {
          const text = json.choices?.[0]?.delta?.content
          if (text) {
            accumulated += text
            onChunk(accumulated)
          }
        }
      } catch { /* skip */ }
    }
  }
}

const senders: Record<ProviderId, typeof sendAnthropic> = {
  anthropic: sendAnthropic,
  openai: sendOpenAI,
  gemini: sendGemini,
  ollama: sendOllama,
  backend: sendBackend,
}

export async function sendTutorMessage(
  provider: ProviderId,
  messages: Message[],
  context: ModuleContext,
  apiKey: string,
  onChunk: (text: string) => void,
): Promise<void> {
  const systemPrompt = buildSystemPrompt(context)
  const recentMessages = messages.slice(-8) // Keep last 4 exchanges
  const sender = senders[provider]
  if (!sender) throw new Error(`Unknown provider: ${provider}`)
  await sender(recentMessages, systemPrompt, apiKey, onChunk)
}
