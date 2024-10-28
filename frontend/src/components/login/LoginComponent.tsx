import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {LoginResponse} from '../../types/auth/LoginResponse';
import {useAuth} from "../../auth/AuthContext"; // 타입 정의 가져오기

const LoginComponent: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userInfo, setUserInfo] = useState<{ name: string; age: number; introduce: string; } | null>(null);

    const navigate = useNavigate(); // 페이지 이동을 위한 훅
    const { login } = useAuth(); // AuthContext에서 login 함수 가져오기

    const handleLogin = async () => {
        try {
            // 로그인 요청
            const response = await axios.post<LoginResponse>('http://localhost:4000/users/login', {
                username,
                password,
            });

            const { token, userResponse } = response.data;

            // 1. 토큰과 사용자 정보 저장 (AuthContext에 저장)
            login(token, userResponse); // 토큰과 사용자 정보를 Context와 로컬 스토리지에 저장

            // 2. 사용자 정보 저장
            const { name, age, introduce } = userResponse;
            setUserInfo({ name, age, introduce }); // 사용자 정보 저장

            // 3. 로그인 성공 시 프로필 페이지로 이동
            navigate('/profile');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

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
            {/* onClick에 화살표 함수 사용 */}
            <button onClick={() => handleLogin()}>Login</button>
        </div>
    );
};

export default LoginComponent;
