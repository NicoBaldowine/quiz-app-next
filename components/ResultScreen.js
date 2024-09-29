"use client";

import React from 'react';
import { X } from "lucide-react";

const ResultScreen = ({ result, correctAnswer, onNextQuestion, quizId, topic }) => {
  const isCorrect = result.toLowerCase() === "correct" || result.toLowerCase() === "correct!";
  const isTimeUp = result.toLowerCase() === "time's up" || result.toLowerCase() === "time's up!";

  const emoji = isCorrect ? "✨" : isTimeUp ? "⌛️" : "☔️";
  const title = isCorrect ? "Correct answer" : isTimeUp ? "Time's up!" : "Wrong answer";

  const handleNextQuestion = () => {
    if (typeof onNextQuestion === 'function') {
      onNextQuestion();
    } else {
      console.error("onNextQuestion is not a function", onNextQuestion);
    }
  };

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
      <div className="flex-1 flex flex-col items-center px-4 pt-12">
        {/* Emoji */}
        <div className="text-3xl mb-4 w-8 h-8 flex items-center justify-center">{emoji}</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>

        {/* Description */}
        <p className="text-base text-gray-400 mb-8 text-center max-w-md">
          {isTimeUp ? "You ran out of time!" : `The correct answer was: ${correctAnswer}`}
        </p>

        {/* Next Question button */}
        <button
          onClick={handleNextQuestion}
          className="bg-purple-600 hover:bg-purple-700 text-white font-normal py-2 px-4 rounded"
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;






