import { API_BASE_URL } from '../config';

interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

class ApiClient {
    private baseURL: string;
    private refreshPromise: Promise<string> | null = null;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    // Check if token is expired or will expire soon (within 5 minutes)
    private isTokenExpiringSoon(): boolean {
        const token = localStorage.getItem('token');
        if (!token) return true;

        try {
            // Decode JWT without verification to check expiration
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // Convert to milliseconds
            const now = Date.now();
            const fiveMinutes = 5 * 60 * 1000;
            
            // Token is expiring soon if it expires within 5 minutes
            return (exp - now) < fiveMinutes;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    }

    // Refresh token by calling the refresh endpoint
    private async refreshToken(): Promise<string> {
        // If already refreshing, wait for that promise
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        this.refreshPromise = (async () => {
            try {
                const currentToken = localStorage.getItem('token');
                if (!currentToken) {
                    throw new Error('No token to refresh');
                }

                // Try to refresh the token
                const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': currentToken
                    }
                });

                if (!response.ok) {
                    // If refresh fails (token is completely invalid), user needs to re-login
                    const errorData = await response.json().catch(() => ({ message: 'Token refresh failed' }));
                    throw new Error(errorData.message || 'Token refresh failed');
                }

                const data = await response.json();
                const newToken = data.token;

                if (!newToken) {
                    throw new Error('No token received from refresh');
                }

                // Update token in localStorage
                localStorage.setItem('token', newToken);
                
                // Update user data if provided
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                return newToken;
            } catch (error: any) {
                console.error('Token refresh error:', error);
                // Only clear and redirect if it's a real auth error
                // Don't clear on network errors - let the user retry
                if (error.message && error.message.includes('Token')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    // Only redirect if we're not already on login page
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                }
                throw error;
            } finally {
                this.refreshPromise = null;
            }
        })();

        return this.refreshPromise;
    }

    // Get valid token (refresh if needed)
    private async getValidToken(): Promise<string | null> {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }

        // If token is expiring soon, refresh it
        if (this.isTokenExpiringSoon()) {
            try {
                return await this.refreshToken();
            } catch (error) {
                console.error('Failed to refresh token:', error);
                return null;
            }
        }

        return token;
    }

    // Main fetch method with automatic token refresh
    async fetch<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            // Get valid token (refresh if needed)
            const token = await this.getValidToken();
            
            if (!token) {
                return {
                    status: 401,
                    error: 'No valid token. Please login again.'
                };
            }

            // Make the request
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: {
                    ...options.headers,
                    'x-auth-token': token,
                    'Content-Type': 'application/json',
                }
            });

            // If token is invalid, try refreshing once
            if (response.status === 401) {
                try {
                    const newToken = await this.refreshToken();
                    
                    // Retry the request with new token
                    const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
                        ...options,
                        headers: {
                            ...options.headers,
                            'x-auth-token': newToken,
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!retryResponse.ok) {
                        // If retry still fails with 401, token is truly invalid
                        if (retryResponse.status === 401) {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            if (!window.location.pathname.includes('/login')) {
                                window.location.href = '/login';
                            }
                        }
                        const errorData = await retryResponse.json().catch(() => ({ message: 'Request failed' }));
                        return {
                            status: retryResponse.status,
                            error: errorData.message || 'Request failed'
                        };
                    }

                    const data = await retryResponse.json();
                    return {
                        status: retryResponse.status,
                        data: data as T
                    };
                } catch (refreshError: any) {
                    // Refresh failed - check if it's a network error or auth error
                    if (refreshError.message && refreshError.message.includes('Token')) {
                        // Auth error - already handled in refreshToken
                        return {
                            status: 401,
                            error: 'Session expired. Please login again.'
                        };
                    }
                    // Network error - return original error
                    return {
                        status: 401,
                        error: 'Network error. Please check your connection.'
                    };
                }
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
                return {
                    status: response.status,
                    error: errorData.message || 'Request failed'
                };
            }

            const data = await response.json();
            return {
                status: response.status,
                data: data as T
            };
        } catch (error: any) {
            console.error('API request error:', error);
            return {
                status: 500,
                error: error.message || 'Network error. Please try again.'
            };
        }
    }

    // Convenience methods
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined
        });
    }

    async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiClient();

