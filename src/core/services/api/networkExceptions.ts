/**
 * Network Exceptions - Centralized error handling
 * Handles all types of network errors and provides user-friendly messages
 */

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
};

export class NetworkExceptions {
  constructor(type, message = '') {
    this.type = type;
    this.message = message;
  }

  /**
   * Extract raw error message from error object
   * @param {*} error - Error object (can be axios error or NetworkException)
   * @returns {string} - Raw error message
   */
  static getRawErrorMessage(error) {
    // Handle axios errors with response data
    if (error?.response?.data) {
      try {
        const errorData = error.response.data;

        // For JSON error responses
        if (typeof errorData === 'object' && errorData !== null) {
          // Return error field if it exists
          if (errorData.error) {
            return String(errorData.error);
          }
          // Return message field if it exists
          else if (errorData.message) {
            return String(errorData.message);
          }
          // Return the entire JSON as a string
          else {
            return JSON.stringify(errorData);
          }
        }
        // For string error responses
        else if (typeof errorData === 'string') {
          return errorData;
        }
        // For other types, convert to string
        else {
          return String(errorData);
        }
      } catch (e) {
        return error.toString();
      }
    }
    // Handle NetworkExceptions instances
    else if (error instanceof NetworkExceptions) {
      return NetworkExceptions._extractMessageFromNetworkExceptions(error);
    }

    // Fallback
    return error?.message || error?.toString() || 'Unknown error occurred';
  }

  /**
   * Extract message from NetworkExceptions instance
   * @private
   */
  static _extractMessageFromNetworkExceptions(networkException) {
    const messages = {
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

  /**
   * Convert axios error to NetworkException
   * @param {*} error - Error object from axios or other source
   * @returns {NetworkExceptions}
   */
  static getException(error) {
    try {
      // Handle axios errors
      if (error.isAxiosError) {
        // Network-related exceptions (no response)
        if (!error.response) {
          if (error.code === 'ECONNABORTED') {
            return new NetworkExceptions(NetworkExceptionType.REQUEST_TIMEOUT);
          }
          if (error.code === 'ERR_NETWORK') {
            return new NetworkExceptions(NetworkExceptionType.NO_INTERNET_CONNECTION);
          }
          if (error.message?.includes('Network Error')) {
            return new NetworkExceptions(NetworkExceptionType.NO_INTERNET_CONNECTION);
          }
          if (error.message?.includes('timeout')) {
            return new NetworkExceptions(NetworkExceptionType.REQUEST_TIMEOUT);
          }
          return new NetworkExceptions(NetworkExceptionType.CONNECTION_ERROR);
        }

        // Handle response-based errors
        const statusCode = error.response.status;
        const backendError = NetworkExceptions._extractBackendErrorMessage(error.response.data);

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

      // Handle request cancellation
      if (error.name === 'CanceledError' || error.message?.includes('cancel')) {
        return new NetworkExceptions(NetworkExceptionType.REQUEST_CANCELLED);
      }

      // Handle format exceptions
      if (error instanceof SyntaxError || error.name === 'SyntaxError') {
        return new NetworkExceptions(NetworkExceptionType.FORMAT_EXCEPTION);
      }

      // Handle type errors
      if (error.message?.includes('is not a subtype of') || error.message?.includes('type')) {
        return new NetworkExceptions(NetworkExceptionType.UNABLE_TO_PROCESS);
      }

      // Default unexpected error
      return new NetworkExceptions(
        NetworkExceptionType.UNEXPECTED_ERROR,
        error.message || 'An unexpected error occurred'
      );
    } catch (e) {
      return new NetworkExceptions(NetworkExceptionType.UNEXPECTED_ERROR);
    }
  }

  /**
   * Extract backend error message from response data
   * @private
   */
  static _extractBackendErrorMessage(data) {
    if (!data) return 'Unknown error occurred';

    try {
      // For JSON error responses
      if (typeof data === 'object' && data !== null) {
        if (data.error) {
          return String(data.error);
        } else if (data.message) {
          return String(data.message);
        } else {
          return JSON.stringify(data);
        }
      }
      // For string error responses
      else if (typeof data === 'string' && data.length > 0) {
        // Try to parse as JSON first
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.error) {
            return String(jsonData.error);
          } else if (jsonData.message) {
            return String(jsonData.message);
          }
          return data;
        } catch {
          // If not valid JSON, return the string as is
          return data;
        }
      } else {
        return String(data);
      }
    } catch {
      return 'Error processing response';
    }
  }

  /**
   * Get user-friendly error message
   * @returns {string}
   */
  getErrorMessage() {
    return NetworkExceptions._extractMessageFromNetworkExceptions(this);
  }
}
