import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {fetchUserById} from "../../apis/apiService";
import navigation from "../navigation/Navigation";
import NotFound from "../../pages/error/NotFound";

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

    useEffect(() => {
        // 예제 API 호출 (실제로는 백엔드 API를 호출하는 로직을 작성)
        const fetchUser = async () => {
            try {
                // API 요청 예시 (백엔드와의 통신 부분)
                if (id == null) {
                    return new Error("아이디는 필수 값입니다.")
                }
                const response = await fetchUserById(parseInt(id, 10));
                setUser(response);
            } catch (error) {
                console.error('유저정보를 찾지 못했습니다.:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser()
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
       return <NotFound />
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
