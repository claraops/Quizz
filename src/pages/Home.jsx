import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext.jsx'
import beachImg from '../../images/Beach.jpeg'

export default function Home() {
  const navigate = useNavigate()
  const { playerName, setPlayerName, categoryId, setCategoryId, difficulty, setDifficulty } = useQuiz()

  const categories = [
    { id: '9', name: 'Culture Générale' },
    { id: '17', name: 'Science & Nature' },
    { id: '23', name: 'Histoire' },
    { id: '21', name: 'Sports' },
  ]

  const canStart = useMemo(() => {
    return playerName.trim().length > 0 && categoryId && difficulty
  }, [playerName, categoryId, difficulty])

  function handleStart(e) {
    e.preventDefault()
    if (!canStart) return
    navigate('/game')
  }

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.title}>QUIZ ARENA</h1>
          <form onSubmit={handleStart} style={styles.form}>
            <label style={styles.label}>
              Nom du joueur
              <input
                style={styles.input}
                type="text"
                placeholder="Entre ton nom"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </label>

            <label style={styles.label}>
              Catégorie
              <select
                style={styles.select}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">-- Choisir une catégorie --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            <label style={styles.label}>
              Difficulté
              <select
                style={styles.select}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">-- Choisir la difficulté --</option>
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </label>

            <button type="submit" disabled={!canStart} style={{ ...styles.button, ...(canStart ? {} : styles.buttonDisabled) }}>
              Commencer le quiz
            </button>
          </form>
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
  card: {
    width: '100%',
    maxWidth: '680px',
    background: 'rgba(255,255,255,0.1)',
    border: '2px solid rgba(255,255,255,0.35)',
    borderRadius: '16px',
    backdropFilter: 'blur(6px)',
    padding: '36px',
    color: '#fff',
    boxShadow: '0 12px 40px rgba(0,0,0,0.35)'
  },
  title: {
    fontFamily: 'Bangers, system-ui',
    letterSpacing: '2px',
    textAlign: 'center',
    fontSize: '72px',
    margin: '8px 0 28px',
    color: '#ffe27a',
    textShadow: '0 4px 0 #1a1a1a'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  label: {
    fontFamily: 'Press Start 2P, system-ui',
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    textShadow: '0 2px 0 rgba(0,0,0,0.6)'
  },
  input: {
    padding: '16px 16px',
    borderRadius: '12px',
    border: '2px solid rgba(255,255,255,0.35)',
    background: 'rgba(0,0,0,0.35)',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none'
  },
  select: {
    padding: '16px 16px',
    borderRadius: '12px',
    border: '2px solid rgba(255,255,255,0.35)',
    background: 'rgba(0,0,0,0.35)',
    color: '#ffffff',
    fontSize: '16px',
    outline: 'none'
  },
  button: {
    marginTop: '12px',
    padding: '18px 22px',
    borderRadius: '14px',
    border: '0',
    background: 'linear-gradient(180deg, #ff9a3c 0%, #ff6a00 100%)',
    color: '#1a1a1a',
    fontFamily: 'Press Start 2P, system-ui',
    fontSize: '14px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxShadow: '0 6px 0 #8c3d00',
    transition: 'transform 0.1s ease-out'
  },
  buttonDisabled: {
    filter: 'grayscale(0.6) brightness(0.8)',
    cursor: 'not-allowed'
  },
  
}


