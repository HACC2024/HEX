// components/Chatbot.tsx

"use client";

import React, { useState } from 'react';
import { fetchChatbotResponse } from "../app/api";
import { MessageSquare, Send } from 'lucide-react';
import "bootstrap/dist/css/bootstrap.min.css";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{ question: string; response: string | null }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await fetchChatbotResponse(question);
      setChatHistory(prev => [...prev, { question, response }]);
      setQuestion("");
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setChatHistory(prev => [...prev, { 
        question, 
        response: "Sorry, I encountered an error. Please try again." 
      }]);
    }
    setLoading(false);
  };

  // Delete a chat entry
  const handleDelete = (index: number) => {
    setChatHistory(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="chatbox container mt-4 p-4 bg-white rounded shadow">
      <div className="d-flex flex-column align-items-center mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <MessageSquare className="text-primary" size={24} />
          <h3 className="mb-0">Pidgin HEX Admin</h3>
        </div>
      </div>

      <div className="chat-history mt-4">
        {chatHistory.length === 0 ? (
          <div className="empty-chatbox-message text-center py-5">
            <h4>
              Aloha! Ask me anything about managing HEX data!
            </h4>
          </div>
        ) : (
          chatHistory.map((chat, index) => (
            <div
              key={index}
              className="chat-entry border-bottom py-3 position-relative"
            >
              <p>
                <strong>You:</strong> {chat.question}
              </p>
              <div className="response-content">
                <span dangerouslySetInnerHTML={{ __html: chat.response || "" }} />
              </div>
              <button
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={() => handleDelete(index)}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="chatbox-form mt-4">
        <div className="input-group mb-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask the Admin..."
            required
            className="form-control"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary d-flex align-items-center gap-2"
          >
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Sending...</span>
                </div>
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;