"use client";

import React from 'react';
import { X } from "lucide-react";

const TopBar = () => (
  <div className="w-full px-4 py-2 flex justify-end items-center border-b border-gray-800">
    <button
      onClick={() => window.history.back()}
      className="text-white hover:bg-gray-800 h-10 w-10 flex items-center justify-center rounded-full"
    >
      <X className="h-6 w-6" />
      <span className="sr-only">Close</span>
    </button>
  </div>
);

const ResultScreen = ({ result, correctAnswer, onNextQuestion, quizId, topic, isLastQuestion }) => {
  const isCorrect = result.toLowerCase() === "correct" || result.toLowerCase() === "correct!";
  const isTimeUp = result.toLowerCase() === "time's up" || result.toLowerCase() === "time's up!";

  const emoji = isCorrect ? "✨" : isTimeUp ? "⌛️" : "☔️";
  const title = isCorrect ? "Correct answer" : isTimeUp ? "Time's up!" : "Wrong answer";

  const getDescription = () => {
    if (isTimeUp) return "You ran out of time!";
    if (isCorrect) return `Great job! The correct answer is: ${correctAnswer}`;
    return "Better luck next time!";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <TopBar />
      <div className="flex-1 flex flex-col items-center px-4 pt-12">
        <div className="text-4xl mb-4 w-12 h-12 flex items-center justify-center">{emoji}</div>
        <h2 className="text-4xl font-bold text-center mb-3 font-barlow-condensed">{title}</h2>
        <p className="text-base text-gray-400 mb-8 text-center max-w-md">
          {getDescription()}
        </p>
        <button
          onClick={onNextQuestion}
          className="bg-transparent border border-white border-opacity-30 text-white font-normal py-2 px-6 rounded-[10px] transition-colors duration-200 hover:bg-white hover:bg-opacity-10"
        >
          {isLastQuestion ? "See Results" : "Next Question"}
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;






