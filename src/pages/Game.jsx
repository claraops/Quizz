import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext.jsx'
import { useSafeTimer } from '../hooks/useSafeTimer'
import {
  QUESTION_TIME_SECONDS,
  TIMER_INTERVAL_MS,
  NEXT_QUESTION_DELAY_MS,
  BASE_POINTS,
  BONUS_TIME_LIMIT
} from '../constants/constants'
import './Game.css'

export default function Game() {
  const navigate = useNavigate()
  const { playerName, questions } = useQuiz()

  /* -------------------- ÉTATS -------------------- */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS)
  const [answered, setAnswered] = useState(false)
  const [shuffledAnswers, setShuffledAnswers] = useState([])
  const [responseTime, setResponseTime] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(0)

  /* -------------------- REFS -------------------- */
  // Permet d’avoir les valeurs à jour dans les callbacks
  const scoreRef = useRef(score)
  const responseTimeRef = useRef(responseTime)
  const isTransitioningRef = useRef(false)

  // Utilisé dans le bouton "Question suivante"
  // (sinon ReferenceError au clic)
  const timeoutRef = useRef(null)

  /* -------------------- TIMERS SAFE -------------------- */
  const {
    setIntervalSafe,
    setTimeoutSafe,
    clearIntervalSafe,
    clearTimeoutSafe
  } = useSafeTimer()

  /* -------------------- SYNCHRONISATION DES REFS -------------------- */
  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    responseTimeRef.current = responseTime
  }, [responseTime])

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  /* -------------------- MÉLANGE DES RÉPONSES -------------------- */
  const shuffleAnswers = useCallback((question) => {
    if (!question) return []
    return [...question.incorrect_answers, question.correct_answer]
      .sort(() => Math.random() - 0.5)
  }, [])

  /* -------------------- RESET À CHAQUE QUESTION -------------------- */
  useEffect(() => {
    clearIntervalSafe()
    clearTimeoutSafe()
    isTransitioningRef.current = false

    if (currentQuestion) {
      setShuffledAnswers(shuffleAnswers(currentQuestion))
      setTimeLeft(QUESTION_TIME_SECONDS)
      setAnswered(false)
      setSelectedAnswer(null)
      setResponseTime(0)
      setQuestionStartTime(Date.now())
    }
  }, [currentQuestion, shuffleAnswers, clearIntervalSafe, clearTimeoutSafe])

  /* -------------------- CALCUL DES POINTS -------------------- */
  const calculatePoints = useCallback((timeUsed, isCorrect) => {
    if (!isCorrect) return 0
    const bonus = Math.max(0, BONUS_TIME_LIMIT - timeUsed)
    return BASE_POINTS + bonus
  }, [])

  /* -------------------- QUESTION SUIVANTE / FIN -------------------- */
  // ⚠️ Doit être déclaré AVANT scheduleNext
  const goToNextQuestion = useCallback(() => {
    clearIntervalSafe()
    clearTimeoutSafe()

    const currentScore = scoreRef.current
    const avgResponse = responseTimeRef.current

    try {
      sessionStorage.setItem('lastScore', String(currentScore))
      sessionStorage.setItem('lastTotal', String(totalQuestions * BASE_POINTS))
    } catch {}

    setCurrentQuestionIndex(prev => {
      const next = prev + 1
      if (next < totalQuestions) return next

      navigate('/results', {
        state: {
          score: currentScore,
          totalQuestions,
          averageResponseTime: avgResponse
        }
      })
      return prev
    })
  }, [navigate, totalQuestions, clearIntervalSafe, clearTimeoutSafe])

  /* -------------------- TRANSITION QUESTION SUIVANTE -------------------- */
  // ⚠️ Doit être déclaré AVANT handleTimeUp et handleAnswer
  const scheduleNext = useCallback(() => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true

    timeoutRef.current = setTimeoutSafe(() => {
      isTransitioningRef.current = false
      goToNextQuestion()
    }, NEXT_QUESTION_DELAY_MS)
  }, [goToNextQuestion, setTimeoutSafe])

  /* -------------------- TEMPS ÉCOULÉ -------------------- */
  const handleTimeUp = useCallback(() => {
    if (answered) return

    const timeUsed = Math.round((Date.now() - questionStartTime) / 1000)
    setResponseTime(timeUsed)
    setAnswered(true)

    scheduleNext()
  }, [answered, questionStartTime, scheduleNext])

  /* -------------------- TIMER PRINCIPAL -------------------- */
  useEffect(() => {
    if (!currentQuestion || answered) return

    setIntervalSafe(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearIntervalSafe()
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, TIMER_INTERVAL_MS)

    return clearIntervalSafe
  }, [currentQuestion, answered, handleTimeUp, setIntervalSafe, clearIntervalSafe])

  /* -------------------- RÉPONSE DU JOUEUR -------------------- */
  const handleAnswer = useCallback((answer) => {
    if (answered) return

    const timeUsed = Math.round((Date.now() - questionStartTime) / 1000)
    setSelectedAnswer(answer)
    setAnswered(true)
    setResponseTime(timeUsed)

    if (answer === currentQuestion.correct_answer) {
      setScore(prev => {
        const next = prev + calculatePoints(timeUsed, true)
        scoreRef.current = next
        return next
      })
    }

    scheduleNext()
  }, [answered, currentQuestion, questionStartTime, calculatePoints, scheduleNext])

  /* -------------------- LOADING -------------------- */
  if (!currentQuestion || shuffledAnswers.length === 0) {
    return <div className="game-loading"><h2>Chargement...</h2></div>
  }
  /* -------------------- RENDER -------------------- */
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
              
              <button
                type="button"
                className="game-next-btn"
                onClick={() => {
                 
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