import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import QuizScreen from '../../components/QuizScreen';

export default function QuizPage() {
  const router = useRouter();
  const { id } = router.query;
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchQuizData(id);
    }
  }, [id]);

  const fetchQuizData = async (quizId) => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (error) {
      console.error('Error fetching quiz:', error);
    } else {
      setQuizData(data);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };

  if (!quizData) return <div>Loading...</div>;

  return (
    <QuizScreen
      questions={quizData.questions}
      currentQuestionIndex={currentQuestionIndex}
      onRetry={() => setCurrentQuestionIndex(0)}
      onNextQuestion={handleNextQuestion}
      onAnswerSubmit={(isCorrect) => {
        // Update quiz score in Supabase
        supabase
          .from('quizzes')
          .update({
            [isCorrect ? 'correct' : 'incorrect']: supabase.rpc('increment', { x: 1 })
          })
          .eq('id', quizData.id);
      }}
      quizId={quizData.id}
      topic={quizData.title}
    />
  );
}

