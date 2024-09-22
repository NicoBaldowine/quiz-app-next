// components/QuizScreen.js

import React, { useState } from 'react';
import ResultScreen from './ResultScreen';
import { Button } from '@nextui-org/react';

const QuizScreen = ({ question, answers, correctAnswer, onRetry }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState('');

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();

    if (normalizedAnswer === normalizedCorrectAnswer) {
      setResult('Correct!');
    } else {
      setResult(`Incorrect. The correct answer is: ${correctAnswer}`);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  if (result) {
    return <ResultScreen result={result} onRetry={onRetry} />;
  }

  return (
    <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
      <h2>{question}</h2>
      <div style={{ margin: '20px 0' }}>
        {answers.map((answer, index) => (
          <Button
            key={index}
            onClick={() => handleAnswer(answer)}
            disabled={selectedAnswer !== null}
            style={{
              margin: '12px 16px',
              height: '40px',
              width: 'calc(100% - 32px)',
            }}
          >
            {`${optionLetters[index]}) ${answer}`}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuizScreen;






