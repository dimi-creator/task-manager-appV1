import React, { useState, useEffect } from 'react';
import './TaskForm.css';
// import axios from 'axios';

const TaskForm = ({ task, onTaskSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('personnel');
    // Le statut par défaut est 'pending' (en attente)
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setCategory(task.category || 'personnel');
            setStatus(task.status || 'pending');
        } else {
            // Réinitialiser le formulaire s'il n'y a pas de tâche à éditer
            setTitle('');
            setDescription('');
            setCategory('personnel');
            setStatus('pending');
        }
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = { 
            title, 
            description, 
            category: category || 'personnel',
            // Toujours s'assurer que le statut est défini
            status: status === 'en_attente' ? 'pending' : (status || 'pending')
        };
        
        console.log('Données du formulaire soumises:', taskData);
        onTaskSubmit(task ? { ...taskData, id: task.id } : taskData);
        onCancel && onCancel();
    };

    const handleCancel = () => {
        // Réinitialiser le formulaire
        setTitle('');
        setDescription('');
        setCategory('personnel');
        setStatus('pending');
        // Appeler la fonction onCancel si elle existe
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
                <label htmlFor="title">Titre *</label>
                <input
                    type="text"
                    id="title"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Entrez le titre de la tâche"
                    required
                    autoComplete="off"
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                    id="description"
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez la tâche en détail..."
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="category">Catégorie *</label>
                <div className="select-wrapper">
                    <select
                        id="category"
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="personnel">Personnel</option>
                        <option value="professionnel">Professionnel</option>    
                    </select>
                </div>
            </div>
            
            <div className="form-group">
                <label htmlFor="status">Statut</label>
                <div className="select-wrapper">
                    <select
                        id="status"
                        className="form-control"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="pending">En attente</option>
                        <option value="in_progress">En cours</option>
                        <option value="completed">Terminée</option>
                    </select>
                </div>
            </div>
            
            <div className="form-actions">
                {onCancel && (
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={handleCancel}
                    >
                        Annuler
                    </button>
                )}
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!title.trim() || !description.trim()}
                >
                    {task ? 'Mettre à jour' : 'Créer la tâche'}
                </button>
            </div>
            
            <div className="form-footer">
                <small className="text-muted">Les champs marqués d'un * sont obligatoires</small>
            </div>
        </form>
    );
};

export default TaskForm;