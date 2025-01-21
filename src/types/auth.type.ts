export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date | string;
    gender: Gender;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface ActiveCodeRequest {
    email: string;
}

export interface VerifyActivationRequest {
    email: string;
    activationCode: string;
}

export interface RecoverPasswordRequest {
    email: string;
}

export interface VerifyRecoverPasswordRequest {
    email: string;
    resetCode: string;
}

export interface ResetPasswordRequest {
    email: string;
    resetCode: string;
    newPassword: string;
    confirmPassword: string;
}

// Optional: Response type for the registration API
export interface RegisterResponse {
    success: boolean;
    message?: string;
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        gender: Gender;
        createdAt: string;
    };
}
