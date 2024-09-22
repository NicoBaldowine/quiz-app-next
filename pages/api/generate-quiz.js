// pages/api/generate-quiz.js

import axios from 'axios';

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
              content: `Generate a quiz question based on the title: "${title}". Provide four answer choices labeled A) to D), and specify the correct answer by its option letter (A, B, C, or D). Output your response exactly in the following JSON format (without any additional text or explanations):

{
  "question": "Your question here",
  "answers": {
    "A": "First option",
    "B": "Second option",
    "C": "Third option",
    "D": "Fourth option"
  },
  "correctAnswer": "Option letter (A, B, C, or D)"
}

Ensure the JSON is properly formatted and does not include any extra characters or text.`,
            },
          ],
          max_tokens: 200,
          n: 1,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Correct reference without process.env prefix
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

      const { question, answers, correctAnswer: correctOptionLetter } = quizData;
      console.log('Parsed Quiz Data:', quizData);

      const optionsArray = ['A', 'B', 'C', 'D'];
      const answersArray = optionsArray.map((option) => answers[option]);

      const optionIndexMap = { A: 0, B: 1, C: 2, D: 3 };
      const correctAnswerIndex = optionIndexMap[correctOptionLetter.trim().toUpperCase()];
      const correctAnswer = answersArray[correctAnswerIndex];

      res.status(200).json({
        question,
        answers: answersArray,
        correctAnswer,
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
