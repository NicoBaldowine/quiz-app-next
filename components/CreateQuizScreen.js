import React, { useState } from 'react';
import axios from 'axios';
import QuizScreen from './QuizScreen';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { AiOutlineClose } from 'react-icons/ai';

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
    setQuizData(null);
    createQuiz(); // Call createQuiz to generate a new quiz based on the same title
  };

  return (
    <div
      style={{
        backgroundColor: '#1e1e1e', // Full-page background color
        height: '100vh', // Full viewport height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', // Align content to the top
        paddingTop: '50px', // Adds spacing from the top
      }}
    >
      {/* Centered Container */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '700px', // Width of the content container
          width: '100%', // Ensures full width responsiveness
          padding: '20px',
          backgroundColor: '#1e1e1e', // Container background
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <Link href="/" passHref legacyBehavior>
          <Button
            as="a"
            auto
            light
            style={{
              fontSize: '24px',
              background: 'transparent',
              color: '#fff',
              position: 'absolute',
              top: '10px',
              right: '10px', // Right-align the X icon
            }}
          >
            <AiOutlineClose />
          </Button>
        </Link>

        {/* Title */}
        <h1 style={{ color: '#fff', textAlign: 'center' }}>What would you like to learn today?</h1>

        {!quizData && (
          <>
            {/* Input Field */}
            <input
              type="text"
              placeholder="Type for any topic..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                marginTop: '20px',
                padding: '12px',
                fontSize: '16px',
                width: '100%', // Full width inside the container
                backgroundColor: '#333',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '4px',
                boxSizing: 'border-box', // Ensures proper width calculation
              }}
            />
            <br />

            {/* Create Quiz Button */}
            <Button
              onClick={createQuiz}
              disabled={loading || !title}
              style={{
                marginTop: '20px',
                backgroundColor: '#7346AE', // Matching the purple button color
                color: '#fff',
                width: '100%', // Full width of the container
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '16px',
              }}
            >
              {loading ? 'Generating Quiz...' : 'Create Quiz'}
            </Button>

            {/* Error Message */}
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
    </div>
  );
};

export default CreateQuizScreen;














