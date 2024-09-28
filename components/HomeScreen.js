"use client";

import React, { useState, useEffect, useRef } from 'react';  // Added useRef
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { Play, Trash2 } from "lucide-react";  // Removed unused imports
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
        {quizzes.length > 0 && <h1 className="text-3xl font-bold p-6">Quizzes</h1>}
        <div className="h-[calc(100vh-4rem)]"> {/* Adjusted height */}
          {quizzes.length === 0 ? (
            <EmptyQuizState />
          ) : (
            <div className="grid grid-cols-2 gap-3 px-3">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} onDelete={deleteQuiz} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Navigation />
    </div>
  );
};

const EmptyQuizState = () => (
  <div className="flex flex-col items-center pt-12 px-4"> {/* Changed from justify-center to pt-12 */}
    <div className="text-6xl mb-4">✨</div>
    <h3 className="text-2xl font-bold mb-4">Create a Quiz on Any Topic</h3>
    <p className="text-gray-400 mb-4 text-center max-w-md"> {/* Added text-center and max-w-md */}
      Discover new knowledge, test your skills, and learn something new along the way.
    </p>
    <Link href="/create" passHref>
      <Button className="bg-purple-600 hover:bg-purple-700 text-white font-normal py-2 px-4 rounded">
        Start Now
      </Button>
    </Link>
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
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
      <div className="flex justify-between items-center">
        <Button
          onClick={() => onDelete(quiz.id)}
          className="text-white hover:text-gray-200"
        >
          <Trash2 size={18} />
        </Button>
        <Link href={`/quiz/${quiz.id}`} passHref>
          <Button className="bg-transparent hover:bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2">
            Play
          </Button>
        </Link>
      </div>
    </div>
  );
};

const Navigation = () => (
  <nav className="bg-gray-800 fixed bottom-0 left-0 right-0 z-10">
    <div className="w-full px-4">
      <ul className="flex justify-around py-3">
        <NavItem href="/" icon={HomeIcon} label="Home" />
        <NavItem href="/create" icon={PlusIcon} label="Create" /> {/* Make sure this path is correct */}
        <NavItem href="/account" icon={UserIcon} label="Profile" />
      </ul>
    </div>
  </nav>
);

const NavItem = ({ href, icon: Icon, label, active }) => (
  <li>
    <Link href={href} passHref legacyBehavior>
      <a className={`flex flex-col items-center text-xs ${active ? 'text-blue-500' : 'text-gray-400 hover:text-gray-300'} transition-colors duration-200`}>
        <Icon className="h-6 w-6 mb-1" />
        <span>{label}</span>
      </a>
    </Link>
  </li>
);

// Custom icons for a more modern look
const HomeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const PlusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const UserIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default HomeScreen;














