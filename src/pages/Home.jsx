import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext.jsx'
import beachImg from '../../images/Beach.jpeg'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const { 
    playerName, setPlayerName, 
    categoryId, setCategoryId, 
    difficulty, setDifficulty,
    questions,
    fetchQuestions, loading 
  } = useQuiz()

  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await fetch('https://opentdb.com/api_category.php')
        const data = await response.json()
        setCategories(data.trivia_categories)
      } catch (error) {
        console.error('Erreur récupération catégories:', error)
      }
    }
    getCategories()
  }, [])

  const canStart = useMemo(() => {
    return playerName.trim().length > 0 && categoryId && difficulty
  }, [playerName, categoryId, difficulty])

  async function handleStart(e) {
    e.preventDefault()
    if (!canStart) return
    
    await fetchQuestions()
    navigate('/game')
  }

  return (
    <div className="home-page">
      <div className="home-overlay">
        <div className="home-card">
          <h1 className="home-title">QUIZ ARENA</h1>
          <form onSubmit={handleStart} className="home-form">
            <label className="home-label">
              Nom du joueur
              <input
                className="home-input"
                type="text"
                placeholder="Entre ton nom"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </label>

            <label className="home-label">
              Catégorie
              <select
                className="home-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">-- Choisir une catégorie --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            <label className="home-label">
              Difficulté
              <select
                className="home-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">-- Choisir la difficulté --</option>
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </label>

            <button 
              type="submit" 
              disabled={!canStart || loading} 
              className={`home-button ${!canStart || loading ? 'home-button-disabled' : ''}`}
            >
              {loading ? 'Chargement...' : 'Commencer le quiz'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}