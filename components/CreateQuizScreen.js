"use client";

import React, { useState } from "react";
import axios from "axios";
import QuizScreen from "./QuizScreen";
import { X, Loader } from "lucide-react";
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

const CreateQuizScreen = () => {
  const [title, setTitle] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const generateQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/generate-quiz', { title });
      console.log('New question generated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating question:', error);
      setError('Failed to generate new question. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async () => {
    const newQuestion = await generateQuestion();
    if (newQuestion) {
      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          title: title,
          question: newQuestion.question,
          answers: newQuestion.answers,
          correct_answer: newQuestion.correct_answer,
          correct: 0,
          incorrect: 0
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Quiz saved to Supabase:', data);
      setQuizData(data);
    }
  };

  const handleNextQuestion = async () => {
    const newQuestion = await generateQuestion();
    if (newQuestion) {
      setQuizData(prevData => ({
        ...prevData,
        question: newQuestion.question,
        answers: newQuestion.answers,
        correct_answer: newQuestion.correct_answer
      }));
    }
  };

  const handleRetry = () => {
    setQuizData(null);
    setTitle("");
  };

  if (quizData) {
    return (
      <QuizScreen
        question={quizData.question}
        answers={quizData.answers}
        correct_answer={quizData.correct_answer}
        onRetry={handleRetry}
        onNextQuestion={handleNextQuestion}
        onAnswerSubmit={(isCorrect) => {
          supabase
            .from('quizzes')
            .update({
              [isCorrect ? 'correct' : 'incorrect']: supabase.rpc('increment', { x: 1 })
            })
            .eq('id', quizData.id);
        }}
        quizId={quizData.id}
        topic={title}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <TopBar />
      <ContentSection
        title={title}
        setTitle={setTitle}
        createQuiz={createQuiz}
        loading={loading}
        error={error}
      />
      {loading && <LoadingOverlay />}
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

const ContentSection = ({ title, setTitle, createQuiz, loading, error }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full px-4 mt-12">
      <h1 className="text-3xl font-bold text-center mb-6 w-full">
        What would you like to learn today?
      </h1>
      <div className="w-full space-y-4">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type any topic..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
        <button
          onClick={createQuiz}
          disabled={loading || !title.trim()}
          className={`w-full py-3 rounded-md text-white transition-colors duration-200 ${
            title.trim()
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-gray-600 cursor-not-allowed"
          } focus:outline-none focus:ring-2 focus:ring-purple-600`}
        >
          {loading ? "Generating Quiz..." : "Create Quiz"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-4 w-full">{error}</p>}
    </div>
  );
};

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center">
      <Loader className="animate-spin h-12 w-12 text-purple-600 mb-4" />
      <p className="text-white text-lg font-semibold">Generating your quiz...</p>
      <p className="text-gray-400 mt-2">This may take a few seconds</p>
    </div>
  </div>
);

export default CreateQuizScreen;














