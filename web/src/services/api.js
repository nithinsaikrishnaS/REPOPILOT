import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const checkHealth = async () => {
    try {
        const response = await axios.get('http://localhost:3001/status');
        return response.data;
    } catch (error) {
        console.error('Health check failed', error);
        return null;
    }
};

export const selectFolder = async () => {
    const response = await api.post('/folder/select');
    return response.data;
};

export const checkStatus = async (folder) => {
    const response = await api.post('/project/status', { folder });
    return response.data;
};

export const pushProject = async (folder, repoUrl) => {
    const response = await api.post('/project/push', { folder, repoUrl });
    return response.data;
};

export default api;
