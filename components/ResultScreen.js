// components/ResultScreen.js

import React from 'react';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

const ResultScreen = ({ result, onRetry }) => {
  return (
    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
      <h2>{result}</h2>
      <div style={{ marginTop: '20px' }}>
        <Button onClick={onRetry} style={{ margin: '12px 16px' }}>
          Do it again!
        </Button>
        <Link href="/" passHref>
          <Button as="a" style={{ margin: '12px 16px' }}>
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ResultScreen;





