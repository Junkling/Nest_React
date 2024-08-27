import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from "../../apis/apiService";
import { Board } from "../../types/Board";

const Boards: React.FC = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await apiService.fetchBoards(1, 10, 'id', 'DESC');
                console.log(response);
                setBoards(response.data);
            } catch (error) {
                console.error('게시물 목록을 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchBoards();
    }, []);

    const goToPrivateChat = (boardId: number | undefined) => {
        if (!boardId) {
            console.error('사용자를 찾을 수 없습니다.');
            return;
        }
        navigate(`/chat/private/${boardId}`);
    };

    return (
        <div>
            <h1>Boards</h1>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {boards.map((board) => (
                    <li
                        key={board.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                            borderBottom: '1px solid #ccc',
                            paddingBottom: '10px'
                        }}
                    >
                        <span style={{ flexBasis: '10%', flexShrink: 0, marginRight: '10px' }}>
                            <strong>제목:</strong> {board.title}
                        </span>
                        <span style={{ flexBasis: '70%', flexShrink: 0, marginRight: '10px' }}>
                            <strong>설명:</strong> {board.description}
                        </span>
                        {board.userResponse?.name && (
                            <>
                                <span style={{ flexBasis: '10%', flexShrink: 0, marginRight: '10px' }}>
                                    <strong>작성자:</strong> {board.userResponse.name}
                                </span>
                                <button
                                    style={{ flexBasis: '10%', flexShrink: 0 }}
                                    onClick={() => goToPrivateChat(board.id)}
                                >
                                    메시지 보내기
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Boards;
