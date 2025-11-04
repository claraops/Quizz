import { useState } from "react";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function QuestionCard({ data, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const options = shuffle([...data.incorrect_answers, data.correct_answer]);

  const handleClick = (option) => {
    setSelected(option);
    const isCorrect = option === data.correct_answer;
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
    }, 800);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg mx-auto max-w-lg">
      <h2
        className="text-lg font-semibold mb-4"
        dangerouslySetInnerHTML={{ __html: data.question }}
      />
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleClick(opt)}
            disabled={selected !== null}
            className={`border rounded p-2 transition-all ${
              selected === opt
                ? opt === data.correct_answer
                  ? "bg-green-300"
                  : "bg-red-300"
                : "bg-white hover:bg-blue-100"
            }`}
            dangerouslySetInnerHTML={{ __html: opt }}
          />
        ))}
      </div>
    </div>
  );
}
