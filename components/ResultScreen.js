"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react";

const ResultScreen = ({ result, correctAnswer, onRetry }) => {
  // Determine if the answer is correct or incorrect
  const isCorrect =
    result.toLowerCase() === "correct" || result.toLowerCase() === "correct!";

  // Set emoji based on the result
  const emoji = isCorrect ? "✨" : "☔️";

  // Set the title based on the result
  const title = isCorrect ? "Correct answer" : "Wrong answer";

  // Ensure that the correctAnswer is always shown
  const displayAnswer = correctAnswer || "N/A";

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
      <div className="flex-1 flex flex-col items-center justify-start px-4 mt-12 w-full">
        {/* Emoji */}
        <div className="text-6xl mb-4">{emoji}</div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2">{title}</h2>

        {/* Description */}
        <p className="text-base text-gray-400 mb-10">{`The right answer was '${displayAnswer}'`}</p>

        {/* Buttons */}
        <div className="w-full max-w-lg space-y-4 px-4">
          <button
            onClick={onRetry}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md mb-4" // Added margin-bottom here
          >
            Do it again!
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






