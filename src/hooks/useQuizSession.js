import { useCallback } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'

const STORAGE_KEYS = {
  SCORE: 'lastScore',
  TOTAL: 'lastTotal'
}

/**
 * Hook personnalisé pour gérer la session de quiz
 * Centralise la logique de sauvegarde et récupération des résultats
 */
export function useQuizSession() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  /**
   * Sauvegarde le score dans sessionStorage
   */
  const saveScore = useCallback((score, totalQuestions) => {
    try {
      const totalPoints = totalQuestions * 10
      sessionStorage.setItem(STORAGE_KEYS.SCORE, String(score))
      sessionStorage.setItem(STORAGE_KEYS.TOTAL, String(totalPoints))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du score:', error)
    }
  }, [])

  /**
   * Récupère le score depuis les paramètres de navigation, URL ou sessionStorage
   */
  const getScore = useCallback(() => {
    // Priorité 1: State de navigation (passé via navigate)
    const stateScore = location.state?.score
    const stateTotal = location.state?.totalQuestions
    
    if (stateScore !== undefined && stateTotal !== undefined) {
      return {
        score: Number(stateScore),
        total: Number(stateTotal) * 10
      }
    }

    // Priorité 2: Paramètres d'URL
    const urlScore = searchParams.get('score')
    const urlTotal = searchParams.get('total')
    
    if (urlScore !== null && urlTotal !== null) {
      return {
        score: Number(urlScore),
        total: Number(urlTotal)
      }
    }

    // Priorité 3: SessionStorage (fallback)
    try {
      const storedScore = sessionStorage.getItem(STORAGE_KEYS.SCORE)
      const storedTotal = sessionStorage.getItem(STORAGE_KEYS.TOTAL)
      
      return {
        score: Number(storedScore ?? 0),
        total: Number(storedTotal ?? 0)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du score:', error)
      return { score: 0, total: 0 }
    }
  }, [location.state, searchParams])

  /**
   * Navigue vers la page de résultats avec le score
   */
  const navigateToResults = useCallback((score, totalQuestions, averageResponseTime = null) => {
    saveScore(score, totalQuestions)
    
    navigate('/results', {
      state: {
        score,
        totalQuestions,
        averageResponseTime
      }
    })
  }, [navigate, saveScore])

  /**
   * Nettoie les données de session
   */
  const clearSession = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.SCORE)
      sessionStorage.removeItem(STORAGE_KEYS.TOTAL)
    } catch (error) {
      console.error('Erreur lors du nettoyage de la session:', error)
    }
  }, [])

  return {
    saveScore,
    getScore,
    navigateToResults,
    clearSession
  }
}

