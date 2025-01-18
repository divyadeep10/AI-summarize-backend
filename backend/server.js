const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors());

// Function to handle summarization using Hugging Face API
const handleSummarize = async (text) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/Falconsai/text_summarization',
      {
        inputs: text, // Pass the input text
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`, // Replace with your Hugging Face API token
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data[0] && response.data[0].summary_text) {
      return response.data[0].summary_text;
    } else {
      throw new Error('No summary returned from the API');
    }
  } catch (error) {
    console.error('Error in handleSummarize:', error.message || error);
    throw new Error('Failed to summarize text');
  }
};

// POST route for summarization
app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;

  // Input validation
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Call the summarization function
    const summary = await handleSummarize(text);

    // Respond with the generated summary
    res.json({ summary });
    console.log('Summary generated:', summary);
  } catch (error) {
    console.error('Error summarizing text:', error.message || error);
    res.status(500).json({ error: 'Error summarizing text' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
