"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { Home, PlusCircle, User, MoreVertical, Check, X, Play, Trash2 } from "lucide-react";
import { supabase } from '../lib/supabaseClient';

const HomeScreen = () => {
  const [quizzes, setQuizzes] = useState([]);

  const loadQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data);
    } catch (error) {
      console.error("Error loading quizzes:", error);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const deleteQuiz = async (id) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-gray-900 text-white">
      <main className="flex-1 w-full overflow-y-auto">
        <h1 className="text-3xl font-bold p-6">My Quizzes</h1>
        <div className="space-y-4 px-4">
          {quizzes.length === 0 ? (
            <EmptyQuizState />
          ) : (
            quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onDelete={deleteQuiz} />
            ))
          )}
        </div>
      </main>
      <Navigation />
    </div>
  );
};

const EmptyQuizState = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <div className="text-6xl mb-4">☔️</div>
    <h3 className="text-lg">No quizzes created yet wey</h3>
  </div>
);

const QuizCard = ({ quiz, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="rounded-lg bg-gray-800 border-b border-gray-700 relative p-4">
      <div className="flex justify-between items-start">
        <span className="text-lg text-white">{quiz.title}</span>
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="text-white hover:text-gray-300 hover:bg-gray-700 p-1 rounded-full transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <Link href={`/quiz/${quiz.id}`} className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white">
                  <Play className="mr-3 h-5 w-5" />
                  Play Again
                </Link>
                <button
                  onClick={() => {
                    onDelete(quiz.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white"
                >
                  <Trash2 className="mr-3 h-5 w-5" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2">
          <ScoreTag icon={Check} color="green" score={quiz.correct || 0} />
          <ScoreTag icon={X} color="red" score={quiz.incorrect || 0} />
        </div>
        <Link href={`/quiz/${quiz.id}`} passHref>
          <Button
            variant="outline"
            className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:text-white"
          >
            Take Quiz
          </Button>
        </Link>
      </div>
    </div>
  );
};

const ScoreTag = ({ icon: Icon, color, score }) => (
  <span className={`bg-${color}-600 text-${color}-100 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center`}>
    <Icon className="h-3 w-3 mr-1" />
    {score}
  </span>
);

const Navigation = () => (
  <nav className="bg-gray-800 border-t border-gray-700 fixed bottom-0 left-0 right-0 z-10">
    <div className="w-full px-4">
      <ul className="flex justify-around py-2">
        <NavItem href="/" icon={Home} label="Home" />
        <NavItem href="/create" icon={PlusCircle} label="Create Quiz" />
        <NavItem href="/account" icon={User} label="Account" />
      </ul>
    </div>
  </nav>
);

const NavItem = ({ href, icon: Icon, label, active }) => (
  <li>
    <Link href={href} passHref legacyBehavior>
      <a className={`flex flex-col items-center text-xs ${active ? 'text-white' : 'text-gray-400 hover:text-gray-300'} transition-colors duration-200`}>
        <Icon className="h-6 w-6" />
        <span>{label}</span>
      </a>
    </Link>
  </li>
);

export default HomeScreen;














