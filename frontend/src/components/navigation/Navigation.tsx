import React from 'react';
import {Link} from 'react-router-dom';

const Navigation: React.FC = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/users">User List</Link></li>
                <li><Link to="/login">login</Link></li>
                {/*<li><Link to="/users/chatroom">Chat Room</Link></li>*/}
            </ul>
        </nav>
    );
};

export default Navigation;