import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ tasks = [], onTaskUpdate, onTaskDelete, loading = false, error = null }) => {
    if (loading) return <div className="loading">Chargement des tâches...</div>;
    if (error) return <div className="error">Erreur: {error}</div>;

    return (
        <div className="task-list">
            {tasks.length > 0 ? (
                <ul className="task-list-items">
                    {tasks.map((task) => (
                        <li key={task.id} className="task-list-item">
                            <TaskItem
                                key={task.id}
                                task={task}
                                onEdit={onTaskUpdate}
                                onDelete={onTaskDelete}
                                onToggle={onTaskUpdate}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-tasks">Aucune tâche à afficher pour le moment.</p>
            )}
        </div>
    );
};

export default TaskList;