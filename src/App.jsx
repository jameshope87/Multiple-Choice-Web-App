import React, { useState, useEffect, Children } from 'react';
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import supersub from "remark-supersub";

// Import KaTeX styles
import 'katex/dist/katex.min.css';
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

function shuffleArray(array) {
  const arr = [...array]; // Make a copy so we don't mutate original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const MarkdownComponents = {
  /*
  p: ({children}) => {
    return <p>{children}</p>
  */
  
  p: ({ children}) => {
    const childrenArray = Children.toArray(children);
    const text = childrenArray
      .map((child) => (typeof child === "string" ? child : ""))
      .join("")
      .trim();
    //const lines = text.split("\n");
    const isEquation = /[→⇌]/.test(text);
    return (
      <p
        className={
          isEquation
          ? "whitespace-nowrap overflow-x-auto text-sm font-equation" 
          : ""
        }
      >
        {childrenArray}
      </p>
    );

    },
};

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const loadedQuestions = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data() }));
      const randomTen = shuffleArray(loadedQuestions).slice(0,10);
      setQuestions(randomTen);
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const currentQuestion = questions[currentIndex];

  const handleAnswer = () => {
    if (selected == currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setShowResult(true);

  };

  const nextQuestion = () => {
    if (currentIndex < questions.length -1) {
    setSelected(null);
    setShowResult(false);
    setCurrentIndex((prev) => (prev + 1));
  } else {
    setQuizComplete(true);
  }
}

  if(quizComplete) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center dark:bg-gray-400">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl text-center dark:bg-gray-600">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-gray-700 mb-2 dark:text-gray-200">
            You got {score} out of {questions.length} correct.
          </p>
          <p className="text-gray-700 dark:text-gray-200">Thanks for playing!</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center dark:bg-gray-400">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl dark:bg-gray-600">
        <h2 className="text-xl font-bold mb-4 text-left">
          <div className="prose prose-sm max-w-none dark:text-gray-200">
          <ReactMarkdown
            remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkMath, supersub]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            components={MarkdownComponents}
          >
            {currentQuestion.question}
          </ReactMarkdown>
          </div>
        </h2>
        <div className="space-y-2">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => {
                if (!showResult) setSelected(option);
              }}
              disabled={showResult}
              className={`block w-full text-left px-4 py-2 rounded-lg border transition
                ${selected === option ? "bg-blue-200 dark:bg-blue-600" : "bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-400"}
                ${showResult ? "opacity-50 cursor-not-allowed" : ""}
                dark:bg-gray-800`}
            >
              <ReactMarkdown
                remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkMath, supersub]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                  p: ({ children }) => {
                  const isEquation = /[→⇌]/.test(children);
                  return (
                  <span
                  className={
                    isEquation
                      ? "whitespace-nowrap overflow-x-auto text-sm font-equation" 
                      : ""
                  }>{children}</span>
                  );
                }
              }}
              >
                {option}
              </ReactMarkdown>
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
                Incorrect. The correct answer is 
                <ReactMarkdown
                  remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkMath, supersub]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                >
                  {currentQuestion.correctAnswer}
                </ReactMarkdown>
              </p>
            )}
            {currentIndex === questions.length - 1 ? (
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
