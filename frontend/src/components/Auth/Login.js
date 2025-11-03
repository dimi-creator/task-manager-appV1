import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
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
            console.log('Utilisateur authentifié, redirection...');
            // Vérifier si l'utilisateur a été redirigé depuis une autre page
            const from = history.location.state?.from?.pathname || '/tasks';
            console.log('Redirection vers:', from);
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
            const result = await login({ email, password });
            
            if (result && result.success) {
                // Ajouter un petit délai pour s'assurer que l'état est mis à jour
                await new Promise(resolve => setTimeout(resolve, 100));
                return;
            }
            
            // Si on arrive ici, il y a une erreur inattendue
            console.error('Réponse inattendue du serveur:', result);
            throw new Error('Erreur inattendue lors de la connexion');
            
        } catch (error) {
            console.error('Erreur de connexion:', error);
            let errorMessage = 'Email ou mot de passe incorrect.';
            
            // Vérifier d'abord si c'est une erreur de validation Laravel
            if (error.response) {
                // Erreur de validation (422)
                if (error.response.status === 422 && error.response.data.errors) {
                    const firstError = Object.values(error.response.data.errors)[0];
                    errorMessage = Array.isArray(firstError) ? firstError[0] : 'Données invalides';
                } 
                // Erreur d'authentification (401)
                else if (error.response.status === 401) {
                    errorMessage = 'Email ou mot de passe incorrect.';
                } 
                // Erreur serveur (500)
                else if (error.response.status === 500) {
                    errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
                }
                // Autres erreurs avec un message
                else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } 
            // Erreur de connexion au serveur
            else if (error.request) {
                errorMessage = 'Le serveur ne répond pas. Vérifiez votre connexion internet.';
            } 
            // Autres erreurs
            else if (error.message) {
                // Si c'est notre message d'erreur personnalisé
                if (error.message === 'Impossible de se connecter au serveur') {
                    errorMessage = 'Impossible de se connecter au serveur. Veuillez réessayer.';
                } else {
                    errorMessage = error.message;
                }
            }
            
            console.error('Détails de l\'erreur:', { 
                message: error.message, 
                response: error.response?.data,
                status: error.response?.status
            });
            
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
                            <Link to="/forgot-password">Mot de passe oublié ?</Link>
                        </div>
                        <div className="register-link">
                            <p>Vous n'avez pas de compte ? <Link to="/register">S'inscrire</Link></p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
