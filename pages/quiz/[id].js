// pages/quiz/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import QuizScreen from '../../components/QuizScreen'; // Adjust path if necessary

const QuizPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the quiz ID from the URL
  const [quiz, setQuiz] = useState(null);

  // Load quiz data from Supabase when the component is mounted
  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id, fetchQuiz]);

  const fetchQuiz = useCallback(async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching quiz:", error);
    } else {
      setQuiz(data);
    }
  }, [id]);

  const handleRetry = async () => {
    // Reset the quiz or generate a new one
    // For now, we'll just refetch the same quiz
    await fetchQuiz();
  };

  // If no quiz data is found, show a loading or error message
  if (!quiz) return <div>Loading...</div>;

  return (
    <QuizScreen
      question={quiz.question}
      answers={quiz.answers}
      correctAnswer={quiz.correctAnswer}
      onRetry={handleRetry}
      quizId={id}
    />
  );
};

export default QuizPage;
