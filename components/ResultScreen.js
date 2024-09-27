"use client";

import React, { useEffect } from 'react';
import Link from "next/link";
import { X } from "lucide-react";
import { supabase } from '../lib/supabaseClient';

const ResultScreen = ({ result, correctAnswer, onNextQuestion, quizId, topic }) => {
  const isCorrect = result.toLowerCase() === "correct" || result.toLowerCase() === "correct!";
  const isTimeUp = result.toLowerCase() === "time's up" || result.toLowerCase() === "time's up!";

  const emoji = isCorrect ? "✨" : isTimeUp ? "⌛️" : "☔️";
  const title = isCorrect ? "Correct answer" : isTimeUp ? "Time's up!" : "Wrong answer";

  useEffect(() => {
    console.log('Quiz ID:', quizId);
    console.log('Result:', result);
    console.log('Topic:', topic);

    const updateQuizScore = async () => {
      const field = isCorrect ? 'correct' : 'incorrect';
      
      // First, get the current score
      const { data, error: fetchError } = await supabase
        .from('quizzes')
        .select(field)
        .eq('id', quizId)
        .single();

      if (fetchError) {
        console.error("Error fetching quiz score:", fetchError);
        return;
      }

      // Then, update the score
      const { error: updateError } = await supabase
        .from('quizzes')
        .update({ [field]: (data[field] || 0) + 1 })
        .eq('id', quizId);

      if (updateError) {
        console.error("Error updating quiz score:", updateError);
      }
    };

    // Only update the score if it's not a "Time's up" scenario
    if (!isTimeUp) {
      updateQuizScore();
    }
  }, [quizId, result, isCorrect, isTimeUp, topic]);

  const handleNextQuestion = async () => {
    console.log("Next Question button clicked");
    if (typeof onNextQuestion === 'function') {
      console.log("Calling onNextQuestion function");
      await onNextQuestion();
    } else {
      console.error("onNextQuestion is not a function", onNextQuestion);
    }
  };

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

      {/* Content section */}
      <div className="flex-1 flex flex-col px-4">
        <div className="flex-grow flex flex-col items-center justify-center">
          {/* Emoji */}
          <div className="text-6xl mb-4">{emoji}</div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-2">{title}</h2>

          {/* Description */}
          <p className="text-base text-gray-400 mb-10">
            {isTimeUp ? "You ran out of time!" : `The correct answer was: ${correctAnswer}`}
          </p>
        </div>

        {/* Buttons at the bottom */}
        <div className="w-full mb-4">
          <button
            onClick={handleNextQuestion}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md mb-4"
          >
            Next Question
          </button>

          <Link href="/" passHref>
            <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-md">
              Go home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;






