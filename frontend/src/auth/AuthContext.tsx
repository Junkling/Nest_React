import React, { createContext, useReducer, useContext } from 'react';

// AuthContext 생성
const AuthContext = createContext<any>(null);

const initialState = {
    token: localStorage.getItem('token'),
};

const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, token: action.payload };
        case 'LOGOUT':
            return { ...state, token: null };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = (token: string) => {
        localStorage.setItem('token', token); // 로컬 스토리지에 토큰 저장
        dispatch({ type: 'LOGIN', payload: token }); // Context에 토큰 저장
    };

    const logout = () => {
        localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
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
