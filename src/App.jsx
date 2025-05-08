import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import sampleQuestions from "./questions";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = sampleQuestions[currentIndex];

  const handleAnswer = () => {
    if (selected == currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setShowResult(true);

  };

  const nextQuestion = () => {
    if (currentIndex < sampleQuestions.length -1) {
    setSelected(null);
    setShowResult(false);
    setCurrentIndex((prev) => (prev + 1));
  } else {
    setQuizComplete(true);
  }
}

  if(quizComplete) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-gray-700 mb-2">
            You got {score} out of {sampleQuestions.length} correct.
          </p>
          <p className="text-gray-700">Thanks for playing!</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>
        <div className="space-y-2">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => {
                if (!showResult) setSelected(option);
              }}
              disabled={showResult}
              className={`block w-full text-left px-4 py-2 rounded-lg border transition
                ${selected === option ? "bg-blue-200" : "bg-gray-50 hover:bg-gray-100"}
                ${showResult ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {option}
            </button>
          ))}
        </div>

        {selected && !showResult && (
          <button
            onClick={handleAnswer}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Submit
          </button>
        )}

        {showResult && (
          <div className="mt-4">
            {selected === currentQuestion.correctAnswer ? (
              <p className="text-green-600 font-bold">Correct!</p>
            ) : (
              <p className="text-red-600 font-bold">
                Incorrect. The correct answer is {currentQuestion.correctAnswer}.
              </p>
            )}
            {currentIndex === sampleQuestions.length - 1 ? (
              <button
              onClick={nextQuestion}
              className="mt-2 px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              End Quiz
            </button>
            ) : (
              <button
              onClick={nextQuestion}
              className="mt-2 px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              Next Question
            </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
