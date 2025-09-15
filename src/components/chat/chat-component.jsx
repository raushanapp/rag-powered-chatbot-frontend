import React from "react";
import { v4 as uuidv4 } from "uuid";
import useSocket from "../../hooks/useSocket";
import apiService from "../../service/apiService";
import "./chat-component.styles.scss";
import MessagesListComponent from "../message/list/messages-list-component";
import MessagesInputComponent from "../message/input/messages-input-component";

const ChatComponent = () => {
    const [sessionId, setSessionId] = React.useState("");
    const [messages, setMessages] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const messageEndRef = React.useRef(null);

    const { socket, isConnected, sendMessage, onBotResponse, onError } = useSocket(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    
    React.useEffect(() => {
        initializeSession();
    }, []);

    React.useEffect(() => {
        if (socket && sessionId) {
            socket.emit("join-session", sessionId);
        }
    }, [socket, sessionId]);

    React.useEffect(() => {
        onBotResponse((data) => {
            const botMessage = {
                id: uuidv4(),
                type: "bot",
                message: data.message,
                timestamp: data.timeStamp,
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsLoading(false)
        });

        onError((error) => {
            console.error('Socket error:', error);
            setIsLoading(false);
        });
        
    }, [onBotResponse, onError]);

    React.useEffect(() => {
        scrollToBttom();
    }, [messages]);


    const initializeSession = async () => {
        try {
            const newSessionId = await apiService.createSession();
            setSessionId(newSessionId);
            // Load existing chat history if any
            const history = await apiService.getChatHistory(newSessionId);
            setMessages(history);
        } catch (error) {
            console.error('Failed to initialize session:', error);
        }
    };

    const handleSendMessage = (messageText) => {
        if (!messageText.trim() || !sessionId || isLoading) return;

        const userMessage = {
            id: uuidv4(),
            type: "user",
            message: messageText,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        sendMessage(sessionId, messageText);

    }

    const handleClearSession = async() => {
        if (!sessionId) return;

        try {
            await apiService.clearSession(sessionId);
            setMessages([]);
            await initializeSession();
        } catch (error) {
            console.error('Failed to clear session:', error);
        }
    }

    const scrollToBttom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <div className="chat-interface">
            <div className="chat-header">
                <h1>RAG News Chatbot</h1>
                <div className="header-controls">
                    <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                    <button 
                        className="clear-btn"
                        onClick={handleClearSession}
                        disabled={messages.length === 0}
                        
                    >
                        Clear Chat
                    </button>
                </div>
            </div>
            
            <div className="chat-container">
               <MessagesListComponent
                    messages={messages} 
                    isLoading={isLoading}
                />

                <div ref={messageEndRef} />

                <MessagesInputComponent 
                    onSendMessage={handleSendMessage}
                    disabled={!isConnected || isLoading}
                />
            </div>
        </div>
    )
    
}
export default ChatComponent;