import React, { useState } from "react";
import "./AdminAnalyze.css";

const AdminAnalyze = () => {
  const [insights, setInsights] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [loadingInsights, setLoadingInsights] =
    useState(false);

  const [loadingQuestion, setLoadingQuestion] =
    useState(false);

  const generateInsights = async () => {
    try {
      setLoadingInsights(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admins/getBusinessInsights`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      const data = await response.json();

      setInsights(data.insights);
    } catch (err) {
      console.log(err);
      alert("Failed to generate insights");
    } finally {
      setLoadingInsights(false);
    }
  };

  const askAI = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    try {
      setLoadingQuestion(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admins/askAnalytics`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
          body: JSON.stringify({
            question,
          }),
        }
      );

      const data = await response.json();

      setAnswer(data.answer);
    } catch (err) {
      console.log(err);
      alert("Failed to get AI answer");
    } finally {
      setLoadingQuestion(false);
    }
  };

  return (
    <div className="analyze-page">
      <div className="analyze-overlay"></div>

      <div className="analyze-content">
        <div className="analyze-header">
          <h1>AI Business Analytics</h1>

          <p>
            Analyze LPG delivery trends using
            Gemini AI
          </p>
        </div>

        <div className="insights-section">
          <button
            className="analyze-btn"
            onClick={generateInsights}
            disabled={loadingInsights}
          >
            {loadingInsights
              ? "Analyzing..."
              : "Generate Business Insights"}
          </button>

          {insights && (
            <div className="result-card">
              <h2>Business Insights</h2>

              <pre>{insights}</pre>
            </div>
          )}
        </div>

        <form
          className="question-section"
          onSubmit={askAI}
        >
          <h2>Ask AI</h2>

          <textarea
            placeholder="Example: Which branch has the highest cancellation rate?"
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
          />

          <button
            type="submit"
            className="ask-btn"
            disabled={loadingQuestion}
          >
            {loadingQuestion
              ? "Thinking..."
              : "Ask Gemini"}
          </button>

          {answer && (
            <div className="result-card">
              <h2>AI Answer</h2>

              <pre>{answer}</pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminAnalyze;