import React, { useState } from "react";

export default function Interview() {
  const [domain, setDomain] = useState("web development");
  const [difficulty, setDifficulty] = useState("medium");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);

  // Get new random question
  const getQuestion = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/interview/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, difficulty })
      });
      const data = await res.json();
      setQuestion(data.question);
      setAnswer("");
      setResult(null);
    } catch (err) {
      console.error(err);
      alert("Backend not running ❌");
    }
  };

  // Voice input
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported ❌");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      setAnswer(event.results[0][0].transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
  };

  // Submit answer for evaluation
  const submitAnswer = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error evaluating ❌");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🤖 AI Interview System</h1>

      <div>
        <label>Domain: </label>
        <input value={domain} onChange={(e) => setDomain(e.target.value)} />
        <label style={{ marginLeft: "10px" }}>Difficulty: </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <button onClick={getQuestion} style={{ marginTop: "20px" }}>🎯 Get New Question</button>

      {question && (
        <div style={{ marginTop: "20px" }}>
          <h3>Question:</h3>
          <p>{question}</p>

          <textarea
            rows={5}
            cols={60}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type or use voice..."
          />
          <br />
          <button onClick={startListening}>
            🎤 {listening ? "Listening..." : "Speak"}
          </button>
          <button onClick={submitAnswer} style={{ marginLeft: "10px" }}>✅ Submit</button>
        </div>
      )}

      {result && (
        <div style={{ marginTop: "20px", background: "#eee", padding: "15px" }}>
          <h3>Result:</h3>
          <p>Score: {result.score}</p>
          <p>Feedback: {result.feedback}</p>
          <p>Improvement: {result.improvement}</p>
        </div>
      )}
    </div>
  );
}