"use client";

import React, { useState, useEffect, useRef } from "react";
import ResultScreen from "./ResultScreen";
import { X } from "lucide-react";

const QuizScreen = ({ question, answers, correct_answer, onNextQuestion, onAnswerSubmit, quizId, topic }) => {
  const [quizState, setQuizState] = useState({
    status: 'active',
    selectedAnswer: null,
    result: '',
    timeLeft: 10
  });
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setQuizState(prevState => ({
        ...prevState,
        timeLeft: prevState.timeLeft > 0 ? prevState.timeLeft - 0.1 : 0
      }));
    }, 100);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (quizState.timeLeft <= 0) {
      handleTimeUp();
    }
  }, [quizState.timeLeft]);

  const handleAnswer = (selectedAnswer) => {
    clearInterval(timerRef.current);
    const isCorrect = selectedAnswer === correct_answer;
    setQuizState(prevState => ({
      ...prevState,
      status: 'answered',
      selectedAnswer,
      result: isCorrect ? 'correct' : 'incorrect'
    }));
    onAnswerSubmit(isCorrect);
  };

  const handleTimeUp = () => {
    clearInterval(timerRef.current);
    setQuizState(prevState => ({
      ...prevState,
      status: 'answered',
      result: "time's up"  // Make sure this matches exactly
    }));
    onAnswerSubmit(false);  // Treat time's up as an incorrect answer
  };

  const handleNextQuestion = () => {
    onNextQuestion();
    setQuizState({
      status: 'active',
      selectedAnswer: null,
      result: '',
      timeLeft: 10
    });
  };

  if (quizState.status === 'answered') {
    console.log("Rendering ResultScreen with result:", quizState.result);
    return (
      <ResultScreen
        result={quizState.result}
        correctAnswer={correct_answer}
        onNextQuestion={handleNextQuestion}
        quizId={quizId}
        topic={topic}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <TopBar />
      <ProgressBar timeLeft={quizState.timeLeft} />
      <QuizContent 
        question={question}
        answers={answers}
        selectedAnswer={quizState.selectedAnswer}
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

const ProgressBar = ({ timeLeft }) => (
  <div className="w-full bg-gray-700 h-1">
    <div 
      className="bg-purple-600 h-1 transition-all duration-100 ease-linear"
      style={{ width: `${(timeLeft / 10) * 100}%` }}
    ></div>
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

