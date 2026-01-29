/**
 * Auth API Models
 */

export const LoginRequest = {
  email: '',
  password: '',
};

export const UserModel = {
  uuid: '',
  email: '',
  name: '',
  role: '',
  lastLogin: '',
};

export const LoginResponse = {
  user: UserModel,
  accessToken: '',
  refreshToken: '',
};

export const ErrorResponse = {
  success: false,
  error: '',
  exception: '',
};
