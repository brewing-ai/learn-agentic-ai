import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useTutor } from '../../context/TutorContext'
import { TutorFab } from './TutorFab'
import { TutorPanel } from './TutorPanel'

export function TutorBot() {
  const { state, toggleOpen } = useTutor()

  // Keyboard shortcut: Cmd+. / Ctrl+.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        toggleOpen()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleOpen])

  return (
    <AnimatePresence mode="wait">
      {state.isOpen ? <TutorPanel key="panel" /> : <TutorFab key="fab" />}
    </AnimatePresence>
  )
}
