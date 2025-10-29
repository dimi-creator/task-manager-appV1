import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../hooks/useAuth';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const { login, isAuthenticated } = useAuth();

    // Rediriger si l'utilisateur est déjà connecté
    useEffect(() => {
        if (isAuthenticated) {
            // Vérifier si l'utilisateur a été redirigé depuis une autre page
            const from = history.location.state?.from?.pathname || '/tasks';
            history.push(from);
        }
    }, [isAuthenticated, history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }
        
        setIsLoading(true);
        
        try {
            await login({ email, password });
            // La redirection est gérée par le contexte d'authentification
            // via l'effet qui surveille isAuthenticated
        } catch (error) {
            let errorMessage = 'Email ou mot de passe incorrect.';
            
            if (error.response) {
                // Erreur du serveur avec un statut de réponse
                if (error.response.status === 422 && error.response.data.errors) {
                    const firstError = Object.values(error.response.data.errors)[0];
                    errorMessage = Array.isArray(firstError) ? firstError[0] : 'Données invalides';
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.status === 500) {
                    errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
                }
            } else if (error.request) {
                // La requête a été faite mais aucune réponse n'a été reçue
                errorMessage = 'Le serveur ne répond pas. Vérifiez votre connexion internet.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            console.error('Erreur de connexion:', { error });
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="login-form">
                <h2>Connexion</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                    
                    <div className="links-container">
                        <div className="forgot-password">
                            <a href="/forgot-password">Mot de passe oublié ?</a>
                        </div>
                        <div className="register-link">
                            <p>Vous n'avez pas de compte ? <a href="/register">S'inscrire</a></p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
