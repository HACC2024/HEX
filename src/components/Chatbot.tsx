// components/Chatbot.js
import { useState } from "react";
import { fetchChatbotResponse } from "../app/api";
import "../styles/Chatbot.css"; // Import the CSS file for styling

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const answer = await fetchChatbotResponse(question);
      setResponse(answer);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }
  };

  return (
    <div className="chatbox">
      <h1>Pidgin HEX Admin</h1>
      <form onSubmit={handleSubmit} className="chatbox-form">
        <div className="input-group">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="question-input"
            required
          />
        </div>
        <button type="submit" className="send-button">Ask</button>
      </form>
      {response && (
        <div className="response">
          <h2>Response:</h2>
          <div className="response-content" dangerouslySetInnerHTML={{ __html: response }} />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
