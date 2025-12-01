export interface User {
    _id: string;
    email: string;
    churchName: string;
    parishName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    churchName: string;
    parishName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
}

export interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (churchName: string, parishName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}