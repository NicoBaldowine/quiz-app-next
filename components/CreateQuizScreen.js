// components/CreateQuizScreen.js

import React, { useState } from 'react';
import axios from 'axios';
import QuizScreen from './QuizScreen';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

const CreateQuizScreen = () => {
  const [title, setTitle] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createQuiz = async () => {
    if (!title) {
      alert('Please provide a quiz title.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/generate-quiz', { title });
      setQuizData(response.data);
    } catch (error) {
      console.error('Error generating quiz:', error.response?.data || error.message);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    // Reset quizData to null and call createQuiz to generate a new quiz
    setQuizData(null);
    createQuiz(); // Call createQuiz to generate a new quiz based on the same title
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Link href="/" passHref legacyBehavior>
        <Button as="a" auto>
          Close
        </Button>
      </Link>
      <h1>Create a Quiz</h1>

      {!quizData && (
        <>
          <input
            type="text"
            placeholder="Enter quiz title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              marginTop: '20px',
              padding: '10px',
              fontSize: '16px',
              width: '80%',
              maxWidth: '400px',
            }}
          />
          <br />
          <Button
            onClick={createQuiz}
            disabled={loading || !title}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Generating Quiz...' : 'Create Quiz'}
          </Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}

      {quizData && (
        <QuizScreen
          question={quizData.question}
          answers={quizData.answers}
          correctAnswer={quizData.correctAnswer}
          onRetry={handleRetry} // Pass the handleRetry function
          title={title} // Pass the title to QuizScreen
        />
      )}
    </div>
  );
};

export default CreateQuizScreen;







