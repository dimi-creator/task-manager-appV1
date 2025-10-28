import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await api.get(`/user/${user.id}`);
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user]);

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h1>User Profile</h1>
            <div className="profile-info">
                <p><strong>Name:</strong> {profileData.name}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>Tasks Completed:</strong> {profileData.tasks_completed}</p>
                {/* Add more profile fields as needed */}
            </div>
        </div>
    );
};

export default Profile;