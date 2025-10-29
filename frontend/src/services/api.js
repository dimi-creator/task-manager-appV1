import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api', // Change this to your backend API URL
    headers: {
        'Content-Type': 'application/json',

    },
});

// User authentication
export const registerUser = async (userData) => {
    return await apiClient.post('/register', userData);
};

export const loginUser = async (credentials) => {
    return await apiClient.post('/login', credentials);
};

export const logoutUser = async () => {
    return await apiClient.post('/logout');
};

// Task management
export const fetchTasks = async () => {
    return await apiClient.get('/tasks');
};

export const createTask = async (taskData) => {
    return await apiClient.post('/tasks', taskData);
};

export const updateTask = async (taskId, taskData) => {
    return await apiClient.put(`/tasks/${taskId}`, taskData);
};

export const deleteTask = async (taskId) => {
    return await apiClient.delete(`/tasks/${taskId}`);
};

export const markTaskAsCompleted = async (taskId) => {
    return await apiClient.patch(`/tasks/${taskId}/complete`);
};

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

// Additional functions for filtering tasks can be added here
