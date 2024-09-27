"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import QuizScreen from "./QuizScreen";
import { X } from "lucide-react";
import { supabase } from '../lib/supabaseClient';

const CreateQuizScreen = () => {
  const [title, setTitle] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createQuiz = async () => {
    if (!title.trim()) {
      setError("Please provide a quiz title.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/generate-quiz", { title });
      const quizData = response.data;

      // Store quiz in Supabase
      const { error } = await supabase
        .from('quizzes')
        .insert([
          { 
            title: title, 
            question: quizData.question, 
            answers: quizData.answers,
            correctAnswer: quizData.correctAnswer,
            correct: 0,
            incorrect: 0
          }
        ]);

      if (error) throw error;

      setQuizData(quizData);
    } catch (error) {
      console.error("Error generating quiz:", error.message);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setQuizData(null);
    createQuiz();
  };

  if (quizData) {
    return (
      <QuizScreen
        question={quizData.question}
        answers={quizData.answers}
        correctAnswer={quizData.correctAnswer}
        onRetry={handleRetry}
        title={title}
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

export default CreateQuizScreen;














