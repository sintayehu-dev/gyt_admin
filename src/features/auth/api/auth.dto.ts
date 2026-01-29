/**
 * Auth DTOs
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

export const transformLoginResponse = (response: any): LoginResponseDTO => {
  return {
    user: transformUser(response.user),
    accessToken: response.accessToken || '',
    refreshToken: response.refreshToken || '',
  };
};

export const serializeLoginRequest = (email: string, password: string) => {
  return {
    email,
    password,
  };
};
