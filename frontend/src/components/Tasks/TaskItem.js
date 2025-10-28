import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './TaskItem.css';

const TaskItem = ({ task, onEdit, onDelete, onToggle }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const handleToggle = () => {
        onToggle({
            ...task,
            status: task.status === 'completed' ? 'pending' : 'completed'
        });
    };

    const handleEdit = () => {
        onEdit(task);
    };

    const handleDelete = () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            onDelete(task.id);
        }
    };

    return (
        <div 
            className={`task-item ${
                task.status === 'completed' 
                    ? 'completed' 
                    : task.status === 'pending' 
                        ? 'pending' 
                        : ''
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="task-content">
                <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <span className="task-status">
                        {task.status === 'completed' 
                            ? 'Terminée' 
                            : task.status === 'pending' 
                                ? 'En attente' 
                                : 'En cours'}
                    </span>
                </div>
                
                {task.description && (
                    <p className="task-description">{task.description}</p>
                )}
                
                <div className="task-meta">
                    {task.due_date && (
                        <span className="task-due-date">
                            📅 {new Date(task.due_date).toLocaleDateString()}
                        </span>
                    )}
                    {task.priority && (
                        <span className={`task-priority ${task.priority.toLowerCase()}`}>
                            {task.priority}
                        </span>
                    )}
                </div>
            </div>
            
            <div className={`task-actions ${isHovered ? 'visible' : ''}`}>
                <button 
                    className={`action-btn ${task.status === 'completed' ? 'secondary' : 'success'}`}
                    onClick={handleToggle}
                    title={task.status === 'completed' ? 'Marquer comme non terminée' : 'Marquer comme terminée'}
                >
                    {task.status === 'completed' ? '↩️ Rouvrir' : '✓ Terminer'}
                </button>
                <button 
                    className="action-btn primary"
                    onClick={handleEdit}
                    title="Modifier la tâche"
                >
                    ✏️ Modifier
                </button>
                <button 
                    className="action-btn danger"
                    onClick={handleDelete}
                    title="Supprimer la tâche"
                >
                    🗑️ Supprimer
                </button>
            </div>
        </div>
    );
};

TaskItem.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        status: PropTypes.oneOf(['pending', 'in_progress', 'completed']).isRequired,
        due_date: PropTypes.string,
        priority: PropTypes.string,
        category: PropTypes.string
    }).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
};

export default TaskItem;