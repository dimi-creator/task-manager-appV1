import React, { useState, useEffect } from 'react';
import './TaskFilter.css';

const TaskFilter = ({ tasks = [], onFilterChange }) => {
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    
    // Extraire les catégories uniques des tâches
    const categories = [...new Set(tasks.map(task => task.category).filter(Boolean))];

    useEffect(() => {
        // Appliquer les filtres lorsque les états changent
        applyFilters();
    }, [status, category]);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const applyFilters = () => {
        onFilterChange(status, category);
    };

    const resetFilters = () => {
        setStatus('');
        setCategory('');
        onFilterChange('', '');
    };

    return (
        <div className="task-filter">
            <div className="filter-group">
                <label htmlFor="status-filter">Statut :</label>
                <select 
                    id="status-filter"
                    value={status} 
                    onChange={handleStatusChange} 
                    className="form-select"
                >
                    <option value="">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminée</option>
                </select>
            </div>
            
            <div className="filter-group">
                <label htmlFor="category-filter">Catégorie :</label>
                <select 
                    id="category-filter"
                    value={category} 
                    onChange={handleCategoryChange} 
                    className="form-select"
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            
            <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={resetFilters}
            >
                Réinitialiser
            </button>
        </div>
    );
};

export default TaskFilter;