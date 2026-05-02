const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files from Vite build output
app.use(express.static(path.join(__dirname, 'dist')));

// AI Configuration
let aiConfig = {
  vertexai: true,
  project: process.env.GOOGLE_PROJECT_ID || 'election-assistant-494805',
  location: 'us-central1'
};

// Check for local service account file, otherwise fallback to ADC (Application Default Credentials)
const serviceAccountPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH;
if (serviceAccountPath && fs.existsSync(path.resolve(__dirname, serviceAccountPath))) {
  console.log('📦 Using local Service Account JSON');
  const keyFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, serviceAccountPath)));
  aiConfig.googleAuthOptions = { credentials: keyFile };
  aiConfig.project = keyFile.project_id;
} else {
  console.log('☁️ Using Application Default Credentials (Cloud Run)');
}

const ai = new GoogleGenAI(aiConfig);

const SYSTEM_INSTRUCTION = "You are the VoterQuest Global Election Authority. Your goal is to help users understand election processes, timelines, and steps for any country they ask about. Provide interactive, easy-to-follow, and strictly factual information about voting eligibility, polling stations, and election security worldwide.";

// Helper to map lang codes
const getLanguageName = (code) => {
  const mapping = {
    'hi': 'Hindi',
    'pt': 'Portuguese',
    'es': 'Spanish',
    'en': 'English'
  };
  return mapping[code] || 'English';
};

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, context, lang } = req.body;
    const targetLang = getLanguageName(lang);

    const contextualSystemInstruction = context 
      ? `You are the VoterQuest Authority. You are helping a user with the ${context} stage of the election process. Provide expert, concise advice based on 2026 regulations. YOU MUST RESPOND IN ${targetLang.toUpperCase()}.`
      : `${SYSTEM_INSTRUCTION} YOU MUST RESPOND IN ${targetLang.toUpperCase()}.`;

    const safeHistory = (history || []).map(msg => ({
      role: msg.role === 'bot' ? 'model' : msg.role,
      parts: msg.parts
    }));
    safeHistory.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: safeHistory,
      config: {
        systemInstruction: contextualSystemInstruction,
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
    const { base64Data, mimeType, lang } = req.body;
    const targetLang = getLanguageName(lang);
    
    const SCAN_SYSTEM_INSTRUCTION = `You are a specialized Indian ID parser. For Aadhaar cards, look specifically for the 'DOB' or 'Date of Birth' field located next to the profile photo. Return ONLY a valid JSON object. ALL TEXT FIELDS MUST BE IN ${targetLang.toUpperCase()} IF POSSIBLE.`;
    const prompt = `Analyze this ID card. Extract the following and return ONLY a valid JSON object: { "name": "...", "dob": "...", "address": "...", "city": "..." }.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [
        { role: 'user', parts: [{ text: prompt }, { inlineData: { data: base64Data, mimeType: mimeType } }] }
      ],
      config: {
        systemInstruction: SCAN_SYSTEM_INSTRUCTION,
        temperature: 0.1
      }
    });

    const text = response.text;
    const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const extractedData = JSON.parse(cleanJsonStr);

    const referenceYear = 2026;
    let age = 0;
    const dobStr = extractedData.dob || "";
    const yearMatch = dobStr.match(/\d{4}/);
    if (yearMatch) {
      const birthYear = parseInt(yearMatch[0]);
      age = referenceYear - birthYear;
    }

    const city = extractedData.city || (lang === 'hi' ? "आपका क्षेत्र" : "Your Area");
    const pollingStations = [
      `${city} Public School`,
      `${city} Community Hall`,
      `${city} Ward Office`
    ];

    res.json({
      ...extractedData,
      age,
      isEligible: age >= 18,
      pollingStations
    });
  } catch (error) {
    console.error('🔥 GenAI Scan Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/rumor-check', async (req, res) => {
  try {
    const { rumorText, lang } = req.body;
    const targetLang = getLanguageName(lang);
    const prompt = `You are the VoterQuest Global Fact-Checking Authority. Verify this rumor: "${rumorText}".
    Reply in ${targetLang.toUpperCase()} with exactly "[FACT]" or "[FAKE]" followed by a 2-sentence explanation. No markdown.`;

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

app.get('/api/regional-metrics/:country', async (req, res) => {
  const { country } = req.params;
  const { lang } = req.query;
  const targetLang = getLanguageName(lang);

  try {
    const SCAN_SYSTEM_INSTRUCTION = `You are an election analyst. Provide an update as of May 2026 in ${targetLang.toUpperCase()}.`;
    const prompt = `Provide a political pulse for ${country}. Return ONLY a JSON object:
    {
      "summary": "2-sentence summary in ${targetLang}",
      "metrics": [
        { "subject": "Stability (Translated to ${targetLang})", "value": 0-100 },
        { "subject": "Sentiment (Translated to ${targetLang})", "value": 0-100 },
        { "subject": "Activity (Translated to ${targetLang})", "value": 0-100 }
      ],
      "country": "${country}"
    }. No markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { 
        systemInstruction: SCAN_SYSTEM_INSTRUCTION,
        temperature: 0.3 
      }
    });

    const text = response.text;
    const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanJsonStr);

    res.json(data);
  } catch (error) {
    console.error('🔥 Regional Analysis Error:', error.message);
    const fallbackSummary = lang === 'hi' 
      ? `${country} के लिए वैश्विक चुनाव रिपोर्टिंग वर्तमान में मई 2026 चक्र के लिए एकत्रित की जा रही है।`
      : `Global election reporting for ${country} is currently being aggregated for the May 2026 cycle.`;
      
    res.json({
      summary: fallbackSummary,
      metrics: [
        { subject: lang === 'hi' ? "स्थिरता" : "Stability", value: 70 },
        { subject: lang === 'hi' ? "भावना" : "Sentiment", value: 65 },
        { subject: lang === 'hi' ? "गतिविधि" : "Activity", value: 85 }
      ],
      country: country
    });
  }
});

// Catch-all route for SPA (Middleware)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 VoterQuest Production Server running on port ${port}`);
});