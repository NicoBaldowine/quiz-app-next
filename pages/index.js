// pages/index.js

import HomeScreen from '../components/HomeScreen';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';  // Note the change here

const HomePage = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function fetchQuizzes() {
      const { data, error } = await supabase
        .from('quizzes')
        .select('id, title, correct, incorrect') // Remove 'correctAnswer' from here
      
      if (error) {
        console.error('Error fetching quizzes:', error);
      } else {
        setQuizzes(data);
      }
    }

    fetchQuizzes();
  }, []);

  return <HomeScreen quizzes={quizzes} />;
};

export default HomePage;
