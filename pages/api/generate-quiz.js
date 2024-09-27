// pages/api/generate-quiz.js

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    try {
      console.log('Generating quiz for title:', title);
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Generate a unique and challenging quiz question based on the title: "${title}". 
              
              Rules:
              1. The question should be different from previous questions.
              2. Provide four answer choices without labeling them.
              3. Specify the correct answer as the full text of the correct option.
              
              Output your response exactly in the following JSON format (without any additional text or explanations):

              {
                "question": "Your unique and challenging question here",
                "answers": ["First option", "Second option", "Third option", "Fourth option"],
                "correct_answer": "The full text of the correct answer"
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

      console.log('OpenAI API response:', response.data);

      const generatedText = response.data.choices[0].message.content;
      console.log('Generated Text:', generatedText);

      let quizData;

      try {
        quizData = JSON.parse(generatedText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return res.status(500).json({ error: 'Failed to parse quiz data' });
      }

      console.log('Parsed Quiz Data:', quizData);

      res.status(200).json(quizData);
    } catch (error) {
      console.error('Error generating quiz:', error);
      if (error.response) {
        console.error('OpenAI API error response:', error.response.data);
      }
      res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
