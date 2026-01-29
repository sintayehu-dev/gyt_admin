/**
 * Auth DTOs (Data Transfer Objects)
 * Serialization/transformation of models for application use
 */

export interface UserDTO {
  uuid: string;
  email: string;
  name: string;
  role: string;
  lastLogin: string;
  formattedLastLogin: string;
}

export interface LoginResponseDTO {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Transform user model to DTO
 */
export const transformUser = (user: any): UserDTO => {
  return {
    uuid: user.uuid || '',
    email: user.email || '',
    name: user.name || '',
    role: user.role || '',
    lastLogin: user.lastLogin || '',
    formattedLastLogin: formatDate(user.lastLogin),
  };
};

/**
 * Transform login response to DTO
 */
export const transformLoginResponse = (response: any): LoginResponseDTO => {
  return {
    user: transformUser(response.user),
    accessToken: response.accessToken || '',
    refreshToken: response.refreshToken || '',
  };
};

/**
 * Serialize login request
 */
export const serializeLoginRequest = (email: string, password: string) => {
  return {
    email,
    password,
  };
};
