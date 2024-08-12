import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from "./pages/user/Users";
import UserDetail from "./components/user-detail/UserDetail";
import NotFound from "./pages/error/NotFound";
import Navigation from "./components/navigation/Navigation";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeLayout />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetail />} />
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
export default App;
