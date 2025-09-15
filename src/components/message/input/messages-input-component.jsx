import React from "react";
import "./messages-input-component.styles.scss";

const MessagesInputComponent = ({ onSendMessage, disabled }) => {
    const [message, setMessage] = React.useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };
    
    return (
        <form className="message-input">
            <div className="input-container">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about recent news..."
                    disabled={disabled}
                    rows={1}
                />
            </div>
        </form>
    )
}
export default MessagesInputComponent