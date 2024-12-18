import React, { useCallback } from 'react';
import { User } from "../../types/user/User";
import {useNavigate} from "react-router-dom";

interface UserListProps {
    users: User[];
}

const UserList: React.FC<UserListProps> = React.memo(({ users }) => {
    const navigate = useNavigate();

    const handleUserClick = useCallback((userId: number) => {
        navigate(`/users/${userId}`); // 유저 상세 페이지로 이동
    }, [navigate]);

    return (
        <ul>
            {users.map(user => (
                <li key={user.id} onClick={() => handleUserClick(user.id)}>
                    {user.name} ({user.age}) [글 작성 수]: {user.boardIdsList.length}
                </li>
            ))}
        </ul>
    );
});

export default UserList;
