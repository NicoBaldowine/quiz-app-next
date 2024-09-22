// components/HomeScreen.js

import React from 'react';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

const HomeScreen = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
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
          <Button color="primary">Account</Button>
        </Link>
        <Link href="/create" passHref>
          <Button color="secondary">Create a Quiz</Button>
        </Link>
      </div>

      {/* Empty State Message */}
      <h3>No quizzes available yet.</h3>
    </div>
  );
};

export default HomeScreen;




