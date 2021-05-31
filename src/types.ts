export interface ISession {
  accessToken: string;
  client: string;
  uid: string;
}

export interface IUser {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  locale: string,
  createdAt: string,
  updatedAt: string,
}

export interface ISignUpParams {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}

export interface ISignInParams {
  email: string,
  password: string,
}

export interface IUpdateUserParams {
  firstName?: string,
  lastName?: string,
  locale?: string,
  password?: string,
}
