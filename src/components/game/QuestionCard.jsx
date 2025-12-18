import './QuestionCard.css'

export default function QuestionCard({ question }) {
  if (!question) return null

  return (
    <section className="game-question-row">
      <div className="game-question-card">
        <div 
          className="game-question-text"
          dangerouslySetInnerHTML={{ __html: question }}
        />
      </div>
    </section>
  )
}

