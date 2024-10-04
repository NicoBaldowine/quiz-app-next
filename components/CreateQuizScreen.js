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
    try {
      const response = await axios.post('/api/generate-quiz', { title });
      console.log('New question generated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating question:', error);
      setError('Failed to generate new question. Please try again.');
      return null;
    }
  };

  const generateMultipleQuestions = async (count) => {
    const questions = [];
    for (let i = 0; i < count; i++) {
      const response = await axios.post('/api/generate-quiz', { 
        title,
        existingQuestions: questions.map(q => q.question) // Send existing questions to avoid repetition
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

  const createQuiz = async () => {
    setLoading(true);
    try {
      const questions = await generateMultipleQuestions(5); // Generate 5 questions
      console.log('Generated questions:', questions);
      if (questions.length > 0) {
        const { data, error } = await supabase
          .from('quizzes')
          .insert({
            title: title,
            questions: questions,
            correct: 0,
            incorrect: 0
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Quiz saved to Supabase:', data);
        setQuizData(data);
      } else {
        setError('Failed to generate questions. Please try again.');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      setError('Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (quizData && quizData.questions) {
      const currentIndex = quizData.currentQuestionIndex || 0;
      if (currentIndex < quizData.questions.length - 1) {
        setQuizData(prevData => ({
          ...prevData,
          currentQuestionIndex: currentIndex + 1
        }));
      } else {
        // Quiz finished
        console.log('Quiz finished');
        // Handle quiz completion (e.g., show results, redirect)
      }
    }
  };

  const handleRetry = () => {
    setQuizData(null);
    setTitle("");
  };

  if (quizData) {
    const currentQuestionIndex = quizData.currentQuestionIndex || 0;
    const currentQuestion = quizData.questions[currentQuestionIndex];
    return (
      <QuizScreen
        questions={quizData.questions}
        currentQuestionIndex={currentQuestionIndex}
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

const ContentSection = ({ title, setTitle, createQuiz, loading, error }) => (
  <div className="flex-1 flex flex-col items-center justify-start w-full px-4 mt-8">
    <h1 className="text-2xl font-bold mb-8 font-inter">Create a New Quiz</h1>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Enter quiz title"
      className="w-full max-w-md px-4 py-2 rounded-md bg-gray-800 text-white mb-4"
    />
    <button
      onClick={createQuiz}
      disabled={loading || !title.trim()}
      className={`w-full max-w-md px-4 py-2 rounded-md ${
        loading || !title.trim() ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
      } text-white transition-colors duration-200`}
    >
      {loading ? 'Creating...' : 'Create Quiz'}
    </button>
    {error && <p className="text-red-500 mt-4">{error}</p>}
  </div>
);

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center">
      <div className="relative w-16 h-16 mb-6">
        <svg className="animate-spin w-16 h-16 text-white" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <p className="text-white text-xl font-semibold mb-2">Generating your quiz...</p>
      <p className="text-gray-400 text-sm">This may take a few seconds</p>
    </div>
  </div>
);

export default CreateQuizScreen;














