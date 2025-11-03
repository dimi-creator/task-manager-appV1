import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchTasks } from '../services/api';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Utilisez la fonction appropriée pour récupérer les données de l'utilisateur
                // Pour l'instant, utilisons fetchTasks comme exemple
                const response = await fetchTasks();
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