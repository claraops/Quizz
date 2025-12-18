import { createContext, useContext, useMemo, useState, useEffect } from 'react'

const QuizContext = createContext(null)

export function QuizProvider({ children }) {
  const [playerName, setPlayerName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

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

  
  const fetchQuestions = async () => {
    if (!categoryId || !difficulty) {
      console.error('Category or difficulty missing')
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=multiple`
      )
      const data = await response.json()
      console.log('Questions reçues:', data.results)
      setQuestions(data.results || [])
    } catch (error) {
      console.error('Erreur API:', error)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const value = useMemo(
    () => ({ 
      playerName, 
      setPlayerName, 
      categoryId, 
      setCategoryId, 
      difficulty, 
      setDifficulty,
      questions, 
      setQuestions,
      loading, 
      fetchQuestions 
    }),
    [playerName, categoryId, difficulty, questions, loading]
  )

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}
/*** ** REFZIRE LE RENOMMAGE DE VARIABLE**** */
export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider')
  return ctx
}