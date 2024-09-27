"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ResultScreen from "./ResultScreen";
import { X } from "lucide-react";
import { supabase } from '../lib/supabaseClient';

const QuizScreen = ({ question, answers, correct_answer, onRetry, onNextQuestion, onAnswerSubmit, quizId, topic }) => {
  const [quizState, setQuizState] = useState({
    status: 'active',  // 'active', 'answered', or 'timeout'
    selectedAnswer: null,
    result: '',
    timeLeft: 10
  });
  const [key, setKey] = useState(0); // Add this line to force re-renders
  const timerRef = useRef(null);

  const resetQuizState = useCallback(() => {
    setQuizState({
      status: 'active',
      selectedAnswer: null,
      result: '',
      timeLeft: 10
    });
    setKey(prevKey => prevKey + 1); // Increment key to force re-render
  }, []);

  useEffect(() => {
    console.log("QuizScreen received new question:", question, "Topic:", topic);
    setQuizState({
      status: 'active',
      selectedAnswer: null,
      result: '',
      timeLeft: 10
    });
  }, [question, topic]);

  useEffect(() => {
    if (quizState.status === 'active') {
      timerRef.current = setInterval(() => {
        setQuizState(prevState => {
          if (prevState.timeLeft <= 1) {
            clearInterval(timerRef.current);
            return {
              ...prevState,
              status: 'timeout',
              result: "Time's up!",
              timeLeft: 0
            };
          }
          return { ...prevState, timeLeft: prevState.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [quizState.status]);

  const handleAnswer = async (answer) => {
    if (quizState.status !== 'active') return;

    clearInterval(timerRef.current);
    const isCorrect = answer === correct_answer;
    setQuizState(prevState => ({
      ...prevState,
      status: 'answered',
      selectedAnswer: answer,
      result: isCorrect ? "Correct!" : "Incorrect!"
    }));

    await onAnswerSubmit(isCorrect);
  };

  const handleNextQuestion = useCallback(() => {
    console.log("handleNextQuestion called in QuizScreen");
    if (typeof onNextQuestion === 'function') {
      try {
        onNextQuestion();
        resetQuizState();
      } catch (error) {
        console.error("Error generating next question:", error);
      }
    } else {
      console.error("onNextQuestion is not a function in QuizScreen", onNextQuestion);
    }
  }, [onNextQuestion, resetQuizState]);

  if (quizState.status === 'answered' || quizState.status === 'timeout') {
    return (
      <ResultScreen
        result={quizState.result}
        correctAnswer={correct_answer}
        onNextQuestion={onNextQuestion}
        quizId={quizId}
        topic={topic}
      />
    );
  }

  return (
    <div key={key} className="flex flex-col min-h-screen bg-gray-900 text-white">
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
      className="bg-purple-600 h-1 transition-all duration-1000 ease-linear"
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



