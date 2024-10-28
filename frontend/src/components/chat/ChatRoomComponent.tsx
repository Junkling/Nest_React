import React, {useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router-dom';
import io, {Socket} from 'socket.io-client';
import {useAuth} from '../../auth/AuthContext';

interface ChatMessage {
    id: number;
    sender: string;
    message: string;
    createdAt: string;
}

const ChatRoomComponent: React.FC = () => {
    const {roomId} = useParams<{ roomId: string }>();
    const {token, user} = useAuth(); // AuthContext에서 토큰 가져오기
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null); // 수정 중인 메시지 ID
    const [editMessageText, setEditMessageText] = useState(''); // 수정 중인 메시지 내용
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null); // WebSocket 인스턴스 저장

    useEffect(() => {
        if (!roomId || !token) return;

        // WebSocket 연결 시 토큰을 쿼리 파라미터로 전달
        const newSocket = io('http://localhost:4000', {
            query: {token}, // 토큰을 포함해 WebSocket 연결 설정
        });

        setSocket(newSocket);

        // 방에 입장
        newSocket.emit('joinRoom', roomId);

        // 이전 대화 내역 수신
        newSocket.on('loadedMessages', (previousMessages) => {
            setChatMessages(previousMessages.data);
            scrollToBottom();
        });

        // 서버로부터 실시간 메시지 수신
        newSocket.on('receiveMessage', (msg: ChatMessage) => {
            setChatMessages((prevMessages) => [...prevMessages, msg]);
            scrollToBottom();
        });

        // 수정된 메시지 수신
        newSocket.on('messageUpdated', (updatedMessage: ChatMessage) => {
            setChatMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === updatedMessage.id ? updatedMessage : msg
                )
            );
        });

        // 컴포넌트 언마운트 시 소켓 해제
        return () => {
            newSocket.emit('leaveRoom', roomId);
            newSocket.off();
            newSocket.disconnect();
        };
    }, [roomId, token]);

    const sendMessage = () => {
        if (message.trim() && socket) {
            const newMessage = {roomId, sender: user.name, message};
            socket.emit('sendMessage', newMessage);
            setMessage('');
        }
    };

    const editMessage = (msg: ChatMessage) => {
        setEditingMessageId(msg.id);
        setEditMessageText(msg.message);
    };

    const saveEditedMessage = () => {
        if (editingMessageId && editMessageText.trim() && socket) {
            socket.emit('editMessage', {id: editingMessageId, message: editMessageText});
            setEditingMessageId(null);
            setEditMessageText('');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    return (
        <div>
            <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                {chatMessages.length > 0 ? (
                    <ul>
                        {chatMessages.map((msg) => (
                            <li key={msg.id}>
                                <strong>{msg.sender}:</strong>
                                {editingMessageId === msg.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editMessageText}
                                            onChange={(e) => setEditMessageText(e.target.value)}
                                        />
                                        <button onClick={saveEditedMessage}>Save</button>
                                    </>
                                ) : (
                                    <>
                                        {msg.message}
                                        <button onClick={() => editMessage(msg)}>Edit</button>
                                    </>
                                )}
                                <br/>
                                <small>{new Date(msg.createdAt).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No messages yet...</p>
                )}
                <div ref={messagesEndRef}/>
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoomComponent;
