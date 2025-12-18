import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext.jsx'
import beachImg from '../../images/Beach.jpeg'
import './Results.css'

export default function Results() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { playerName } = useQuiz()

  const score = Number(params.get('score') ?? sessionStorage.getItem('lastScore') ?? 0)
  const total = Number(params.get('total') ?? sessionStorage.getItem('lastTotal') ?? 0)

  const scoreRatio = total > 0 ? score / total : 0
  const percentage = Math.round(scoreRatio * 100)
  const message = useMemo(() => {
    if (scoreRatio >= 0.9) return 'BRAVO !'
    if (scoreRatio >= 0.7) return 'SUPER !'
    if (scoreRatio >= 0.5) return 'BON ESSAI !'
    return 'TU PEUX MIEUX FAIRE !'
  }, [scoreRatio])
  const emoji = useMemo(() => {
    if (scoreRatio >= 0.8) return '🏆'
    if (scoreRatio >= 0.5) return '🙂'
    return '💪'
  }, [scoreRatio])

  function handleReplay() {
    navigate('/')
  }

  return (
    <div className="results-page">
      <div className="results-overlay">
        <div className="results-card">
          <h1 className="results-title">{emoji} RÉSULTATS</h1>
          <div className="player-name">{playerName || 'Joueur'}</div>

          <div className="score-box">
            <div className="score-num">{score}</div>
            <div className="score-total">/ {total || '?'} pts</div>
          </div>

          <div className="percent">{percentage}%</div>

          <div className="progress-wrap" aria-hidden>
            <div className="progress-track">
              <div 
                className="progress-fill"
                style={{
                  width: `${percentage}%`,
                  background: scoreRatio >= 0.9
                    ? 'linear-gradient(90deg, #1ac05e, #31d67a)'
                    : scoreRatio >= 0.7
                    ? 'linear-gradient(90deg, #ffd37a, #ffb347)'
                    : scoreRatio >= 0.5
                    ? 'linear-gradient(90deg, #7ab8ff, #5aa0ff)'
                    : 'linear-gradient(90deg, #ff7a7a, #ff3b30)'
                }}
              />
            </div>
          </div>

          <div className="message">{message}</div>

          <div className="buttons-row">
            <button className="button primary" onClick={handleReplay}>Rejouer</button>
            <button className="button secondary" onClick={() => navigate('/')}>Accueil</button>
          </div>
        </div>
      </div>
    </div>
  )
}










/*import { useLocation, useNavigate } from 'react-router-dom'
import './Results.css'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { score = 0, totalQuestions = 0 } = location.state || {}

  const calculatePercentage = () => {
    return totalQuestions > 0 ? Math.round((score / (totalQuestions * 10)) * 100) : 0
  }

  const getMessage = () => {
    const percentage = calculatePercentage()
    if (percentage >= 90) return "Excellent ! 🎉"
    if (percentage >= 70) return "Très bien ! 👍"
    if (percentage >= 50) return "Pas mal ! 😊"
    return "Peut mieux faire ! 💪"
  }

  return (
    <div className="results-page">
      <div className="results-overlay">
        <div className="results-card">
          <h1 className="results-title">RÉSULTATS</h1>
          
          <div className="results-score">
            <div className="results-percentage">{calculatePercentage()}%</div>
            <div className="results-points">{score} points</div>
            <div className="results-message">{getMessage()}</div>
          </div>

          <div className="results-details">
            <p>Score final: <strong>{score}</strong> points</p>
            <p>Nombre de questions: <strong>{totalQuestions}</strong></p>
            <p>Score maximum possible: <strong>{totalQuestions * 10}</strong> points</p>
          </div>

          <div className="results-actions">
            <button 
              className="results-button"
              onClick={() => navigate('/')}
            >
              Nouveau Quiz
            </button>
            <button 
              className="results-button secondary"
              onClick={() => navigate('/game')}
            >
              Rejouer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}*/