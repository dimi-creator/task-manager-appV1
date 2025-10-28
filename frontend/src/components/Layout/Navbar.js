import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const history = useHistory();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.info('Vous avez été déconnecté avec succès');
        history.push('/login');
        setIsOpen(false);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Fermer le menu lors du changement de route
    useEffect(() => {
        const handleRouteChange = () => {
            setIsOpen(false);
        };
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" onClick={() => setIsOpen(false)}>
                    Task Manager
                </Link>
                
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    onClick={toggleMenu}
                    aria-expanded={isOpen ? 'true' : 'false'}
                    aria-label="Toggle navigation"
                >
                    {isOpen ? (
                        <FontAwesomeIcon icon={faTimes} />
                    ) : (
                        <FontAwesomeIcon icon={faBars} />
                    )}
                </button>
                
                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link 
                                className="nav-link" 
                                to="/" 
                                onClick={() => setIsOpen(false)}
                            >
                                Accueil
                            </Link>
                        </li>
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link 
                                    className="nav-link" 
                                    to="/tasks"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Mes tâches
                                </Link>
                            </li>
                        )}
                    </ul>
                    
                    <div className="d-flex
                    ">
                        {isAuthenticated ? (
                            <button 
                                className="btn btn-outline-light" 
                                onClick={handleLogout}
                            >
                                Déconnexion
                            </button>
                        ) : (
                            <div className="d-flex flex-column flex-lg-row">
                                <Link 
                                    className="btn btn-outline-light me-lg-2 mb-2 mb-lg-0" 
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Connexion
                                </Link>
                                <Link 
                                    className="btn btn-primary" 
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                >
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
