import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext.jsx'
import './Game.css'

export default function Game() {
  const navigate = useNavigate()
  const { playerName, questions } = useQuiz()
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [answered, setAnswered] = useState(false)
  const [shuffledAnswers, setShuffledAnswers] = useState([])
  const [responseTime, setResponseTime] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(0)

  // refs pour éviter les closures avec des valeurs obsolètes
  const scoreRef = useRef(score)
  const responseTimeRef = useRef(responseTime)
  const isTransitioningRef = useRef(false)
  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)

  // garder refs synchronisées
  useEffect(() => { scoreRef.current = score }, [score])
  useEffect(() => { responseTimeRef.current = responseTime }, [responseTime])

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  const shuffleAnswers = useCallback((question) => {
    if (!question) return []
    const allAnswers = [
      ...question.incorrect_answers,
      question.correct_answer
    ]
    return [...allAnswers].sort(() => Math.random() - 0.5)
  }, [])

  
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      isTransitioningRef.current = false
    }

    if (currentQuestion) {
      setShuffledAnswers(shuffleAnswers(currentQuestion))
      setTimeLeft(10)
      setAnswered(false)
      setSelectedAnswer(null)
      setResponseTime(0)
      setQuestionStartTime(Date.now())
      isTransitioningRef.current = false
    }
  }, [currentQuestion, shuffleAnswers])

  
  useEffect(() => {
    if (!currentQuestion || answered) return

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
        
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    
  }, [currentQuestion, answered]) 
  const calculatePoints = useCallback((timeUsed, isCorrect) => {
    if (!isCorrect) return 0
    const basePoints = 10
    const timeBonus = Math.max(0, 10 - timeUsed)
    return basePoints + timeBonus
  }, [])

  /* Planifier la transition vers la question suivante de façon sûre (évite doublons)*/
  const scheduleNext = useCallback((delay = 1500) => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true

   
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null
      isTransitioningRef.current = false
      goToNextQuestion()
    }, delay)
  }, []) 

  const handleTimeUp = useCallback(() => {
    if (answered) return
    const endTime = Date.now()
    const timeUsed = Math.round((endTime - questionStartTime) / 1000)
    setResponseTime(timeUsed)
    setAnswered(true)
    
    scheduleNext(1500)
    
  }, [answered, questionStartTime, scheduleNext])

  const handleAnswer = useCallback((answer) => {
    if (answered) return
    const endTime = Date.now()
    const timeUsed = Math.round((endTime - questionStartTime) / 1000)

    setSelectedAnswer(answer)
    setAnswered(true)
    setResponseTime(timeUsed)

    const isCorrect = answer === currentQuestion.correct_answer
    if (isCorrect) {
      const pointsEarned = calculatePoints(timeUsed, isCorrect)
      setScore(prev => {
        const next = prev + pointsEarned
        
        scoreRef.current = next
        return next
      })
    }

   
    scheduleNext(1500)
   
  }, [answered, currentQuestion, questionStartTime, calculatePoints, scheduleNext])

  
  const goToNextQuestion = useCallback(() => {
    
    const currentScore = scoreRef.current
    const avgResponse = responseTimeRef.current

    
    try {
      sessionStorage.setItem('lastScore', String(currentScore))
      sessionStorage.setItem('lastTotal', String(totalQuestions * 10))
    } catch (e) {
      // ignore storage errors
    }

    setCurrentQuestionIndex(prevIndex => {
      const nextIndex = prevIndex + 1

      if (nextIndex < totalQuestions) {
        
        return nextIndex
      } else {
        
        navigate('/results', {
          state: {
            score: currentScore,
            totalQuestions,
            averageResponseTime: avgResponse
          }
        })
        
        return prevIndex
      }
    })

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    isTransitioningRef.current = false
  
  }, [navigate, totalQuestions])

  
  if (!currentQuestion || shuffledAnswers.length === 0) {
    return (
      <div className="game-loading">
        <h2>Chargement des questions...</h2>
      </div>
    )
  }

  return (
    <div className="game-page">
      <div className="game-overlay">
        <div className="game-container">
          <header className="game-header">
            <div className="game-title">QUIZ</div>
            <div className="game-progress">
              Question {currentQuestionIndex + 1} / {totalQuestions}
            </div>
            <div className="game-player-box">
              <div className="game-player-name">{playerName || 'Joueur'}</div>
            </div>
          </header>

          <section className="game-question-row">
            <div className="game-question-card">
              <div 
                className="game-question-text"
                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
              />
            </div>
          </section>

          <section className="game-answers-grid">
            {shuffledAnswers.map((answer, index) => {
              const isSelected = selectedAnswer === answer
              const isCorrect = answer === currentQuestion.correct_answer
              const showResults = answered
              
              let answerClass = 'game-answer-card'
              if (showResults) {
                if (isCorrect) answerClass += ' game-answer-correct'
                else if (isSelected && !isCorrect) answerClass += ' game-answer-wrong'
                else answerClass += ' game-answer-disabled'
              }

              return (
                <div
                  key={`answer-${currentQuestionIndex}-${index}`}
                  className={answerClass}
                  onClick={() => handleAnswer(answer)}
                  style={{ pointerEvents: answered ? 'none' : 'auto' }}
                >
                  <span className="game-answer-badge">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span 
                    className="game-answer-label"
                    dangerouslySetInnerHTML={{ __html: answer }}
                  />
                </div>
              )
            })}
          </section>

          {answered && (
            <footer className="game-footer">
              <div className="game-feedback">
                {selectedAnswer === currentQuestion.correct_answer ? (
                  <div className="feedback-correct">
                    Correct ! Temps: {responseTime}s - Score: +{calculatePoints(responseTime, true)} points
                  </div>
                ) : (
                  <div className="feedback-incorrect">
                    Incorrect ! La bonne réponse était: {currentQuestion.correct_answer}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="game-next-btn"
                onClick={() => {
                  // annuler le timeout si l'utilisateur clique manuellement
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                    timeoutRef.current = null
                    isTransitioningRef.current = false
                  }
                  goToNextQuestion()
                }}
              >
                {currentQuestionIndex + 1 < totalQuestions ? 'Question Suivante →' : 'Voir les Résultats'}
              </button>
            </footer>
          )}

          {/* Barre de progression du temps */}
          <div className="time-progress-container">
            <div 
              className="time-progress-bar"
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}



