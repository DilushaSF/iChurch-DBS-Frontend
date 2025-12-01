import { tokenUtils } from './token';

export const authUtils = {
    isAuthenticated: (): boolean => {
        return tokenUtils.hasToken();
    },

    getAuthHeaders: () => {
        const token = tokenUtils.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    },

    handleLoginSuccess: (token: string, user: any) => {
        tokenUtils.setToken(token);
        tokenUtils.setUser(user);
    },

    handleLogout: () => {
        tokenUtils.clearAuth();
    },

    getCurrentUser: () => {
        return tokenUtils.getUser();
    },
};