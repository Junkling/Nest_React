import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'; // Socket.IO 클라이언트 라이브러리

const socket = io('http://localhost:4000'); // 서버의 소켓 주소와 동일해야 합니다.

const ChatRoomComponent: React.FC = () => {
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState<string[]>([]);

    useEffect(() => {
        // 방에 입장
        socket.emit('joinRoom', 'roomName'); // roomName은 실제 방 이름으로 대체해야 합니다.

        // 서버로부터 메시지를 수신할 때
        socket.on('receiveMessage', (msg: string) => {
            setChatMessages((prevMessages) => [...prevMessages, msg]);
        });

        // 컴포넌트 언마운트 시 소켓 해제
        return () => {
            socket.emit('leaveRoom', 'roomName');
            socket.off();
        };
    }, []);

    // 메시지 전송
    const sendMessage = () => {
        socket.emit('sendMessage', { roomName: 'roomName', sender: 'user1', message });
        setMessage('');
    };

    return (
        <div>
            <div>
                {chatMessages.length > 0 ? (
                    <ul>
                        {chatMessages.map((msg, index) => (
                            <li key={index}>{msg}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No messages yet...</p>
                )}
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
