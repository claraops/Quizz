import './AnswerGrid.css'

export default function AnswerGrid({ 
  answers, 
  selectedAnswer, 
  correctAnswer, 
  answered, 
  onAnswerClick 
}) {
  return (
    <section className="game-answers-grid">
      {answers.map((answer, index) => {
        const isSelected = selectedAnswer === answer
        const isCorrect = answer === correctAnswer
        const showResults = answered
        
        let answerClass = 'game-answer-card'
        if (showResults) {
          if (isCorrect) answerClass += ' game-answer-correct'
          else if (isSelected && !isCorrect) answerClass += ' game-answer-wrong'
          else answerClass += ' game-answer-disabled'
        }

        return (
          <div
            key={`answer-${index}`}
            className={answerClass}
            onClick={() => onAnswerClick(answer)}
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
  )
}

