import React from 'react';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

const ResultScreen = ({ result, correctAnswer, onRetry }) => {
  // Determine if the answer is correct or incorrect
  const isCorrect = result.toLowerCase() === 'correct' || result.toLowerCase() === 'correct!';

  // Set emoji based on the result
  const emoji = isCorrect ? '✨' : '☔️';

  // Set the title based on the result
  const title = isCorrect ? 'Correct answer' : 'Wrong answer';

  // Ensure that the correctAnswer is always shown
  const displayAnswer = correctAnswer || 'N/A';

  return (
    <div
      style={{
        textAlign: 'center',
        maxWidth: '700px',
        margin: '0 auto',
        backgroundColor: '#1e1e1e', // Dark background
        color: '#fff', // White text
        height: '100vh', // Full viewport height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px', // Add padding for spacing
      }}
    >
      {/* Emoji */}
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{emoji}</div>

      {/* Title */}
      <h2 style={{ fontSize: '32px', fontFamily: 'Inter, sans-serif', marginBottom: '8px' }}>
        {title}
      </h2>

      {/* Description */}
      <p style={{ fontSize: '16px', color: '#BAAAAA', fontFamily: 'Inter, sans-serif', marginBottom: '40px' }}>
        the right answer was "{displayAnswer}"
      </p>

      {/* Buttons */}
      <div style={{ width: '100%', padding: '0 16px' }}>
        <Button
          onClick={onRetry}
          style={{
            backgroundColor: '#7346AE', // Main button color
            color: '#fff',
            width: '100%',
            borderRadius: '8px',
            marginBottom: '16px', // Add margin between buttons
            padding: '12px 16px',
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Do it again!
        </Button>

        <Link href="/" passHref>
          <Button
            as="a"
            light
            style={{
              width: '100%',
              color: '#fff', // Text-only button
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Go home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ResultScreen;






