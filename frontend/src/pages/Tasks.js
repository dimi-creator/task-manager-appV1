import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskList from '../components/Tasks/TaskList';
import TaskForm from '../components/Tasks/TaskForm';
import TaskFilter from '../components/Filters/TaskFilter';
import './Tasks.css';
import '../components/Pagination/Pagination.css';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const history = useHistory();
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    
    // État pour la pagination
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        perPage: 6,
        total: 0
    });
    
    // État pour les filtres
    const [filters, setFilters] = useState({
        status: '',
        category: ''
    });

    const API_URL = 'http://127.0.0.1:8000/api';

    const fetchTasks = useCallback(async (page = 1, filterParams = {}) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                history.push('/login');
                return;
            }
            
            // Créer un objet de paramètres propre sans valeurs vides
            const cleanFilters = Object.fromEntries(
                Object.entries(filterParams).filter(([_, value]) => value !== '' && value !== null)
            );
            
            const params = new URLSearchParams({
                page,
                per_page: 6,
                ...cleanFilters
            }).toString();
            
            const response = await axios.get(`${API_URL}/tasks?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status !== 200) {
                throw new Error('Failed to fetch tasks');
            }
            
            const { data, current_page, last_page, per_page, total } = response.data;
            
            // Mise à jour en une seule opération pour éviter les rendus multiples
            setTasks(data);
            setFilteredTasks(data);
            setPagination(prev => ({
                ...prev,
                currentPage: current_page,
                lastPage: last_page,
                perPage: per_page,
                total: total
            }));
        } catch (err) {
            console.error('Erreur lors de la récupération des tâches:', err);
            setError('Impossible de charger les tâches. Veuillez réessayer.');
            if (err.response?.status === 401) {
                history.push('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [API_URL, history]); // Ajout de history dans les dépendances

    // Chargement initial des tâches
    useEffect(() => {
        // Utiliser une fonction asynchrone auto-exécutée
        (async () => {
            await fetchTasks(1, filters);
            setIsFirstLoad(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Le tableau vide est intentionnel - on ne veut exécuter ceci qu'au montage
    
    // Effet séparé pour gérer les changements de filtres
    useEffect(() => {
        if (Object.keys(filters).length > 0) {
            const timer = setTimeout(() => {
                fetchTasks(1, filters);
            }, 300); // Délai pour éviter les appels trop fréquents
            
            return () => clearTimeout(timer);
        }
    }, [filters, fetchTasks]); // Dépend de filters et fetchTasks

    const handleAddOrUpdateTask = useCallback(async (taskData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                history.push('/login');
                return;
            }
            
            let response;
            
            if (editingTask) {
                // Mise à jour d'une tâche existante
                response = await axios.put(`${API_URL}/tasks/${editingTask.id}`, taskData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.status === 200) {
                    // Recharger les données depuis le serveur pour s'assurer d'avoir les dernières mises à jour
                    await fetchTasks(pagination.currentPage, filters);
                    setEditingTask(null);
                    toast.success('Tâche mise à jour avec succès !');
                }
            } else {
                // Création d'une nouvelle tâche
                response = await axios.post(`${API_URL}/tasks`, taskData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.status === 201) {
                    // Recharger la première page pour voir la nouvelle tâche
                    await fetchTasks(1, filters);
                    toast.success('Tâche ajoutée avec succès !');
                }
            }
        } catch (error) {
            console.error('Erreur lors de l\'opération sur la tâche:', error);
            toast.error(`Erreur lors de ${editingTask ? 'la mise à jour' : 'l\'ajout'} de la tâche`);
        }
    }, [API_URL, editingTask, fetchTasks, filters, pagination.currentPage, history]);
    
    const handleUpdateTask = useCallback(async (updatedTask) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                history.push('/login');
                return;
            }
            
            const response = await axios.put(
                `${API_URL}/tasks/${updatedTask.id}`, 
                updatedTask,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                // Recharger les données depuis le serveur
                await fetchTasks(pagination.currentPage, filters);
                setEditingTask(null);
                toast.success('Tâche mise à jour avec succès !');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la tâche:', error);
            toast.error('Erreur lors de la mise à jour de la tâche');
        }
    }, [API_URL, fetchTasks, filters, pagination.currentPage, history]);
    
    // Gestion du changement de page
    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= pagination.lastPage && newPage !== pagination.currentPage) {
            fetchTasks(newPage, filters);
        }
    }, [fetchTasks, filters, pagination.currentPage, pagination.lastPage]);
    
    // Gestion des filtres
    const handleFilterChange = useCallback((statusFilter, categoryFilter) => {
        const newFilters = {
            status: statusFilter || '',
            category: categoryFilter || ''
        };
        
        // Mettre à jour l'état des filtres
        setFilters(prevFilters => {
            // Vérifier si les filtres ont réellement changé
            if (prevFilters.status === newFilters.status && prevFilters.category === newFilters.category) {
                return prevFilters;
            }
            return newFilters;
        });
        
        // Réinitialiser à la première page avec les nouveaux filtres
        fetchTasks(1, newFilters);
    }, [fetchTasks]);

    const handleDeleteTask = useCallback(async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                history.push('/login');
                return;
            }
            
            const response = await axios.delete(`${API_URL}/tasks/${taskId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                // Vérifier si nous devons revenir à la page précédente
                const shouldGoToPrevPage = pagination.total % pagination.perPage === 1 && 
                                        pagination.currentPage > 1;
                
                const newPage = shouldGoToPrevPage ? 
                    Math.max(1, pagination.currentPage - 1) : 
                    pagination.currentPage;
                
                // Recharger les données depuis le serveur
                await fetchTasks(newPage, filters);
                toast.success('Tâche supprimée avec succès !');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la tâche:', error);
            toast.error('Erreur lors de la suppression de la tâche');
            if (error.response?.status === 401) {
                history.push('/login');
            }
        }
    }, [API_URL, fetchTasks, filters, pagination.currentPage, pagination.perPage, pagination.total, history]);

    // Supprimer handleFilterTasks car nous utilisons maintenant le filtrage côté serveur


    // Afficher un indicateur de chargement uniquement pendant le chargement initial
    if (loading && isFirstLoad) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement de vos tâches...</span>
                </div>
            </div>
        );
    }
    
    // Si pas de tâches après le chargement, afficher le formulaire de création
    if (tasks.length === 0) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header text-center">
                                <h2>Bienvenue dans votre gestionnaire de tâches</h2>
                            </div>
                            <div className="card-body text-center">
                                <p className="lead">Vous n'avez pas encore de tâches. Commencez par en créer une !</p>
                                <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={() => setShowTaskForm(true)}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>Créer ma première tâche
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Formulaire de création de tâche */}
                <TaskForm 
                    show={showTaskForm}
                    onHide={() => setShowTaskForm(false)}
                    onSubmit={(taskData) => {
                        handleAddOrUpdateTask(taskData);
                        setShowTaskForm(false);
                    }}
                    task={null}
                />
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                Erreur: {error}
            </div>
        );
    }

    return (
        <div className="tasks-container">
            <header className="tasks-header">
                <h1>Gestionnaire de Tâches</h1>
                <p>Gérez efficacement vos tâches quotidiennes</p>
            </header>
            
            <div className="tasks-content">
                <div className="tasks-form-container">
                    <h2>{editingTask ? 'Modifier la tâche' : 'Ajouter une tâche'}</h2>
                    <TaskForm 
                        task={editingTask}
                        onTaskSubmit={handleAddOrUpdateTask}
                        onCancel={() => setEditingTask(null)}
                    />
                    
                    <div style={{ marginTop: '2rem' }}>
                        <h3>Filtrer les tâches</h3>
                        <TaskFilter 
                            tasks={tasks} 
                            onFilterChange={handleFilterChange} 
                        />
                    </div>
                </div>
                
                <div className="tasks-list-container">
                    <h2>Mes Tâches ({pagination.total})</h2>
                    <div className="tasks-list-wrapper">
                        {loading ? (
                            <div className="d-flex justify-content-center my-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Chargement...</span>
                                </div>
                            </div>
                        ) : filteredTasks.length === 0 ? (
                            <p className="no-tasks">Aucune tâche à afficher. Commencez par en ajouter une !</p>
                        ) : (
                            <TaskList 
                                tasks={filteredTasks} 
                                onTaskUpdate={handleUpdateTask} 
                                onTaskDelete={handleDeleteTask}
                                loading={loading}
                                error={error}
                            />
                        )}
                        
                        {/* Pagination */}
                        {!loading && pagination.total > 0 && (
                            <nav aria-label="Pagination" className="mt-4">
                                <ul className="pagination justify-content-center">
                                    <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={pagination.currentPage === 1}
                                        >
                                            &laquo; Précédent
                                        </button>
                                    </li>
                                    
                                    {Array.from({ length: Math.min(5, pagination.lastPage) }, (_, i) => {
                                        // Afficher les numéros de page autour de la page actuelle
                                        let pageNum;
                                        if (pagination.lastPage <= 5) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage >= pagination.lastPage - 2) {
                                            pageNum = pagination.lastPage - 4 + i;
                                        } else {
                                            pageNum = pagination.currentPage - 2 + i;
                                        }
                                        
                                        return (
                                            <li 
                                                key={pageNum} 
                                                className={`page-item ${pagination.currentPage === pageNum ? 'active' : ''}`}
                                            >
                                                <button 
                                                    className="page-link" 
                                                    onClick={() => handlePageChange(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            </li>
                                        );
                                    })}
                                    
                                    <li className={`page-item ${pagination.currentPage === pagination.lastPage ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={pagination.currentPage === pagination.lastPage}
                                        >
                                            Suivant &raquo;
                                        </button>
                                    </li>
                                </ul>
                                <div className="pagination-info">
                                    Page {pagination.currentPage} sur {pagination.lastPage} • 
                                    {pagination.total} tâche{pagination.total > 1 ? 's' : ''} au total
                                </div>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tasks;