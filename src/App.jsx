import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";

function App() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const categories = {
    Informatique: 18,
    Sport: 21,
    Cinema: 11,
  };

  const fetchQuestions = (categoryId) => {
    setLoading(true);
    setGameOver(false);
    setQuestions([]);
    setCurrent(0);
    setScore(0);

    fetch(`https://opentdb.com/api.php?amount=5&category=${categoryId}&type=multiple`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setLoading(false);
      });
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore((prev) => prev + 1);

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setGameOver(true);
    }
  };

  if (!category) {
    return (
      <div className="text-center p-6">
        <h1> Quiz Game</h1>
        <p>Choisis une catégorie pour commencer :</p>
        <div className="flex justify-center gap-4 mt-4">
          {Object.keys(categories).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                fetchQuestions(categories[cat]);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loading) return <h2 className="text-center">Chargement...</h2>;

  if (gameOver)
    return (
      <div className="text-center p-6">
        <h2> Quiz terminé !</h2>
        <p>
          Score : {score}/{questions.length}
        </p>
        <button
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => setCategory(null)}
        >
          Rejouer
        </button>
      </div>
    );

  if (questions.length === 0) return <h2 className="text-center">Aucune question trouvée </h2>;

  return (
    <div className="p-6 text-center">
      <h1 className="mb-4"> Catégorie : {category}</h1>
      <QuestionCard data={questions[current]} onAnswer={handleAnswer} />
      <p className="mt-4">
        Question {current + 1}/{questions.length}
      </p>
      <p>Score : {score}</p>
    </div>
  );
}

export default App;
