import React from 'react';
interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    loading: boolean;
}
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export {};
//# sourceMappingURL=AuthContext.d.ts.map