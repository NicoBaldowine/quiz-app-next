"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { Play, Trash2, MoreVertical, Share } from "lucide-react";
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import AuthScreen from './AuthScreen';

// Define a set of vibrant colors
const cardColors = [
  'bg-[#FEDE67]', // Yellow
  'bg-[#FF9A62]', // Orange
  'bg-[#B6F36A]', // Lime Green
  'bg-[#C9A0FF]', // Lavender
  'bg-[#94DBFB]', // Light Blue
  'bg-[#F38C8C]', // Light Red/Pink
];

// Function to get a color based on quiz ID
const getColorForQuiz = (quizId) => {
  let colorSeed;
  if (typeof quizId === 'string') {
    colorSeed = quizId;
  } else if (typeof quizId === 'number') {
    colorSeed = quizId.toString();
  } else if (quizId && typeof quizId === 'object' && 'id' in quizId) {
    colorSeed = quizId.id.toString();
  } else {
    // Fallback to a random color if quizId is not as expected
    return cardColors[Math.floor(Math.random() * cardColors.length)];
  }
  
  const colorIndex = colorSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % cardColors.length;
  return cardColors[colorIndex];
};

const HomeScreen = () => {
  const [session, setSession] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadQuizzes();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadQuizzes();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data);
    } catch (error) {
      console.error("Error loading quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen pb-16 bg-gray-900 text-white">
      <main className="flex-1 w-full overflow-y-auto">
        {(quizzes.length > 0 || loading) && (
          <h1 className="text-2xl font-bold p-4">Quizzes</h1>
        )}
        <div className="h-[calc(100vh-4rem)]">
          {loading ? (
            <SkeletonLoader />
          ) : quizzes.length === 0 ? (
            <EmptyQuizState />
          ) : (
            <div className="grid grid-cols-2 gap-3 px-3">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} onDelete={deleteQuiz} onPlay={() => router.push(`/quiz/${quiz.id}`)} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Navigation />
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="grid grid-cols-2 gap-3 px-3">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="bg-gray-800 p-4 rounded-lg animate-pulse">
        <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 w-8 bg-gray-700 rounded"></div>
          <div className="h-8 w-20 bg-gray-700 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyQuizState = () => (
  <div className="flex flex-col items-center pt-12 px-4">
    <div className="text-4xl mb-4 w-8 h-8 flex items-center justify-center">✨</div>
    <h3 className="text-2xl font-barlow-condensed font-bold mb-4">Create a Quiz on Any Topic</h3>
    <p className="text-gray-400 mb-12 text-center max-w-md"> {/* Changed mb-4 to mb-12 */}
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
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  const router = useRouter();

  const cardColor = getColorForQuiz(quiz.id);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !menuButtonRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const playQuiz = () => {
    router.push(`/quiz/${quiz.id}`);
  };

  const handleMenuClick = () => {
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
    setShowMenu(!showMenu);
  };

  return (
    <div className={`${cardColor} rounded-2xl overflow-hidden flex flex-col p-4 shadow-lg`}>
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-800 mb-1 opacity-60">LEVEL 1</p>
        <h3 className="text-2xl font-barlow-condensed font-semibold text-gray-900 leading-tight">
          {quiz.title}
        </h3>
      </div>
      <div className="flex justify-between items-center mt-auto space-x-2">
        <button
          ref={menuButtonRef}
          onClick={handleMenuClick}
          className="bg-black bg-opacity-5 hover:bg-opacity-10 text-gray-900 font-semibold p-2 text-sm rounded-lg transition-colors duration-200 flex items-center justify-center w-10 h-10"
        >
          <MoreVertical size={18} />
        </button>
        <button
          onClick={playQuiz}
          className="border-2 border-black border-opacity-30 text-gray-900 font-semibold py-2 px-4 text-sm rounded-lg transition-colors duration-200 flex-1 hover:bg-black hover:bg-opacity-5"
        >
          Play
        </button>
      </div>
      {showMenu && (
        <div 
          ref={menuRef}
          style={{
            position: 'fixed',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
          className="w-48 bg-white rounded-md shadow-lg z-50 py-1"
        >
          <button
            onClick={() => {
              playQuiz();
              setShowMenu(false);
            }}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Play size={18} className="mr-3" />
            <span className="text-sm font-medium">Play Quiz</span>
          </button>
          <button
            onClick={() => {
              // Implement share functionality
              setShowMenu(false);
            }}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Share size={18} className="mr-3" />
            <span className="text-sm font-medium">Share</span>
          </button>
          <div className="border-t border-gray-200 my-1"></div>
          <button
            onClick={() => {
              onDelete(quiz.id);
              setShowMenu(false);
            }}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Trash2 size={18} className="mr-3" />
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

const Navigation = () => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

  return (
    <nav className="bg-gray-800 fixed bottom-0 left-0 right-0 z-10">
      <div className="w-full px-4">
        <ul className="flex justify-around py-3">
          <NavItem href="/" icon={isHomePage ? HomeIconFilled : HomeIcon} label="Home" active={isHomePage} />
          <NavItem href="/create" icon={PlusIcon} label="Create" />
          <NavItem href="/account" icon={UserIcon} label="Account" />
        </ul>
      </div>
    </nav>
  );
};

const NavItem = ({ href, icon: Icon, label, active }) => (
  <li>
    <Link href={href} passHref legacyBehavior>
      <a className={`flex flex-col items-center text-xs ${active ? 'text-white' : 'text-gray-400 hover:text-gray-300'} transition-colors duration-200`}>
        <Icon className={`h-6 w-6 mb-1 ${active ? 'fill-current' : ''}`} />
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

const HomeIconFilled = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
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