"use client";

import React, { useState } from "react";
import axios from "axios";
import QuizScreen from "./QuizScreen";
import { X } from "lucide-react";

const CreateQuizScreen = () => {
  const [title, setTitle] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createQuiz = async () => {
    if (!title) {
      alert("Please provide a quiz title.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/generate-quiz", { title });
      setQuizData(response.data);
    } catch (error) {
      console.error("Error generating quiz:", error.response?.data || error.message);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setQuizData(null);
    createQuiz(); // Call createQuiz to generate a new quiz based on the same title
  };

  // If quizData exists, render QuizScreen and hide CreateQuizScreen
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
      
      {/* Content section with full width and padding */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 mt-12 w-full">
        <h1 className="text-3xl font-bold text-center mb-6 w-full px-4">
          What would you like to learn today?
        </h1>
        <div className="w-full max-w-lg space-y-4 px-4"> 
          {/* Full width input field with 16px padding */}
          <input
            type="text"
            placeholder="Type for any topic..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
          {/* Tailwind-styled purple button */}
          <button
            onClick={createQuiz}
            disabled={loading || !title}
            className={`w-full py-3 rounded-md text-white ${
              title
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-600 cursor-not-allowed"
            } focus:outline-none focus:ring-2 focus:ring-purple-600`}
          >
            {loading ? "Generating Quiz..." : "Create Quiz"}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default CreateQuizScreen;














