"use client";

import React, { useState, useEffect, useRef } from "react";
import ResultScreen from "./ResultScreen";
import { X } from "lucide-react";

const QuizScreen = ({ questions, onRetry, onAnswerSubmit, quizId, topic }) => {
  const [quizState, setQuizState] = useState({
    status: 'active',
    selectedAnswer: null,
    result: '',
    timeLeft: 10,
    currentQuestionIndex: 0,
    correctAnswers: 0,
  });

  const timerRef = useRef(null);

  useEffect(() => {
    if (questions && questions.length > 0) {
      resetQuiz();
    }
  }, [questions]);

  useEffect(() => {
    if (quizState.timeLeft <= 0) {
      handleTimeUp();
    }
  }, [quizState.timeLeft]);

  const resetQuiz = () => {
    setQuizState({
      status: 'active',
      selectedAnswer: null,
      result: '',
      timeLeft: 10,
      currentQuestionIndex: 0,
      correctAnswers: 0,
    });

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setQuizState(prevState => ({
        ...prevState,
        timeLeft: prevState.timeLeft > 0 ? prevState.timeLeft - 0.1 : 0
      }));
    }, 100);
  };

  if (!questions || questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = questions[quizState.currentQuestionIndex];

  if (!currentQuestion) {
    return <div>No more questions available.</div>;
  }

  const handleAnswer = (selectedAnswer) => {
    clearInterval(timerRef.current);
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    setQuizState(prevState => ({
      ...prevState,
      status: 'answered',
      selectedAnswer,
      result: isCorrect ? 'correct' : 'incorrect',
      correctAnswers: isCorrect ? prevState.correctAnswers + 1 : prevState.correctAnswers
    }));
    onAnswerSubmit(isCorrect);
  };

  const handleTimeUp = () => {
    clearInterval(timerRef.current);
    setQuizState(prevState => ({
      ...prevState,
      status: 'answered',
      result: "time's up"
    }));
    onAnswerSubmit(false);
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestionIndex < questions.length - 1) {
      setQuizState(prevState => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        status: 'active',
        selectedAnswer: null,
        result: '',
        timeLeft: 10
      }));
    } else {
      // Quiz finished
      setQuizState(prevState => ({
        ...prevState,
        status: 'finished'
      }));
    }
  };

  if (quizState.status === 'answered') {
    return (
      <ResultScreen
        result={quizState.result}
        correctAnswer={currentQuestion.correct_answer}
        onNextQuestion={handleNextQuestion}
        quizId={quizId}
        topic={topic}
        isLastQuestion={quizState.currentQuestionIndex === questions.length - 1}
      />
    );
  }

  if (quizState.status === 'finished') {
    const passed = quizState.correctAnswers >= 4;
    return (
      <FinalStatusScreen
        passed={passed}
        correctAnswers={quizState.correctAnswers}
        totalQuestions={questions.length}
        onRetry={resetQuiz}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <TopBar />
      <ProgressBar timeLeft={quizState.timeLeft} />
      <QuizContent 
        question={currentQuestion.question}
        answers={currentQuestion.answers}
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
      className="bg-purple-600 h-1 transition-all duration-100 ease-linear origin-left"
      style={{ width: `${100 - (timeLeft / 10) * 100}%` }}
    ></div>
  </div>
);

const QuizContent = ({ question, answers, selectedAnswer, handleAnswer }) => (
  <div className="flex-1 flex flex-col px-4 mt-6"> {/* Changed mt-4 to mt-6 */}
    <h2 className="text-2xl font-bold text-center mb-6">{question}</h2>
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

const FinalStatusScreen = ({ passed, correctAnswers, totalQuestions, onRetry }) => (
  <div className="flex flex-col min-h-screen bg-gray-900 text-white">
    <TopBar />
    <div className="flex-1 flex flex-col items-center px-4 pt-12"> {/* Added pt-12 for top padding */}
      <div className="text-4xl mb-4 w-8 h-8 flex items-center justify-center">
        {passed ? "🎉" : "😢"}
      </div>
      <h2 className="text-2xl font-bold text-center mb-2">
        {passed ? "Congratulations!" : "Better luck next time!"}
      </h2>
      <p className="text-base text-gray-400 mb-8 text-center max-w-md">
        You got {correctAnswers} out of {totalQuestions} questions correct.
      </p>
      <button
        onClick={onRetry}
        className="bg-purple-600 hover:bg-purple-700 text-white font-normal py-2 px-4 rounded"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default QuizScreen;

