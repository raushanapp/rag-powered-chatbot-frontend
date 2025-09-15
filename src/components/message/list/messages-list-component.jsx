import React from "react";
import "./messages-list-component.styles.scss";

const MessagesListComponent = ({ messages, isLoading }) => {
    const formatTimestamp = (timestamp) => {
        let time = new Date().toISOString();
        let format;
        if (!timestamp) {
            format = time;
        }
        else {
            format = timestamp;
        }
        return new Date(format).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };
    
    return (
        <div className="message-list">
            {messages.length === 0 && (
                <div className="welcome-message">
                    <h3>Welcome to RAG News Chatbot!</h3>
                    <p>Ask me anything about recent news and I'll help you find relevant information.</p>
                </div>
            )}

            {messages.map((message) => (
                <div 
                    key={message.id} 
                    className={`message ${message?.type}`}
                >
                    <div className="message-content">
                        <div className="message-text">
                            {message.message}
                        </div>
                        <div className="message-timestamp">
                            {formatTimestamp(message?.timestamp)}
                        </div>
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="message bot loading">
                    
                    <div className="message-content">
                        
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        
                    </div>
                    
                </div>
                
            )}
        </div>
    )
}
export default MessagesListComponent;