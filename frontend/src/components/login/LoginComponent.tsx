import React, { useState } from 'react';
import axios from 'axios';
import ChatComponent_V2 from "../../pages/chat/ChatComponent_V2";

const LoginComponent: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userInfo, setUserInfo] = useState<{ name: string; age: number; introduce: string; boardIdsList: number[] } | null>(null);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4000/users/login', {
                username,
                password,
            });

            const { name, age, introduce, boardIdsList } = response.data;
            setUserInfo({ name, age, introduce, boardIdsList }); // 사용자 정보 저장
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    // 로그인 후 채팅 페이지로 넘어가는 방식
    if (userInfo) {
        return <ChatComponent_V2 userName={userInfo.name} />;
    }

    return (
        <div>
            <h1>Login</h1>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginComponent;
