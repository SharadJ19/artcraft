const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Direct REST API call using the exact format from the curl example
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are Artie, a friendly and helpful assistant for ArtCraft, an online art and craft supplies store.
                Your role is to assist customers with questions about art supplies, crafting materials, orders, shipping, 
                returns, and product recommendations. Keep responses concise, helpful, and focused on art and craft topics.
                
                If asked about unrelated topics, politely redirect to art and craft subjects. Always try to keep resonses under 5 lines ! 
                
                Current customer query: ${message}`
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );

    // Extract the response text
    const responseText = response.data.candidates[0].content.parts[0].text;
    res.json({ response: responseText });
    
  } catch (error) {
    console.error('Chatbot API error:', error.response?.data || error.message);
    
    // Friendly fallback responses
    const fallbackResponses = [
      "Hi there! I'm Artie from ArtCraft. I'm having some technical difficulties at the moment, but I'd love to help you with any questions about our art supplies!",
      "Hello! I'm currently experiencing some connection issues. Please feel free to browse our art supplies collection or contact our support team at support@artcraft.com.",
      "I apologize for the inconvenience. I'm temporarily unavailable, but our website has plenty of information about our art and craft products. How can I help you once I'm back online?"
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    res.json({ response: randomResponse });
  }
});

module.exports = router;