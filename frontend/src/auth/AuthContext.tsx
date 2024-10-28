import React, { createContext, useReducer, useContext } from 'react';

// AuthContext 생성
const AuthContext = createContext<any>(null);

const initialState = {
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null, // 로컬 스토리지에서 사용자 정보 로드
};

const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, token: action.payload.token, user: action.payload.user };
        case 'LOGOUT':
            return { ...state, token: null, user: null };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = (token: string, user: any) => {
        localStorage.setItem('token', token); // 로컬 스토리지에 토큰 저장
        localStorage.setItem('user', JSON.stringify(user)); // 로컬 스토리지에 사용자 정보 저장
        dispatch({ type: 'LOGIN', payload: { token, user } }); // Context에 토큰과 사용자 정보 저장
    };

    const logout = () => {
        localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
        localStorage.removeItem('user'); // 로컬 스토리지에서 사용자 정보 제거
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// AuthContext를 사용하기 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);
