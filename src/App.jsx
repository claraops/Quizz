import { Routes, Route, Navigate } from 'react-router-dom'
import { QuizProvider } from './context/QuizContext.jsx'
import Home from './pages/Home.jsx'
import Game from './pages/Game.jsx'
import Results from './pages/Results.jsx'
import './App.css'

function App() {
  return (
    <QuizProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/results" element={<Results />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QuizProvider>
  )
}

export default App