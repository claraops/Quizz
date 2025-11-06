import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext.jsx'
import beachImg from '../../images/Beach.jpeg'

export default function Results() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { playerName } = useQuiz()

  const score = Number(params.get('score') ?? sessionStorage.getItem('lastScore') ?? 0)
  const total = Number(params.get('total') ?? sessionStorage.getItem('lastTotal') ?? 0)

  const ratio = total > 0 ? score / total : 0
  const percent = Math.round(ratio * 100)
  const message = useMemo(() => {
    if (ratio >= 0.9) return 'BRAVO !'
    if (ratio >= 0.7) return 'SUPER !'
    if (ratio >= 0.5) return 'BON ESSAI !'
    return 'TU PEUX MIEUX FAIRE !'
  }, [ratio])
  const emoji = useMemo(() => {
    if (ratio >= 0.8) return '🏆' // excellent
    if (ratio >= 0.5) return '🙂' // moyen
    return '💪' // à améliorer
  }, [ratio])

  function handleReplay() {
    navigate('/')
  }

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.title}>{emoji} RÉSULTATS</h1>
          <div style={styles.name}>{playerName || 'Joueur'}</div>

          <div style={styles.scoreBox}>
            <div style={styles.scoreNum}>{score}</div>
            <div style={styles.scoreTotal}>/ {total || '?'} pts</div>
          </div>

          <div style={styles.percent}>{percent}%</div>

          <div style={styles.progressWrap} aria-hidden>
            <div style={styles.progressTrack}>
              <div style={{
                ...styles.progressFill,
                width: `${percent}%`,
                background: ratio >= 0.9
                  ? 'linear-gradient(90deg, #1ac05e, #31d67a)'
                  : ratio >= 0.7
                  ? 'linear-gradient(90deg, #ffd37a, #ffb347)'
                  : ratio >= 0.5
                  ? 'linear-gradient(90deg, #7ab8ff, #5aa0ff)'
                  : 'linear-gradient(90deg, #ff7a7a, #ff3b30)'
              }} />
            </div>
          </div>

          <div style={styles.message}>{message}</div>

          <div style={styles.buttonsRow}>
            <button style={styles.button} onClick={handleReplay}>Rejouer</button>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => navigate('/')}>Accueil</button>
          </div>

          
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
    background: 'rgba(0,0,0,0.28)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '700px',
    background: 'rgba(0,0,0,0.35)',
    border: '2px solid rgba(255,255,255,0.45)',
    borderRadius: '16px',
    backdropFilter: 'blur(6px)',
    padding: '32px',
    color: '#fff',
    position: 'relative',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)'
  },
  title: {
    fontFamily: 'Bangers, system-ui',
    fontSize: '72px',
    color: '#ffe27a',
    textShadow: '0 4px 0 #1a1a1a, 0 0 18px rgba(255,226,122,0.6)',
    margin: '0 0 8px',
    letterSpacing: '2px'
  },
  name: {
    fontFamily: 'Press Start 2P, system-ui',
    fontSize: '14px',
    color: '#ffffff',
    opacity: 0.98,
    marginBottom: '18px',
    display: 'inline-block',
    padding: '8px 12px',
    borderRadius: '12px',
    background: 'rgba(0,0,0,0.35)',
    border: '2px solid rgba(255,255,255,0.45)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06)'
  },
  scoreBox: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '6px'
  },
  scoreNum: {
    fontFamily: 'Bangers, system-ui',
    fontSize: '64px',
    color: '#ffffff',
    textShadow: '0 6px 0 #1a1a1a, 0 0 18px rgba(255,255,255,0.4)',
    width: '140px',
    height: '140px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '999px',
    background: 'radial-gradient(100% 100% at 50% 0%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.35) 100%)',
    border: '6px solid rgba(255,255,255,0.45)',
    boxShadow: '0 14px 36px rgba(0,0,0,0.45), inset 0 6px 16px rgba(0,0,0,0.35)'
  },
  scoreTotal: {
    fontFamily: 'Press Start 2P, system-ui',
    fontSize: '14px',
    marginBottom: '18px'
  },
  percent: {
    marginTop: '6px',
    fontFamily: 'Press Start 2P, system-ui',
    fontSize: '12px',
    color: '#ffffff',
    textShadow: '0 2px 0 #1a1a1a',
    opacity: 0.95
  },
  progressWrap: {
    marginTop: '14px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  progressTrack: {
    width: '80%',
    maxWidth: '520px',
    height: '14px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.18)',
    border: '2px solid rgba(255,255,255,0.45)',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.25)'
  },
  progressFill: {
    height: '100%',
    width: '0%',
    borderRadius: '999px 0 0 999px',
    transition: 'width 300ms ease'
  },
  message: {
    marginTop: '8px',
    fontFamily: 'Patrick Hand, system-ui',
    fontSize: '32px',
    color: '#ffffff',
  },
  buttonsRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '24px'
  },
  button: {
    padding: '16px 22px',
    borderRadius: '14px',
    border: 0,
    background: 'linear-gradient(180deg, #ff9a3c 0%, #ff6a00 100%)',
    color: '#1a1a1a',
    fontFamily: 'Press Start 2P, system-ui',
    fontSize: '14px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxShadow: '0 6px 0 #8c3d00'
  },
  buttonSecondary: {
    background: 'linear-gradient(180deg, #e0e0e0 0%, #cfcfcf 100%)',
    boxShadow: '0 6px 0 #7a7a7a'
  },
  
}


