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
      setResult('Incorrect!');
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  if (result) {
    // Pass the result and correctAnswer to ResultScreen
    return <ResultScreen result={result} correctAnswer={correctAnswer} onRetry={onRetry} />;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.question}>{question}</h2>
      <div style={styles.answersContainer}>
        {answers.map((answer, index) => (
          <Button
            key={index}
            onClick={() => handleAnswer(answer)}
            disabled={selectedAnswer !== null}
            style={styles.answerButton(selectedAnswer !== null)}
          >
            {`${optionLetters[index]}) ${answer}`}
          </Button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'left',
    maxWidth: '700px',
    margin: '0 auto',
    padding: '16px',
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    borderRadius: '8px',
  },
  question: {
    fontSize: '1.5rem',
    fontWeight: '500',
    marginBottom: '24px',
  },
  answersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  answerButton: (isDisabled) => ({
    backgroundColor: isDisabled ? '#444' : '#333',
    color: isDisabled ? '#aaa' : '#fff',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '1rem',
    textAlign: 'left',
    width: '100%',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    border: '1.5px solid rgba(255, 255, 255, 0.3)', // Flat solid border
    boxShadow: 'none', // Remove any shadow
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: !isDisabled ? 'rgba(255, 255, 255, 0.1)' : undefined, // White with 10% opacity on hover
    },
  }),
};

export default QuizScreen;





