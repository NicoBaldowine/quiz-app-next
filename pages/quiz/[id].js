// pages/quiz/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import QuizScreen from '../../components/QuizScreen'; // Adjust path if necessary

const QuizPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the quiz ID from the URL
  const [quizData, setQuizData] = useState(null);

  // Load quiz data from localStorage when the component is mounted
  useEffect(() => {
    if (id !== undefined) {
      const storedQuizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
      const selectedQuiz = storedQuizzes[id]; // Retrieve the quiz by its index
      setQuizData(selectedQuiz);
    }
  }, [id]);

  // If no quiz data is found, show a loading or error message
  if (!quizData) {
    return <div style={{ color: '#fff', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <QuizScreen
      question={quizData.question}
      answers={quizData.answers}
      correctAnswer={quizData.correctAnswer}
      title={quizData.title}
      onRetry={() => router.push('/')} // Go back to home after retry
    />
  );
};

export default QuizPage;
