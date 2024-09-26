"use client";

import React, { useState } from "react";
import ResultScreen from "./ResultScreen";
import { X } from "lucide-react";

const QuizScreen = ({ question, answers, correctAnswer, onRetry }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState("");

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();

    if (normalizedAnswer === normalizedCorrectAnswer) {
      setResult("Correct!");
    } else {
      setResult("Incorrect!");
    }
  };

  const optionLetters = ["A", "B", "C", "D"];

  // Render the result screen if the answer has been selected
  if (result) {
    return <ResultScreen result={result} correctAnswer={correctAnswer} onRetry={onRetry} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Topbar with X icon */}
      <div className="w-full px-4 py-2 flex justify-end items-center border-b border-gray-800">
        <button
          onClick={() => window.history.back()}
          className="text-white hover:bg-gray-800 h-10 w-10 flex items-center justify-center rounded-full"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      {/* Content section */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 mt-12 w-full">
        <h2 className="text-3xl font-bold text-center mb-6 w-full">{question}</h2>
        <div className="w-full space-y-4 max-w-lg px-4">
          {answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(answer)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left px-4 py-3 rounded-lg text-lg transition-colors duration-200 ${
                selectedAnswer !== null
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {`${optionLetters[index]}) ${answer}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;





