import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import QuizScreen from '../../components/QuizScreen';
import { Loader2 } from "lucide-react"; // Make sure to install lucide-react if you haven't

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
    <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
    <p className="mt-4 text-lg text-white">Loading quiz...</p>
  </div>
);

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

  if (!quizData) return <LoadingSpinner />;

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

