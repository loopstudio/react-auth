import {AxiosInstance} from 'axios';

class AuthService {
  static httpClient: AxiosInstance;

  static setHttpClient(client: AxiosInstance) {
    this.httpClient = client;
  }

  static signUp(user: any) {
    return this.httpClient.post('/users', { user });
  }

  static signIn(user: any) {
    return this.httpClient.post('/users/sign_in', { user });
  }

  static signOut() {
    return this.httpClient.delete('/users/sign_out');
  }

  static validateToken() {
    return this.httpClient.get('/users/validate_token');
  }

  static updateUser(user: any, passwordCheck: string) {
    return this.httpClient.patch('/user', { user, passwordCheck });
  }

  static requestPasswordReset(email: string) {
    return this.httpClient.post('/users/password', { email });
  }

  static verifyPasswordReset(resetPasswordToken: string) {
    return this.httpClient.get('users/password/edit', {
      params: { resetPasswordToken },
    });
  }

  static resetPassword(password: string, resetPasswordToken: string) {
    return this.httpClient.put('/users/password', {
      password,
      resetPasswordToken,
    });
  }
}

export default AuthService;
