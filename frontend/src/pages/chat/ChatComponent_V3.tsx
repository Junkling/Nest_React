import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatComponentProps {
    userName: string;
    roomName: string;
}

const socket: Socket = io('http://localhost:4000'); // 서버 주소에 맞게 변경

const ChatComponent_V3: React.FC<ChatComponentProps> = ({ userName, roomName }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // 방에 참여하는 로직
        socket.emit('joinRoom', roomName);

        // 서버로부터 메시지 수신
        socket.on('receiveMessage', (message: string) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessage');
            socket.emit('leaveRoom', roomName);  // 방 나가기 (선택사항)
        };
    }, [roomName]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            // 서버로 메시지 전송
            socket.emit('sendMessage', {
                roomName,
                sender: userName,
                message: newMessage,
            });
            setNewMessage('');  // 메시지 전송 후 입력창 초기화
        }
    };

    return (
        <div>
            <h2>Chat Room: {roomName}</h2>
            <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message"
                style={{ width: '80%' }}
            />
            <button onClick={sendMessage} style={{ width: '20%' }}>
                Send
            </button>
        </div>
    );
};

export default ChatComponent_V3;
