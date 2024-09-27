// pages/quiz/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '../../lib/supabaseClient';  // Note the change here

// Dynamically import QuizScreen with ssr disabled
const QuizScreen = dynamic(() => import('../../components/QuizScreen'), { ssr: false });

const QuizPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuizData = useCallback(async () => {
    if (id) {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setQuizData(data);
        setCurrentQuestion({
          question: data.question,
          answers: data.answers,
          correct_answer: data.correct_answer
        });
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleNextQuestion = useCallback(async () => {
    // Here you would typically generate a new question
    // For now, let's just fetch the same question again
    await fetchQuizData();
  }, [fetchQuizData]);

  const handleAnswerSubmission = useCallback(async (isCorrect) => {
    if (!quizData) return;

    const field = isCorrect ? 'correct' : 'incorrect';
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ [field]: supabase.rpc('increment', { x: 1 }) })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating quiz score:", error);
    }
  }, [quizData, id]);

  if (isLoading) return <div>Loading...</div>;
  if (!quizData || !currentQuestion) return <div>Quiz not found</div>;

  return (
    <QuizScreen
      question={currentQuestion.question}
      answers={currentQuestion.answers}
      correct_answer={currentQuestion.correct_answer}
      onNextQuestion={handleNextQuestion}
      onAnswerSubmit={handleAnswerSubmission}
      quizId={id}
      topic={quizData.title}
    />
  );
};

export default QuizPage;

