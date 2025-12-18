import './TimerBar.css'

export default function TimerBar({ timeLeft, maxTime = 10 }) {
  const percentage = (timeLeft / maxTime) * 100

  return (
    <div className="time-progress-container">
      <div 
        className="time-progress-bar"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

