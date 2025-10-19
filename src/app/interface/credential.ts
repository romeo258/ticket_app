
export interface IUserRequest {
    password?: string;
    email: string;
}

export interface IRegisterRequest extends IUserRequest {
    firstName: string;
    lastName: string;
    phone?: string;
    bio?: string;
}

export type UpdatePassword = { currentPassword: string, newPassword: string, confirmNewPassword: string };
// export type UpdateNewPassword = Pick<IUser, "userId"> & UpdatePassword;
// export type EmailAddress = Pick<IUserRequest, "email">;