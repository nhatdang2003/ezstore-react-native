export interface UserInfo {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    cartItemsCount: number;
}

export interface ChangePasswordReq {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}