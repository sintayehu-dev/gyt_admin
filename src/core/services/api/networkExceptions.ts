import { AxiosError } from 'axios';

export const NetworkExceptionType = {
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  REQUEST_CANCELLED: 'REQUEST_CANCELLED',
  UNAUTHORISED_REQUEST: 'UNAUTHORISED_REQUEST',
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  NOT_ACCEPTABLE: 'NOT_ACCEPTABLE',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  SEND_TIMEOUT: 'SEND_TIMEOUT',
  CONFLICT: 'CONFLICT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  NO_INTERNET_CONNECTION: 'NO_INTERNET_CONNECTION',
  FORMAT_EXCEPTION: 'FORMAT_EXCEPTION',
  UNABLE_TO_PROCESS: 'UNABLE_TO_PROCESS',
  DEFAULT_ERROR: 'DEFAULT_ERROR',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
  BAD_CERTIFICATE: 'BAD_CERTIFICATE',
} as const;

export type NetworkExceptionTypeKeys = keyof typeof NetworkExceptionType;

export class NetworkExceptions {
  type: string;
  message: string;

  constructor(type: string, message = '') {
    this.type = type;
    this.message = message;
  }

  static getRawErrorMessage(error: any): string {
    if (error?.response?.data) {
      try {
        const errorData = error.response.data;

        if (typeof errorData === 'object' && errorData !== null) {
          if (errorData.error) {
            return String(errorData.error);
          } else if (errorData.message) {
            return String(errorData.message);
          } else {
            return JSON.stringify(errorData);
          }
        } else if (typeof errorData === 'string') {
          return errorData;
        } else {
          return String(errorData);
        }
      } catch (e) {
        return error.toString();
      }
    } else if (error instanceof NetworkExceptions) {
      return NetworkExceptions._extractMessageFromNetworkExceptions(error);
    }

    return error?.message || error?.toString() || 'Unknown error occurred';
  }

  private static _extractMessageFromNetworkExceptions(networkException: NetworkExceptions): string {
    const messages: Record<string, string> = {
      [NetworkExceptionType.CONNECTION_ERROR]: 'Connection error',
      [NetworkExceptionType.REQUEST_CANCELLED]: 'Request cancelled',
      [NetworkExceptionType.UNAUTHORISED_REQUEST]: 'Unauthorized request',
      [NetworkExceptionType.BAD_REQUEST]: 'Bad request',
      [NetworkExceptionType.NOT_FOUND]: networkException.message || 'Not found',
      [NetworkExceptionType.METHOD_NOT_ALLOWED]: 'Method not allowed',
      [NetworkExceptionType.NOT_ACCEPTABLE]: 'Not acceptable',
      [NetworkExceptionType.REQUEST_TIMEOUT]: 'Request timeout',
      [NetworkExceptionType.SEND_TIMEOUT]: 'Send timeout',
      [NetworkExceptionType.CONFLICT]: 'Conflict',
      [NetworkExceptionType.INTERNAL_SERVER_ERROR]: 'Internal server error',
      [NetworkExceptionType.NOT_IMPLEMENTED]: 'Not implemented',
      [NetworkExceptionType.SERVICE_UNAVAILABLE]: 'Service unavailable',
      [NetworkExceptionType.NO_INTERNET_CONNECTION]: 'No internet connection',
      [NetworkExceptionType.FORMAT_EXCEPTION]: 'Format exception',
      [NetworkExceptionType.UNABLE_TO_PROCESS]: 'Unable to process',
      [NetworkExceptionType.DEFAULT_ERROR]: networkException.message || 'An error occurred',
      [NetworkExceptionType.UNEXPECTED_ERROR]: 'Unexpected error',
      [NetworkExceptionType.BAD_CERTIFICATE]: 'Bad certificate',
    };

    return messages[networkException.type] || 'Unknown error';
  }

  static getException(error: any): NetworkExceptions {
    try {
      const axiosError = error as AxiosError;

      if (axiosError.isAxiosError) {
        if (!axiosError.response) {
          if (axiosError.code === 'ECONNABORTED') {
            return new NetworkExceptions(NetworkExceptionType.REQUEST_TIMEOUT);
          }
          if (axiosError.code === 'ERR_NETWORK') {
            return new NetworkExceptions(NetworkExceptionType.NO_INTERNET_CONNECTION);
          }
          if (axiosError.message?.includes('Network Error')) {
            return new NetworkExceptions(NetworkExceptionType.NO_INTERNET_CONNECTION);
          }
          if (axiosError.message?.includes('timeout')) {
            return new NetworkExceptions(NetworkExceptionType.REQUEST_TIMEOUT);
          }
          return new NetworkExceptions(NetworkExceptionType.CONNECTION_ERROR);
        }

        const statusCode = axiosError.response.status;
        const backendError = NetworkExceptions._extractBackendErrorMessage(axiosError.response.data);

        switch (statusCode) {
          case 400:
            return new NetworkExceptions(NetworkExceptionType.BAD_REQUEST, backendError);
          case 401:
            return new NetworkExceptions(NetworkExceptionType.UNAUTHORISED_REQUEST, backendError);
          case 403:
            return new NetworkExceptions(NetworkExceptionType.UNAUTHORISED_REQUEST, backendError);
          case 404:
            return new NetworkExceptions(NetworkExceptionType.NOT_FOUND, backendError);
          case 405:
            return new NetworkExceptions(NetworkExceptionType.METHOD_NOT_ALLOWED, backendError);
          case 406:
            return new NetworkExceptions(NetworkExceptionType.NOT_ACCEPTABLE, backendError);
          case 408:
            return new NetworkExceptions(NetworkExceptionType.REQUEST_TIMEOUT, backendError);
          case 409:
            return new NetworkExceptions(NetworkExceptionType.CONFLICT, backendError);
          case 500:
            return new NetworkExceptions(NetworkExceptionType.INTERNAL_SERVER_ERROR, backendError);
          case 501:
            return new NetworkExceptions(NetworkExceptionType.NOT_IMPLEMENTED, backendError);
          case 503:
            return new NetworkExceptions(NetworkExceptionType.SERVICE_UNAVAILABLE, backendError);
          default:
            return new NetworkExceptions(NetworkExceptionType.DEFAULT_ERROR, backendError);
        }
      }

      if (error.name === 'CanceledError' || error.message?.includes('cancel')) {
        return new NetworkExceptions(NetworkExceptionType.REQUEST_CANCELLED);
      }

      if (error instanceof SyntaxError || error.name === 'SyntaxError') {
        return new NetworkExceptions(NetworkExceptionType.FORMAT_EXCEPTION);
      }

      if (error.message?.includes('is not a subtype of') || error.message?.includes('type')) {
        return new NetworkExceptions(NetworkExceptionType.UNABLE_TO_PROCESS);
      }

      return new NetworkExceptions(
        NetworkExceptionType.UNEXPECTED_ERROR,
        error.message || 'An unexpected error occurred'
      );
    } catch (e) {
      return new NetworkExceptions(NetworkExceptionType.UNEXPECTED_ERROR);
    }
  }

  private static _extractBackendErrorMessage(data: any): string {
    if (!data) return 'Unknown error occurred';

    try {
      if (typeof data === 'object' && data !== null) {
        if (data.error) {
          return String(data.error);
        } else if (data.message) {
          return String(data.message);
        } else {
          return JSON.stringify(data);
        }
      } else if (typeof data === 'string' && data.length > 0) {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.error) {
            return String(jsonData.error);
          } else if (jsonData.message) {
            return String(jsonData.message);
          }
          return data;
        } catch {
          return data;
        }
      } else {
        return String(data);
      }
    } catch {
      return 'Error processing response';
    }
  }

  getErrorMessage(): string {
    return NetworkExceptions._extractMessageFromNetworkExceptions(this);
  }
}
