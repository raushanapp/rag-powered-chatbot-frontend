import { useEffect, useRef, useState } from 'react';
import { io} from 'socket.io-client';

const useSocket = (serverUrl) => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);
    useEffect(() => {
        socketRef.current = io(serverUrl);
            socketRef.current.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to server');
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from server');
        });

        return () => {
            socketRef.current?.disconnect();
        };

    }, [serverUrl]);

    const sendMessage = (sessionId,message) => {
        socketRef.current?.emit('send-message', { sessionId, message });
    };
    
    const onBotResponse = (callback) => {
        socketRef.current?.on('bot-response', callback);
    };

    const onError = (callback) => {
        socketRef.current?.on('error', callback);
    };

    return { socket: socketRef.current, isConnected, sendMessage, onBotResponse, onError, };
}
export default useSocket;