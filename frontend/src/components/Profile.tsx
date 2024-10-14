import React, { useEffect } from 'react';
import useAxios from "../auth/UseAuthFetch";

const ProfileComponent: React.FC = () => {
    const axios = useAxios();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/users/profile');
                console.log('Profile data:', response.data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        fetchProfile();
    }, [axios]);

    return <div>Profile Component</div>;
};

export default ProfileComponent;
