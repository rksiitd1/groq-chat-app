const express = require('express');
const { Groq } = require('groq-sdk');
require('dotenv').config();

const app = express();
const port = 5000;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: req.body.messages,
      model: "llama3-8b-8192",
    });

    res.json(completion.choices[0]?.message);
  } catch (error) {
    console.error('Error calling Groq API:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});