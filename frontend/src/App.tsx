import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Users from "./pages/user/Users";
import NotFound from "./pages/error/NotFound";
import Navigation from "./components/navigation/Navigation";
import LoginComponent from "./components/login/LoginComponent";
import Boards from "./pages/boards/Boards";
import Profile from "./components/Profile";
import {AuthProvider} from "./auth/AuthContext";
import ChatRoomComponent from "./components/chat/ChatRoomComponent"; // ChatComponent_V3 임포트

const App: React.FC = () => {
    return (
        <AuthProvider> {/* AuthProvider로 감싸기 */}
            <Router>
                <Routes>
                    <Route path="/" element={<HomeLayout/>}/>
                    <Route path="/users" element={<Users/>}/>
                    <Route path="/login" element={<LoginComponent/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/chat/:roomId" element={<ChatRoomComponent />} /> {/* 채팅방 경로 */}
                    <Route path="/boards" element={<Boards/>}/>
                    <Route path="/not-found" element={<NotFound/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

const HomeLayout: React.FC = () => {
    return (
        <div>
            <h2>리엑트 네스트 예제</h2>
            <Navigation/>
        </div>
    );
};

export default App;
