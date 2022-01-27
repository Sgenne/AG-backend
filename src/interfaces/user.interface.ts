export interface IUser {
    name: string;
    email: string;
    passwordHash: string;
    authenticationToken?: string;
  }