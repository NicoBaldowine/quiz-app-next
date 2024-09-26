"use client";

import Link from "next/link";
import { Button } from "@nextui-org/react";
import { Home, PlusCircle, User, MoreVertical, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

const HomeScreen = () => {
  const [quizzes, setQuizzes] = useState([]);

  // Check if localStorage is available in the browser
  const isLocalStorageAvailable = () => {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch (_error) {
      // Safely handling error, but not using the variable '_error' to avoid lint issues
      return false;
    }
  };

  // Load quizzes from localStorage when component mounts
  useEffect(() => {
    if (isLocalStorageAvailable()) {
      const storedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
      setQuizzes(storedQuizzes);
    }
  }, []);

  // Save quizzes to localStorage when they change
  useEffect(() => {
    if (isLocalStorageAvailable()) {
      localStorage.setItem("quizzes", JSON.stringify(quizzes));
    }
  }, [quizzes]);

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-gray-900 text-white">
      <main className="flex-1 w-full overflow-y-auto">
        <h1 className="text-3xl font-bold p-6">My Quizzes</h1>
        <div className="space-y-4 px-4">
          {quizzes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-6xl mb-4">☔️</div>
              <h3 className="text-lg">No quizzes created yet</h3>
            </div>
          ) : (
            quizzes.map((quiz, index) => (
              <div
                key={index}
                className="rounded-lg bg-gray-800 border-b border-gray-700 relative p-4"
              >
                <div className="flex justify-between items-start">
                  <span className="text-lg text-white">{quiz.title}</span>
                  <button className="text-white hover:text-gray-300 hover:bg-gray-700 p-1 rounded-full transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2">
                    <span className="bg-green-600 text-green-100 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      {quiz.correct}
                    </span>
                    <span className="bg-red-600 text-red-100 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                      <X className="h-3 w-3 mr-1" />
                      {quiz.incorrect}
                    </span>
                  </div>
                  <Link href={`/quiz/${index}`}>
                    <Button
                      variant="outline"
                      className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:text-white"
                    >
                      Take Quiz
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <nav className="bg-gray-800 border-t border-gray-700 fixed bottom-0 left-0 right-0 z-10">
        <div className="w-full px-4">
          <ul className="flex justify-around py-2">
            <li>
              <Link href="/" className="flex flex-col items-center text-xs text-white">
                <Home className="h-6 w-6" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/create"
                className="flex flex-col items-center text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                <PlusCircle className="h-6 w-6" />
                <span>Create Quiz</span>
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                className="flex flex-col items-center text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                <User className="h-6 w-6" />
                <span>Account</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default HomeScreen;










