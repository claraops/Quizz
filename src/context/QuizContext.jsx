import { createContext, useContext, useMemo, useState, useEffect } from 'react'

const QuizContext = createContext(null)

export function QuizProvider({ children }) {
  const [playerName, setPlayerName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [difficulty, setDifficulty] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('quiz-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setPlayerName(parsed.playerName || '')
        setCategoryId(parsed.categoryId || '')
        setDifficulty(parsed.difficulty || '')
      } catch {}
    }
  }, [])

  useEffect(() => {
    const payload = { playerName, categoryId, difficulty }
    localStorage.setItem('quiz-settings', JSON.stringify(payload))
  }, [playerName, categoryId, difficulty])

  const value = useMemo(
    () => ({ playerName, setPlayerName, categoryId, setCategoryId, difficulty, setDifficulty }),
    [playerName, categoryId, difficulty]
  )

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider')
  return ctx
}


