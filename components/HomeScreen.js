import React from 'react';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

const HomeScreen = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        backgroundColor: '#1e1e1e', // Matching the background color
        color: '#fff', // White text to contrast with the dark background
        height: '100vh', // Ensure it takes up full viewport height
        padding: '2rem',
      }}
    >
      <h1>Available Quizzes</h1>

      {/* Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '1rem',
        }}
      >
        <Link href="/account" passHref>
          <Button color="primary" css={{ backgroundColor: '#0070f3', color: '#fff' }}>
            Account
          </Button>
        </Link>
        <Link href="/create" passHref>
          <Button color="secondary" css={{ backgroundColor: '#ff4081', color: '#fff' }}>
            Create a Quiz
          </Button>
        </Link>
      </div>

      {/* Empty State Message */}
      <h3 style={{ marginTop: '2rem' }}>No quizzes available yet.</h3>
    </div>
  );
};

export default HomeScreen;



