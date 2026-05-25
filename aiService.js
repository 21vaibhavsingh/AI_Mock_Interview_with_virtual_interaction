const axios = require("axios");
const API_KEY = "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";

// Generate random question per call
async function generateQuestion(domain, difficulty) {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: `Generate a random ${difficulty} interview question in ${domain}. Only return question text. Do not repeat previous questions.`
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.log("QUESTION ERROR:", err.response?.data || err.message);
    return "Explain the concept of promises in JavaScript."; // fallback
  }
}

// Evaluate answer real-time
async function evaluateAnswer(question, answer) {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: `
Question: ${question}
Answer: ${answer}

Return JSON:
{
  "score": number,
  "feedback": "text",
  "improvement": "text"
}
          `
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return JSON.parse(res.data.choices[0].message.content);
  } catch (err) {
    console.log("EVALUATE ERROR:", err.response?.data || err.message);
    return { score: 5, feedback: "Fallback feedback", improvement: "Explain clearly" };
  }
}

module.exports = { generateQuestion, evaluateAnswer };