// pages/api/generate-quiz.js

import axios from 'axios';

let previousQuestions = [];
let difficultyLevel = 1;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Generate a unique and challenging quiz question based on the title: "${title}". 
              Current difficulty level: ${difficultyLevel} (1-10 scale, where 10 is most difficult).
              
              Rules:
              1. The question should be more difficult than previous questions.
              2. Do not repeat any previously asked questions.
              3. Provide four answer choices labeled A) to D).
              4. Specify the correct answer by its option letter (A, B, C, or D).
              
              Previous questions: ${JSON.stringify(previousQuestions)}
              
              Output your response exactly in the following JSON format (without any additional text or explanations):

              {
                "question": "Your unique and challenging question here",
                "answers": {
                  "A": "First option",
                  "B": "Second option",
                  "C": "Third option",
                  "D": "Fourth option"
                },
                "correctAnswer": "Option letter (A, B, C, or D)",
                "difficulty": "Numeric difficulty level (${difficultyLevel}-10)"
              }

              Ensure the JSON is properly formatted and does not include any extra characters or text.`,
            },
          ],
          max_tokens: 300,
          n: 1,
          temperature: 0.8,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Process the response and send back quiz data
      const generatedText = response.data.choices[0].message.content;
      console.log('Generated Text:', generatedText);

      let quizData;

      try {
        quizData = JSON.parse(generatedText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return res.status(500).json({ error: 'Failed to parse quiz data' });
      }

      const { question, answers, correctAnswer: correctOptionLetter, difficulty } = quizData;
      console.log('Parsed Quiz Data:', quizData);

      // Update previous questions and difficulty level
      previousQuestions.push(question);
      if (previousQuestions.length > 10) {
        previousQuestions.shift(); // Keep only the last 10 questions
      }
      difficultyLevel = Math.min(10, Math.max(difficultyLevel, parseInt(difficulty)));

      const optionsArray = ['A', 'B', 'C', 'D'];
      const answersArray = optionsArray.map((option) => answers[option]);

      const optionIndexMap = { A: 0, B: 1, C: 2, D: 3 };
      const correctAnswerIndex = optionIndexMap[correctOptionLetter.trim().toUpperCase()];
      const correctAnswer = answersArray[correctAnswerIndex];

      res.status(200).json({
        question,
        answers: answersArray,
        correctAnswer,
        difficulty: difficultyLevel,
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      res.status(500).json({ error: 'Failed to generate quiz' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
