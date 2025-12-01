const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const tokenUtils = {
    getToken: (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    },

    setToken: (token: string): void => {
        localStorage.setItem(TOKEN_KEY, token);
    },

    removeToken: (): void => {
        localStorage.removeItem(TOKEN_KEY);
    },

    hasToken: (): boolean => {
        return !!localStorage.getItem(TOKEN_KEY);
    },

    getUser: () => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    setUser: (user: any): void => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    removeUser: (): void => {
        localStorage.removeItem(USER_KEY);
    },

    clearAuth: (): void => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
};