import { useLocation } from 'react-router-dom'
import { TRACKS } from '../data/tracks'
import { MODULE_ENRICHMENTS } from '../data/module-enrichments'

export function useCurrentModule() {
  const { pathname } = useLocation()
  const match = pathname.match(/\/tracks\/([^/]+)\/modules\/([^/]+)/)

  if (!match) return { track: null, module: null, enrichment: null, isModulePage: false }

  const track = TRACKS.find(t => t.id === match[1])
  const module = track?.modules.find(m => m.id === match[2])
  const enrichment = module ? MODULE_ENRICHMENTS[module.id] : null

  return {
    track: track ?? null,
    module: module ?? null,
    enrichment: enrichment ?? null,
    isModulePage: !!module,
  }
}
