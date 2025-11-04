import { useState } from 'react'
import { useQuiz } from '../context/QuizContext.jsx'
import beachImg from '../../images/Beach.jpeg'

export default function Game() {
  const mockQuestions = [
    {
      question: 'QUEL EST LE PLUS GRAND OCÉAN DU MONDE ?',
      choices: ["L'Atlantique", 'Le Pacifique', "L'Arctique", "L'Indien"],
      correctIndex: 1,
    },
    {
      question: 'COMBIEN Y A-T-IL DE CONTINENTS ?',
      choices: ['5', '6', '7', '4'],
      correctIndex: 2,
    },
    {
      question: 'LA TERRE TOURNE AUTOUR...',
      choices: ['De la Lune', 'Du Soleil', 'De Mars', 'De Vénus'],
      correctIndex: 1,
    },
  ]

  const [qIndex, setQIndex] = useState(0)
  const current = mockQuestions[qIndex]
  const total = mockQuestions.length
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [score, setScore] = useState(0)
  const { playerName } = useQuiz()

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.container}>
          <header style={styles.header}>
            <div style={styles.title}>QUIZ</div>
            <div style={styles.progress}>Question {qIndex + 1} / {total}</div>
            <div style={styles.playerBox}>
              <div style={styles.playerName}>{playerName || 'Joueur'}</div>
              <div style={styles.playerScore}>Score: {score}</div>
            </div>
          </header>

          <section style={styles.questionRow}>
            <div style={styles.questionCard}>
              <div style={styles.questionText}>{current.question}</div>
            </div>
          </section>

          <section style={styles.answersGrid}>
            {current.choices.map((label, idx) => {
              const isSelected = selectedIdx === idx
              const isCorrect = idx === current.correctIndex
              const hasAnswered = selectedIdx !== null
              let cardStyle = { ...styles.answerCard }
              let badgeStyle = { ...styles.answerBadge }
              let labelStyle = { ...styles.answerLabel }

              // Forcer la couleur de bordure par défaut (bleu) pour toutes les ardoises
              cardStyle = { ...cardStyle, borderColor: '#2b64ff' }
              badgeStyle = { ...badgeStyle, borderColor: '#2b64ff' }

              if (hasAnswered) {
                if (isCorrect) {
                  cardStyle = { ...cardStyle, ...styles.answerCorrect }
                  badgeStyle = { ...badgeStyle, ...styles.badgeCorrect }
                  labelStyle = { ...labelStyle, ...styles.labelStrong }
                } else if (isSelected) {
                  cardStyle = { ...cardStyle, ...styles.answerWrong }
                  badgeStyle = { ...badgeStyle, ...styles.badgeWrong }
                }
              }

              return (
                <div
                  key={idx}
                  role="button"
                  tabIndex={0}
                  onClick={() => { if (!hasAnswered) setSelectedIdx(idx) }}
                  style={{
                    ...cardStyle,
                    pointerEvents: hasAnswered ? 'none' : 'auto',
                  }}
                >
                  <span style={badgeStyle}>{String.fromCharCode(65 + idx)}</span>
                  <span style={labelStyle}>{label}</span>
                </div>
              )
            })}
          </section>

          <footer style={styles.footer}>
            <button
              type="button"
              style={{ ...styles.nextBtn, ...(selectedIdx === null ? styles.nextBtnDisabled : {}) }}
              disabled={selectedIdx === null}
              onClick={() => {
                if (selectedIdx === current.correctIndex) setScore((s) => s + 1)
                if (qIndex < total - 1) {
                  setQIndex((i) => i + 1)
                  setSelectedIdx(null)
                } else {
                  setQIndex(0)
                  setSelectedIdx(null)
                  setScore(0)
                }
              }}
            >
              Suivant
            </button>
          </footer>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    position: 'fixed',
    inset: 0,
    height: '100dvh',
    width: '100%',
    backgroundImage: `url(${beachImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
  },
  overlay: {
    flex: 1,
    background: 'rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  container: {
    width: '100%',
    maxWidth: '1100px',
    position: 'relative',
    display: 'grid',
    gridTemplateRows: 'auto auto 1fr auto',
    gap: '20px',
  },
  header: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Bangers, system-ui',
    fontSize: '64px',
    color: '#ffe27a',
    textShadow: '0 4px 0 #1a1a1a',
    letterSpacing: '2px',
  },
  progress: {
    fontFamily: 'Press Start 2P, system-ui',
    fontSize: '14px',
    color: '#ffffff',
    padding: '10px 14px',
    borderRadius: '12px',
    background: 'rgba(0,0,0,0.35)',
    border: '2px solid rgba(255,255,255,0.35)',
    position: 'fixed',
    top: 24,
    right: 24,
    zIndex: 5
  },
  playerBox: {
    position: 'fixed',
    top: 24,
    left: 24,
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '18px',
    background: '#ffffff',
    border: '6px solid #2b64ff',
    color: '#1a1a1a',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
  },
  playerName: {
    fontFamily: 'Bangers, system-ui',
    fontSize: '28px',
    color: '#ffe27a',
    textShadow: '0 3px 0 #1a1a1a',
    letterSpacing: '2px',
  },
  playerScore: {
    fontFamily: 'Press Start 2P, system-ui',
    fontSize: '14px',
    color: '#1a1a1a'
  },
  questionRow: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    marginTop: '-10px',
  },
  questionCard: {
    background: '#ffffff',
    border: '6px solid #2b64ff',
    borderRadius: '20px',
    padding: '20px 28px',
    color: '#1a1a1a',
    maxWidth: '720px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
  },
  questionText: {
    fontFamily: 'Bangers, system-ui',
    fontSize: '36px',
    lineHeight: 1.1,
    textAlign: 'left',
  },
  answersGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '28px',
    rowGap: '28px',
    marginTop: '12px',
  },
  answerCard: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '32px 24px 28px',
    background: '#ffffff',
    border: '8px solid #2b64ff',
    borderRadius: '24px',
    color: '#1a1a1a',
    cursor: 'pointer',
    transition: 'transform 0.06s ease-out, box-shadow 0.2s ease',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    minHeight: '96px',
    outline: 'none'
  },
  answerSelected: {
    boxShadow: '0 0 0 4px rgba(255,154,60,0.8) inset, 0 8px 24px rgba(0,0,0,0.25)'
  },
  answerCorrect: {
    borderColor: '#1ac05e',
    boxShadow: '0 0 0 4px rgba(26,192,94,0.6) inset, 0 8px 24px rgba(0,0,0,0.25)'
  },
  answerWrong: {
    borderColor: '#ff3b30',
    boxShadow: '0 0 0 4px rgba(255,59,48,0.5) inset, 0 8px 24px rgba(0,0,0,0.25)'
  },
  answerBadge: {
    fontFamily: 'Patrick Hand, system-ui',
    fontSize: '24px',
    color: '#1a1a1a',
    background: '#ffffff',
    border: '6px solid #2b64ff',
    borderRadius: '999px',
    width: '48px',
    height: '48px',
    display: 'grid',
    placeItems: 'center',
    position: 'absolute',
    top: '-30px',
    left: '50%',
    transform: 'translateX(-50%)',
    boxShadow: '0 3px 0 rgba(0,0,0,0.08)'
  },
  badgeCorrect: {
    borderColor: '#1ac05e',
  },
  badgeWrong: {
    borderColor: '#ff3b30',
  },
  answerLabel: {
    fontFamily: 'Patrick Hand, system-ui',
    fontSize: '28px',
    letterSpacing: '0.5px',
    textShadow: '0 2px 0 rgba(0,0,0,0.1)'
  },
  labelStrong: {
    fontWeight: 700,
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
  },
  nextBtn: {
    padding: '16px 22px',
    borderRadius: '14px',
    border: 0,
    background: 'linear-gradient(180deg, #ff9a3c 0%, #ff6a00 100%)',
    color: '#1a1a1a',
    fontFamily: 'Press Start 2P, system-ui',
    fontSize: '14px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxShadow: '0 6px 0 #8c3d00',
  },
  nextBtnDisabled: {
    filter: 'grayscale(0.6) brightness(0.9)',
    cursor: 'not-allowed',
    opacity: 0.8
  }
}
