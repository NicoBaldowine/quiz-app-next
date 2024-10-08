"use client";

import React, { useState, useEffect, useRef } from "react";
import ResultScreen from "./ResultScreen";
import { X } from "lucide-react";
import axios from "axios";
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

const QuizScreen = ({ questions: initialQuestions, onRetry, onAnswerSubmit, quizId, topic }) => {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [quizState, setQuizState] = useState({
    status: 'active',
    selectedAnswer: null,
    result: '',
    timeLeft: 10,
    currentQuestionIndex: 0,
    correctAnswers: 0,
  });
  const [loading, setLoading] = useState(false);

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

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setQuizState(prevState => ({
      ...prevState,
      timeLeft: 10
    }));

    timerRef.current = setInterval(() => {
      setQuizState(prevState => ({
        ...prevState,
        timeLeft: prevState.timeLeft > 0 ? prevState.timeLeft - 0.1 : 0
      }));
    }, 100);
  };

  const generateMoreQuestions = async () => {
    setLoading(true);
    try {
      const newQuestions = await generateMultipleQuestions(5, topic);
      setQuestions(newQuestions);
      resetQuiz();
    } catch (error) {
      console.error('Error generating more questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMultipleQuestions = async (count, title) => {
    const questions = [];
    for (let i = 0; i < count; i++) {
      const response = await axios.post('/api/generate-quiz', { 
        title,
        existingQuestions: questions.map(q => q.question)
      });
      const question = response.data;
      if (question) {
        questions.push({
          question: question.question,
          answers: question.answers,
          correct_answer: question.correct_answer
        });
      }
    }
    return questions;
  };

  const updateQuizStats = async (passed) => {
    try {
      console.log('Updating quiz stats. Passed:', passed);
      const { data: currentQuiz, error: fetchError } = await supabase
        .from('quizzes')
        .select('correct, incorrect')
        .eq('id', quizId)
        .single();

      if (fetchError) throw fetchError;

      console.log('Current quiz stats:', currentQuiz);

      const updatedCounts = {
        correct: passed ? (currentQuiz.correct || 0) + 1 : (currentQuiz.correct || 0),
        incorrect: passed ? (currentQuiz.incorrect || 0) : (currentQuiz.incorrect || 0) + 1
      };

      console.log('Updated counts:', updatedCounts);

      const { data, error } = await supabase
        .from('quizzes')
        .update(updatedCounts)
        .eq('id', quizId)
        .select();

      if (error) throw error;
      console.log('Updated quiz stats:', data);
      
      // Remove the automatic navigation
      // router.push('/', undefined, { shallow: true });
    } catch (error) {
      console.error('Error updating quiz stats:', error);
    }
  };

  const handleQuizCompletion = () => {
    const passed = quizState.correctAnswers >= 4;
    updateQuizStats(passed);
    setQuizState(prevState => ({
      ...prevState,
      status: 'finished'
    }));
  };

  // Use this function when the last question is answered or time runs out
  useEffect(() => {
    if (quizState.currentQuestionIndex === questions.length - 1 && quizState.selectedAnswer !== null) {
      handleQuizCompletion();
    }
  }, [quizState.currentQuestionIndex, quizState.selectedAnswer]);

  const handleClose = () => {
    router.push('/');  // Navigate back to the home page
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <TopBar onClose={handleClose} />
        <div className="text-center text-white mt-8">Loading questions...</div>
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <TopBar onClose={handleClose} />
        <div className="text-center text-white mt-8">No more questions available.</div>
      </div>
    );
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
      resetTimer();
    } else {
      const passed = quizState.correctAnswers >= 4;
      updateQuizStats(passed); // Update stats immediately when quiz is finished
      setQuizState(prevState => ({
        ...prevState,
        status: 'finished'
      }));
    }
  };

  if (quizState.status === 'answered') {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <TopBar onClose={handleClose} />
        <ResultScreen
          result={quizState.result}
          correctAnswer={currentQuestion.correct_answer}
          onNextQuestion={handleNextQuestion}
          quizId={quizId}
          topic={topic}
          isLastQuestion={quizState.currentQuestionIndex === questions.length - 1}
        />
      </div>
    );
  }

  if (quizState.status === 'finished') {
    const passed = quizState.correctAnswers >= 4;
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <TopBar onClose={handleClose} />
        <FinalStatusScreen
          passed={passed}
          correctAnswers={quizState.correctAnswers}
          totalQuestions={questions.length}
          onRetry={resetQuiz}
          onMoreQuestions={generateMoreQuestions}
          loading={loading}
          updateQuizStats={updateQuizStats}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <TopBar onClose={handleClose} />
      <ProgressBar timeLeft={quizState.timeLeft} />
      <QuizContent 
        question={currentQuestion.question || "No question available"}
        answers={currentQuestion.answers || []}
        selectedAnswer={quizState.selectedAnswer}
        handleAnswer={handleAnswer}
      />
    </div>
  );
};

const TopBar = ({ onClose }) => (
  <div className="w-full px-4 py-2 flex justify-end items-center border-b border-gray-800">
    <button
      onClick={onClose}
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
      className="bg-white h-1 transition-all duration-100 ease-linear origin-left"
      style={{ width: `${100 - (timeLeft / 10) * 100}%` }}
    ></div>
  </div>
);

const QuizContent = ({ question, answers, selectedAnswer, handleAnswer }) => (
  <div className="flex-1 flex flex-col px-4 mt-6">
    <h2 className="text-2xl font-bold text-center mb-6 font-barlow-condensed">{question}</h2>
    <div className="w-full space-y-4">
      {Array.isArray(answers) ? (
        answers.map((answer, index) => (
          <AnswerButton
            key={index}
            answer={answer}
            index={index}
            selectedAnswer={selectedAnswer}
            handleAnswer={handleAnswer}
          />
        ))
      ) : (
        <p className="text-center text-red-500">No answers available</p>
      )}
    </div>
  </div>
);

const AnswerButton = ({ answer, index, selectedAnswer, handleAnswer }) => {
  const optionLetters = ["A", "B", "C", "D"];
  const isDisabled = selectedAnswer !== null;
  const buttonClass = `w-full flex items-center px-4 py-3 rounded-lg text-base transition-colors duration-200 ${
    isDisabled
      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
      : "bg-gray-800 text-white hover-bg-gray-700"
  }`;

  return (
    <button
      onClick={() => handleAnswer(answer)}
      disabled={isDisabled}
      className={buttonClass}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-transparent border border-white border-opacity-30 flex items-center justify-center mr-3">
        <span className="text-sm font-medium">{optionLetters[index]}</span>
      </div>
      <span className="flex-grow text-left">{answer}</span>
    </button>
  );
};

const FinalStatusScreen = ({ 
  passed, 
  correctAnswers, 
  totalQuestions, 
  onRetry, 
  onMoreQuestions, 
  loading, 
  updateQuizStats
}) => {
  const emoji = passed ? "🎉" : "😢";
  const title = passed ? "Congratulations!" : "Better luck next time!";
  const description = `You got ${correctAnswers} out of ${totalQuestions} questions correct.`;

  const handleMoreQuestions = () => {
    updateQuizStats(true);  // Count as a pass
    onMoreQuestions();
  };

  const handleRetry = () => {
    updateQuizStats(false);  // Count as a fail
    onRetry();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col items-center px-4 pt-12">
        <div className="text-4xl mb-4 w-12 h-12 flex items-center justify-center">{emoji}</div>
        <h2 className="text-4xl font-bold text-center mb-3 font-barlow-condensed">{title}</h2>
        <p className="text-base text-gray-400 mb-8 text-center max-w-md">
          {description}
        </p>
        <div className="space-y-4">
          {passed ? (
            <button
              onClick={handleMoreQuestions}
              disabled={loading}
              className="w-full bg-transparent border border-white border-opacity-30 text-white font-normal py-2 px-6 rounded-[10px] transition-colors duration-200 hover:bg-white hover:bg-opacity-10"
            >
              {loading ? 'Generating...' : 'More Questions'}
            </button>
          ) : (
            <button
              onClick={handleRetry}
              className="w-full bg-transparent border border-white border-opacity-30 text-white font-normal py-2 px-6 rounded-[10px] transition-colors duration-200 hover:bg-white hover:bg-opacity-10"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;