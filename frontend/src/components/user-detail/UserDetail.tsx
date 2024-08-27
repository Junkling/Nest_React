import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from "../../pages/error/NotFound";
import {apiService} from "../../apis/apiService";

// User 타입 정의
interface User {
    id: number;
    name: string;
    age: number;
    introduce?: string; // introduce는 선택적 필드
}

const UserDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // URL에서 유저 ID를 추출
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); // 에러 메시지 상태

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!id) {
                    throw new Error("아이디는 필수 값입니다.");
                }

                const userId = parseInt(id, 10);
                if (isNaN(userId)) {
                    throw new Error("유효하지 않은 아이디입니다.");
                }

                const response = await apiService.fetchUserById(userId);
                setUser(response);
            } catch (error) {
                setError(error instanceof Error ? error.message : "유저 정보를 찾지 못했습니다.");
                console.error('유저 정보를 찾지 못했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!user) {
        return <NotFound />;
    }

    return (
        <div>
            <h2>유저 정보</h2>
            <p><strong>아이디:</strong> {user.id}</p>
            <p><strong>이름:</strong> {user.name}</p>
            <p><strong>나이:</strong> {user.age}</p>
            {user.introduce && <p><strong>자기소개:</strong> {user.introduce}</p>}
        </div>
    );
};

export default UserDetail;
