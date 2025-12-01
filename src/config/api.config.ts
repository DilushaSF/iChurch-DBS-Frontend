export const api_config = {
    base_url: import.meta.env.API_URL || 'http://localhost:5000',
    endpoints: {
        auth: {
            login: '/api/users/login',
            signup: '/api/users/register',
        }
    },
    timeout: 10000,
};

export default api_config;