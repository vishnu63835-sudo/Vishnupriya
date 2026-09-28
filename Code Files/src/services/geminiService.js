const { GoogleGenAI } = require('@google/genai');

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing in .env file');
  }

  if (apiKey === 'your_google_gemini_api_key_here') {
    throw new Error('Please replace the default Gemini API key in .env');
  }

  return new GoogleGenAI({
    apiKey: apiKey.trim()
  });
};


// ===============================
// GENERATE AI ANSWER
// ===============================
const generateAnswer = async (question) => {
  try {
    if (!question || !question.trim()) {
      throw new Error('Question is required');
    }

    const ai = getClient();

    console.log('Gemini API request started...');
    console.log('Question:', question);

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: question
    });

    console.log('Gemini response received');

    const answer = response.text;

    if (!answer) {
      throw new Error('Gemini returned empty response');
    }

    return answer.trim();

  } catch (error) {
    console.error('==============================');
    console.error('GEMINI ERROR');
    console.error('Message:', error.message);
    console.error('Name:', error.name);
    console.error('Stack:', error.stack);
    console.error('==============================');

    throw new Error(`AI Answer Generation failed: ${error.message}`);
  }
};


// ===============================
// GENERATE FAQ
// ===============================
const generateFAQ = async (topic) => {
  try {
    if (!topic || !topic.trim()) {
      throw new Error('Topic is required');
    }

    const ai = getClient();

    console.log('Gemini FAQ request started...');
    console.log('Topic:', topic);

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `
Generate one FAQ about this topic:

${topic}

Return ONLY valid JSON in this format:

{
  "question": "FAQ question",
  "answer": "Detailed answer"
}
      `
    });

    const text = response.text;

    if (!text) {
      throw new Error('Gemini returned empty FAQ response');
    }

    // Remove markdown code fences if Gemini adds them
    const cleanText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const faqPair = JSON.parse(cleanText);

    if (!faqPair.question || !faqPair.answer) {
      throw new Error('Invalid FAQ response from Gemini');
    }

    return faqPair;

  } catch (error) {
    console.error('==============================');
    console.error('GEMINI FAQ ERROR');
    console.error('Message:', error.message);
    console.error('Name:', error.name);
    console.error('Stack:', error.stack);
    console.error('==============================');

    throw new Error(`AI FAQ Generation failed: ${error.message}`);
  }
};


module.exports = {
  generateAnswer,
  generateFAQ
};