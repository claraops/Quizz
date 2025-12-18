import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext.jsx'
import { useQuizSession } from '../hooks/useQuizSession.js'
import './Results.css'

export default function Results() {
  const navigate = useNavigate()
  const { playerName } = useQuiz()
  const { getScore } = useQuizSession()

  // Utilisation du hook pour récupérer le score de manière centralisée
  const { score, total } = getScore()

  const ratio = total > 0 ? score / total : 0
  const percent = Math.round(ratio * 100)
  const message = useMemo(() => {
    if (ratio >= 0.9) return 'BRAVO !'
    if (ratio >= 0.7) return 'SUPER !'
    if (ratio >= 0.5) return 'BON ESSAI !'
    return 'TU PEUX MIEUX FAIRE !'
  }, [ratio])
  const emoji = useMemo(() => {
    if (ratio >= 0.8) return '🏆'
    if (ratio >= 0.5) return '🙂'
    return '💪'
  }, [ratio])

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

          <div className="percent">{percent}%</div>

          <div className="progress-wrap" aria-hidden>
            <div className="progress-track">
              <div 
                className="progress-fill"
                style={{
                  width: `${percent}%`,
                  background: ratio >= 0.9
                    ? 'linear-gradient(90deg, #1ac05e, #31d67a)'
                    : ratio >= 0.7
                    ? 'linear-gradient(90deg, #ffd37a, #ffb347)'
                    : ratio >= 0.5
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







