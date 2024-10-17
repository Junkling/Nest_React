import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 import
import useAxios from "../auth/UseAuthFetch";
import {UserWithChatRoomResponse} from "../types/user/UserWithChatRoomResponse";

const ProfileComponent: React.FC = () => {
    const axios = useAxios();
    const navigate = useNavigate(); // 페이지 이동을 위한 훅
    const [profile, setProfile] = useState<UserWithChatRoomResponse | null>(null); // 프로필 상태 추가

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get<UserWithChatRoomResponse>('/users/profile');
                setProfile(response.data); // 상태 업데이트
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        fetchProfile();
    }, []);

    // 채팅방으로 이동하는 함수
    const goToChatRoom = (roomId: number, roomName: string) => {
        navigate(`/chat/${roomId}`, { state: { roomName } }); // 채팅방으로 이동하며 roomName도 전달
    };

    return (
        <div>
            <h1>Profile Component</h1>
            {/* 프로필 정보가 있을 경우에만 렌더링 */}
            {profile ? (
                <div>
                    {/* 유저 정보 */}
                    <h2>User Information</h2>
                    <p>ID: {profile.user.id}</p>
                    <p>Name: {profile.user.name}</p>
                    <p>Age: {profile.user.age}</p>
                    <p>Introduce: {profile.user.introduce || 'N/A'}</p>
                    <p>Gender: {profile.user.gender}</p>
                    <p>Match Open Status: {profile.user.matchOpenStatus ? 'Open' : 'Closed'}</p>

                    {/* 유저 채팅방 리스트 */}
                    <h2>Chat Rooms</h2>
                    {profile.chatRoomList.length > 0 ? (
                        <ul>
                            {profile.chatRoomList.map((chatRoom) => (
                                <li key={chatRoom.roomId} onClick={() => goToChatRoom(chatRoom.roomId, chatRoom.roomName)}>
                                    {chatRoom.roomName} (ID: {chatRoom.roomId})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No chat rooms available</p>
                    )}
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default ProfileComponent;
