import React from 'react';
import {BrowserRouter as Router, Route, Routes, useParams} from 'react-router-dom';
import Users from "./pages/user/Users";
import UserDetail from "./components/user-detail/UserDetail";
import NotFound from "./pages/error/NotFound";
import Navigation from "./components/navigation/Navigation";
import ChatComponent_V1 from "./pages/chat/ChatComponent_V1";
import LoginComponent from "./components/login/LoginComponent";
import PrivateChat from "./pages/chat/PrivateChat";
import Boards from "./pages/boards/Boards";
import ChatComponent_V3 from "./pages/chat/ChatComponent_V3"; // ChatComponent_V3 임포트

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeLayout />} />
                <Route path="/users" element={<Users />} />
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/chat1" element={<ChatComponent_V1 />} />
                <Route path="/boards" element={<Boards />} />
                <Route path="/chat/private/:boardId" element={<PrivateChat />} /> {/* 게시물 작성자와 1대1 채팅 */}
                <Route path="/chat/room/:roomName/:userName" element={<ChatComponent_V3Wrapper />} /> {/* ChatComponent_V3 라우팅 */}
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

const HomeLayout: React.FC = () => {
    return (
        <div>
            <h2>리엑트 네스트 예제</h2>
            <Navigation />
        </div>
    );
};

// ChatComponent_V3를 래핑한 컴포넌트
const ChatComponent_V3Wrapper: React.FC = () => {
    const { roomName, userName } = useParams();  // URL에서 roomName과 userName 추출
    if (!roomName || !userName) {
        return <NotFound />;
    }
    return <ChatComponent_V3 roomName={roomName} userName={userName} />;
};

export default App;
