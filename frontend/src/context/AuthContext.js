import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    // Vérifier l'état de connexion au chargement
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
                // Configurer l'en-tête d'authentification par défaut
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (error) {
                console.error('Erreur lors du parsing des données utilisateur:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        
        setLoading(false);
    }, []);

    // Configuration de base d'Axios
    axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    axios.defaults.headers.common['Accept'] = 'application/json';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.withCredentials = true;
    
    // Configuration des en-têtes CORS
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = window.location.origin;
    axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    axios.defaults.headers.common['Access-Control-Allow-Credentials'] = 'true';

    // Intercepteur pour gérer les erreurs d'authentification
    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response?.status === 401) {
                // Si l'utilisateur n'est pas authentifié
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
                delete axios.defaults.headers.common['Authorization'];
                history.push('/login');
            }
            return Promise.reject(error);
        }
    );

    // Fonction de connexion
    const login = useCallback(async (credentials) => {
        try {
            if (!credentials || !credentials.email || !credentials.password) {
                throw new Error('Email et mot de passe sont requis');
            }
            
            console.log('Tentative de connexion avec les identifiants :', credentials);
            
            const response = await axios.post('/login', {
                email: credentials.email,
                password: credentials.password,
                device_name: 'browser'
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': window.location.origin,
                    'Access-Control-Allow-Credentials': 'true'
                },
                withCredentials: true
            });
            
            console.log('Réponse du serveur:', response.data);
            
            if (response.data && response.data.token && response.data.user) {
                const { token, user: userData } = response.data;
                
                // Stocker le token et les données utilisateur
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Configurer l'en-tête d'authentification par défaut
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                // Mettre à jour l'état utilisateur
                setUser(userData);
                
                console.log('Utilisateur connecté avec succès:', userData);
                return { success: true, user: userData };
            } else {
                const error = new Error('Réponse du serveur invalide');
                error.response = { status: 500 };
                throw error;
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            // Si l'erreur ne contient pas de réponse, on en crée une
            if (!error.response) {
                const newError = new Error('Erreur de connexion au serveur');
                newError.response = { status: 0, data: { message: 'Impossible de se connecter au serveur' } };
                throw newError;
            }
            throw error;
        }
    }, []);

    // Fonction de déconnexion
    const logout = useCallback(async () => {
        try {
            await axios.post('/logout');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            throw error; // Propagez l'erreur pour la gérer dans le composant
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            toast.info('Vous avez été déconnecté avec succès');
            history.push('/login');
        }
    }, [history]);

    // Fonction d'inscription
    const register = useCallback(async (userData) => {
        try {
            await axios.post('/register', {
                ...userData,
                password_confirmation: userData.password
            });
            
            toast.success('Inscription réussie ! Veuillez vous connecter.');
            return { success: true };
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            throw error;
        }
    }, []);

    // Vérifier si l'utilisateur est authentifié
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                loading, 
                isAuthenticated,
                login, 
                logout, 
                register 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};