import React, { useState } from 'react';
import { fetchUncleHexResponse } from "../app/api"; // Import the fetch function
import '../styles/UncleChatbot.css'; // Import the CSS file for styling

const UncleChatbot: React.FC = () => {
    const [question, setQuestion] = useState<string>('');
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);

        console.log("Submitting form with question:", question);

        try {
            const result = await fetchUncleHexResponse(question);
            setResponse(result);
        } catch (err) {
            console.error("Error during submission:", err); // Log the error for debugging
            if (err instanceof Error) {
                setError(err.message || 'An error occurred. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbox">
            <h1>Uncle HEX AI</h1>
            <form onSubmit={handleSubmit} className="chatbox-form">
                <div className="input-group">
                    <input
                        type="text"
                        id="question"
                        value={question}
                        placeholder="Speak with Uncle HEX..."
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                        className="question-input"
                    />
                </div>
                <button type="submit" disabled={loading} className="send-button">
                    {loading ? 'Sending...' : 'Send to Uncle HEX'}
                </button>
            </form>

            {error && <p className="error-message">Error: {error}</p>}
            {response && (
                <div className="response">
                    <h2>Uncle HEXs Response:</h2>
                    <div className="response-content" dangerouslySetInnerHTML={{ __html: response }} />
                </div>
            )}
        </div>
    );
};

export default UncleChatbot;
