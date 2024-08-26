import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:4000'); // 백엔드 서버 주소

interface ChatComponentProps {
    userName: string;
}

const ChatComponent_V2: React.FC<ChatComponentProps> = ({ userName }) => {
    const [messages, setMessages] = useState<{ sender: string; message: string; isJoinMessage?: boolean }[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // 사용자 입장 시 입장 메시지를 서버에 보냄
        socket.emit('userJoined', userName);

        // 서버로부터 메시지 수신
        socket.on('receiveMessage', (payload: { sender: string; message: string; isJoinMessage?: boolean }) => {
            setMessages((prevMessages) => [...prevMessages, payload]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [userName]);  // userName이 변경될 때마다 실행

    const sendMessage = () => {
        const payload = { sender: userName, message: newMessage };
        socket.emit('sendMessage', payload);
        setNewMessage('');
    };

    return (
        <div>
            <h1>Chat Room</h1>
            <p>Logged in as: <strong>{userName}</strong></p>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        {msg.isJoinMessage ? (
                            <span style={{ color: 'gray', fontWeight: 'normal' }}>{msg.message}</span>  // 회색, 굵지 않게 표시
                        ) : (
                            <div>
                                <strong>{msg.sender}: </strong>{msg.message}
                            </div>
                        )}
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

export default ChatComponent_V2;
