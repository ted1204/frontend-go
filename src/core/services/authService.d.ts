import { MessageResponse, LoginResponse } from '../response/response';
import { RegisterInput } from '../interfaces/auth';
export declare const login: (username: string, password: string) => Promise<LoginResponse>;
export declare const logout: () => Promise<void>;
export declare const register: (input: RegisterInput) => Promise<MessageResponse>;
export declare const getUsername: () => string;
//# sourceMappingURL=authService.d.ts.map