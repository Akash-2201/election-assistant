const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Load your service account JSON
const keyFile = JSON.parse(fs.readFileSync(path.join(__dirname, 'election-assistant-494805-53d473202643.json')));

const ai = new GoogleGenAI({
  vertexai: true,
  project: keyFile.project_id,
  location: 'us-central1',
  googleAuthOptions: {
    credentials: keyFile
  }
});

const SYSTEM_INSTRUCTION = "You are the VoterQuest Global Election Authority. Your goal is to help users understand election processes, timelines, and steps for any country they ask about. Provide interactive, easy-to-follow, and strictly factual information about voting eligibility, polling stations, and election security worldwide.";

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    const safeHistory = (history || []).map(msg => ({
      role: msg.role === 'bot' ? 'model' : msg.role,
      parts: msg.parts
    }));
    safeHistory.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: safeHistory,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7
      }
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('🔥 GenAI Chat Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/scan-id', async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;
    const prompt = `You are an ID verification system. Extract the 'Name' and the 'State' from this ID card image. Return ONLY a valid JSON object: {"name": "Extracted Name", "state": "Extracted State"}. No markdown, just raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [
        { role: 'user', parts: [{ text: prompt }, { inlineData: { data: base64Data, mimeType: mimeType } }] }
      ]
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('🔥 GenAI Scan Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/rumor-check', async (req, res) => {
  try {
    const { rumorText } = req.body;
    const prompt = `You are the VoterQuest Global Fact-Checking Authority. Your job is to instantly verify election rumors for any country in the world. 

Analyze this forwarded message: "${rumorText}"

1. Identify the core claim and the implied country or region.
2. Reply with exactly "[FACT]" if the claim aligns with official election protocols for that region, or "[FAKE]" if it is misinformation, fear-mongering, or physically impossible.
3. Provide a maximum 2-sentence official explanation explaining why. 

Do not use markdown, bolding, or bullet points. Output only the tag and the explanation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('🔥 GenAI Rumor Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Vertex AI Server running on port ${port}`);
});