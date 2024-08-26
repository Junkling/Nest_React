import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// socket.io 클라이언트 초기화
const socket: Socket = io('http://localhost:4000');  // 백엔드 서버 주소

// 랜덤 유저 이름 생성 함수
const generateRandomUsername = (): string => {
    return 'User' + Math.floor(Math.random() * 1000);
};

const ChatComponent_V1: React.FC = () => {
    const [messages, setMessages] = useState<{ sender: string, message: string }[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [username, setUsername] = useState<string>(generateRandomUsername());  // 랜덤 유저 이름 생성

    useEffect(() => {
        socket.on('receiveMessage', (payload: { sender: string, message: string }) => {
            setMessages((prevMessages) => [...prevMessages, payload]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const sendMessage = () => {
        const payload = { sender: username, message: newMessage };  // 랜덤 유저 이름 사용
        socket.emit('sendMessage', payload);
        setNewMessage('');
    };

    return (
        <div>
            <h1>Chat Room</h1>
            <p>Logged in as: <strong>{username}</strong></p> {/* 현재 유저 이름 표시 */}
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}: </strong>{msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatComponent_V1;
