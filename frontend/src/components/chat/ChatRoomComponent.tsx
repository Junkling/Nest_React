import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import {PageResult} from "../../types/pagnation/PageResult";
import {ChatMessage} from "../../types/chat/ChatMessage";


const socket = io('http://localhost:4000'); // 서버의 소켓 주소와 동일해야 합니다.

const ChatRoomComponent: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!roomId) return;

        // 방에 입장
        socket.emit('joinRoom', roomId);

        // 이전 대화 내역 수신
        socket.on('loadedMessages', (previousMessages: PageResult<ChatMessage>) => {
            const sortedMessages = previousMessages.data.sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            setChatMessages(sortedMessages);
            scrollToBottom();
        });

        // 서버로부터 실시간 메시지 수신
        socket.on('receiveMessage', (msg: ChatMessage) => {
            setChatMessages((prevMessages) => [...prevMessages, msg]); // 새 메시지를 아래로 추가
            scrollToBottom();
        });

        return () => {
            socket.emit('leaveRoom', roomId);
            socket.off();
        };
    }, [roomId]);

    // 메시지 전송
    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                roomId,
                // Todo : 여기서 상태 관리해서 유저정보 넣어줘야 함
                sender: 'user1', // 실제 사용자 이름 또는 ID 사용
                message,
            };

            // 서버에 메시지 전송
            socket.emit('sendMessage', newMessage, (response: ChatMessage) => {
                // 서버로부터 전송된 메시지를 받아 클라이언트에 추가
                if (response) {
                    setChatMessages((prevMessages) => [...prevMessages, response]);
                    scrollToBottom();
                }
            });

            setMessage(''); // 입력창 초기화
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
    };

    return (
        <div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {chatMessages.length > 0 ? (
                    <ul>
                        {chatMessages.map((msg) => (
                            <li key={msg.id}>
                                <strong>{msg.sender}:</strong> {msg.message} <br />
                                <small>{formatDate(msg.createdAt)}</small>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No messages yet...</p>
                )}
                <div ref={messagesEndRef} />
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
