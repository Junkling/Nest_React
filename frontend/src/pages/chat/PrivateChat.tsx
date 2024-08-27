import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const socket: Socket = io('http://localhost:4000'); // 백엔드 서버 주소

const PrivateChat: React.FC = () => {
    const { boardId } = useParams<{ boardId: string }>();
    const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [recipientName, setRecipientName] = useState('');

    useEffect(() => {
        // 게시물 작성자 정보 가져오기
        const fetchBoardInfo = async () => {
            const response = await axios.get(`http://localhost:4000/boards/${boardId}`);
            setRecipientName(response.data.author); // 작성자 이름 설정
        };

        fetchBoardInfo();

        // 특정 방에 참여
        if (userName && recipientName) {
            socket.emit('joinRoom', { room: `${userName}_${recipientName}` });
        }

        // 메시지 수신
        socket.on('receiveMessage', (payload: { sender: string; message: string }) => {
            setMessages((prevMessages) => [...prevMessages, payload]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [boardId, userName, recipientName]);

    const sendPrivateMessage = () => {
        const payload = { sender: userName, message: newMessage, boardId: Number(boardId) };
        socket.emit('sendPrivateMessage', payload);
        setNewMessage('');
    };

    return (
        <div>
            <h1>Private Chat with {recipientName}</h1>
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
            <button onClick={sendPrivateMessage}>Send</button>
        </div>
    );
};

export default PrivateChat;
