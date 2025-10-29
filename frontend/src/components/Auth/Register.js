import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../hooks/useAuth';
import './Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const { register, isAuthenticated } = useAuth();

    // Rediriger si l'utilisateur est déjà connecté
    useEffect(() => {
        if (isAuthenticated) {
            history.push('/tasks');
        }
    }, [isAuthenticated, history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation des champs
        if (!name || !email || !password) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }
        
        if (password.length < 8) {
            toast.error('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }
        
        setIsLoading(true);
        
        try {
            await register({ name, email, password });
            
            // Afficher un message de succès
            toast.success('Inscription réussie ! Redirection vers la page de connexion...');
            
            // Rediriger vers la page de connexion après un court délai
            setTimeout(() => {
                history.push('/login');
            }, 2000);
            
        } catch (error) {
            let errorMessage = "Une erreur s'est produite lors de l'inscription";
            
            if (error.response) {
                // Erreur du serveur avec un statut de réponse
                if (error.response.status === 422 && error.response.data.errors) {
                    // Récupérer le premier message d'erreur
                    const firstError = Object.values(error.response.data.errors)[0][0];
                    errorMessage = firstError || errorMessage;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                // La requête a été faite mais aucune réponse n'a été reçue
                errorMessage = 'Le serveur ne répond pas. Veuillez réessayer plus tard.';
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="register-form">
                <h2 className="text-center mb-4">Créer un compte</h2>
                <ToastContainer position="top-right" autoClose={5000} />
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            id="name" 
                            placeholder="Enter your name"
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            className="form-control form-control-lg" 
                            id="email" 
                            placeholder="Enter your email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control form-control-lg" 
                            id="password" 
                            placeholder="Enter your password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-muted">Already have an account? <Link to="/login" className="text-decoration-none">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;