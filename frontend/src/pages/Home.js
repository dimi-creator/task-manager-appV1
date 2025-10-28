import React from 'react';
import { useHistory } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/Home.css';

const Home = () => {
    const { user } = useAuth();
    const history = useHistory();

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Bienvenue sur Task Manager</h1>
                <p className="tagline">Organisez vos tâches simplement et efficacement</p>
                
                {user ? (
                    <div className="user-actions">
                        <h2>Bonjour, {user.name} !</h2>
                        <button 
                            className="cta-button"
                            onClick={() => history.push('/tasks')}
                        >
                            Voir mes tâches
                        </button>
                    </div>
                ) : (
                    <div className="auth-actions">
                        <button 
                            className="cta-button"
                            onClick={() => history.push('/login')}
                        >
                            Commencer maintenant
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;