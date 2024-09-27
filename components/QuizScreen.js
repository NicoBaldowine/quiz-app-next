"use client";

import React, { useState } from "react";
import ResultScreen from "./ResultScreen";
import { X } from "lucide-react";
import { supabase } from '../lib/supabaseClient';

const QuizScreen = ({ question, answers, correctAnswer, onRetry, quizId }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState("");
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  const handleAnswer = async (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    setResult(isCorrect ? "Correct!" : "Incorrect!");

    // Update local score
    const newScore = isCorrect 
      ? { ...score, correct: score.correct + 1 }
      : { ...score, incorrect: score.incorrect + 1 };
    setScore(newScore);

    // Update score in Supabase
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({
          correct: newScore.correct,
          incorrect: newScore.incorrect
        })
        .eq('id', quizId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating quiz score:", error);
    }
  };

  if (result) {
    return (
      <ResultScreen 
        result={result} 
        correctAnswer={correctAnswer} 
        onRetry={onRetry} 
        quizId={quizId}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <TopBar />
      <QuizContent 
        question={question}
        answers={answers}
        selectedAnswer={selectedAnswer}
        handleAnswer={handleAnswer}
      />
    </div>
  );
};

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

const QuizContent = ({ question, answers, selectedAnswer, handleAnswer }) => (
  <div className="flex-1 flex flex-col px-4 mt-12">
    <h2 className="text-3xl font-bold text-center mb-6">{question}</h2>
    <div className="w-full space-y-4">
      {answers.map((answer, index) => (
        <AnswerButton
          key={index}
          answer={answer}
          index={index}
          selectedAnswer={selectedAnswer}
          handleAnswer={handleAnswer}
        />
      ))}
    </div>
  </div>
);

const AnswerButton = ({ answer, index, selectedAnswer, handleAnswer }) => {
  const optionLetters = ["A", "B", "C", "D"];
  const isDisabled = selectedAnswer !== null;
  const buttonClass = `w-full text-left px-4 py-3 rounded-lg text-lg transition-colors duration-200 ${
    isDisabled
      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
      : "bg-gray-800 text-white hover:bg-gray-700"
  }`;

  return (
    <button
      onClick={() => handleAnswer(answer)}
      disabled={isDisabled}
      className={buttonClass}
    >
      {`${optionLetters[index]}) ${answer}`}
    </button>
  );
};

export default QuizScreen;



