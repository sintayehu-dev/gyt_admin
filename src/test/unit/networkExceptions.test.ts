import { describe, it, expect } from 'vitest';
import { NetworkExceptions, NetworkExceptionType } from '../../core/services/api/networkExceptions';
import { AxiosError } from 'axios';

describe('NetworkExceptions', () => {
  describe('constructor', () => {
    it('creates exception with type and message', () => {
      const exception = new NetworkExceptions(NetworkExceptionType.BAD_REQUEST, 'Invalid data');
      expect(exception.type).toBe(NetworkExceptionType.BAD_REQUEST);
      expect(exception.message).toBe('Invalid data');
    });

    it('creates exception with type only', () => {
      const exception = new NetworkExceptions(NetworkExceptionType.NOT_FOUND);
      expect(exception.type).toBe(NetworkExceptionType.NOT_FOUND);
      expect(exception.message).toBe('');
    });
  });

  describe('getException', () => {
    it('handles 400 Bad Request', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Invalid input' },
        },
      } as AxiosError;

      const exception = NetworkExceptions.getException(axiosError);
      expect(exception.type).toBe(NetworkExceptionType.BAD_REQUEST);
      expect(exception.message).toBe('Invalid input');
    });

    it('handles 401 Unauthorized', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: { error: 'Unauthorized' },
        },
      } as AxiosError;

      const exception = NetworkExceptions.getException(axiosError);
      expect(exception.type).toBe(NetworkExceptionType.UNAUTHORISED_REQUEST);
      expect(exception.message).toBe('Unauthorized');
    });

    it('handles 403 Forbidden', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 403,
          data: { message: 'Forbidden' },
        },
      } as AxiosError;

      const exception = NetworkExceptions.getException(axiosError);
      expect(exception.type).toBe(NetworkExceptionType.UNAUTHORISED_REQUEST);
    });

    it('handles 404 Not Found', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 404,
          data: { message: 'Resource not found' },
        },
      } as AxiosError;

      const exception = NetworkExceptions.getException(axiosError);
      expect(exception.type).toBe(NetworkExceptionType.NOT_FOUND);
      expect(exception.message).toBe('Resource not found');
    });

    it('handles 405 Method Not Allowed', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 405,
          data: {},
        },
      } as AxiosError;

      const exception = NetworkExceptions.getException(axiosError);
      expect(exception.type).toBe(NetworkExceptionType.METHOD_NOT_ALLOWED);
    });

    it('handles 408 Request Timeout', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 408,
          data: {},
        },
      } as AxiosError;

      const exception = NetworkExceptions.getException(axiosError);
      expect(exception.type).toBe(NetworkExceptionType.REQUEST_TIMEOUT);
    });

    it('handles 409 Conflict', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 409,
          data: { message: 'Resource already exists' },
        },
      } as AxiosError;

      const exception = NetworkExceptions.getException(axiosError);
      expect(exception.type).toBe(NetworkExceptionType.CONFLICT);
    });

    it('handles 500 Internal Server Error', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: { error: 'Server error' },
        },
      } as AxiosError;

      const exception = NetworkExceptions.getException(axiosError);
      expect(exception.type).toBe(NetworkExceptionType.INTERNAL_SERVER_ERROR);
    });

    it('handles 503 Service Unavailable', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 503,
          data: {},
        },
      } as AxiosError;

      const exception = NetworkExceptions.getException(axiosError);
      expect(exception.type).toBe(NetworkExceptionType.SERVICE_UNAVAILABLE);
    });

    it('handles network error without response', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'Network Error',
        code: 'ERR_NETWORK',
      } as AxiosError;

      const exception = NetworkExceptions.getException(axiosError);
      expect(exception.type).toBe(NetworkExceptionType.NO_INTERNET_CONNECTION);
    });

    it('handles connection timeout', () => {
      const axiosError = {
        isAxiosError: true,
        code: 'ECONNABORTED',
      } as AxiosError;

      const exception = NetworkExceptions.getException(axiosError);
      expect(exception.type).toBe(NetworkExceptionType.REQUEST_TIMEOUT);
    });

    it('handles timeout in message', () => {
      const axiosError = {
        isAxiosError: true,
        message: 'timeout of 5000ms exceeded',
      } as AxiosError;

      const exception = NetworkExceptions.getException(axiosError);
      expect(exception.type).toBe(NetworkExceptionType.REQUEST_TIMEOUT);
    });

    it('handles cancelled request', () => {
      const error = {
        name: 'CanceledError',
        message: 'Request cancelled',
      };

      const exception = NetworkExceptions.getException(error);
      expect(exception.type).toBe(NetworkExceptionType.REQUEST_CANCELLED);
    });

    it('handles syntax error', () => {
      const error = new SyntaxError('Unexpected token');

      const exception = NetworkExceptions.getException(error);
      expect(exception.type).toBe(NetworkExceptionType.FORMAT_EXCEPTION);
    });

    it('handles unexpected error', () => {
      const error = new Error('Something went wrong');

      const exception = NetworkExceptions.getException(error);
      expect(exception.type).toBe(NetworkExceptionType.UNEXPECTED_ERROR);
    });

    it('handles unknown status code', () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 418,
          data: { message: "I'm a teapot" },
        },
      } as AxiosError;

      const exception = NetworkExceptions.getException(axiosError);
      expect(exception.type).toBe(NetworkExceptionType.DEFAULT_ERROR);
    });
  });

  describe('getRawErrorMessage', () => {
    it('extracts error from response data object with error field', () => {
      const error = {
        response: {
          data: { error: 'Invalid credentials' },
        },
      };

      const message = NetworkExceptions.getRawErrorMessage(error);
      expect(message).toBe('Invalid credentials');
    });

    it('extracts message from response data object with message field', () => {
      const error = {
        response: {
          data: { message: 'User not found' },
        },
      };

      const message = NetworkExceptions.getRawErrorMessage(error);
      expect(message).toBe('User not found');
    });

    it('stringifies response data object without error or message', () => {
      const error = {
        response: {
          data: { code: 'ERR_001', details: 'Something failed' },
        },
      };

      const message = NetworkExceptions.getRawErrorMessage(error);
      expect(message).toContain('ERR_001');
    });

    it('handles string response data', () => {
      const error = {
        response: {
          data: 'Plain error message',
        },
      };

      const message = NetworkExceptions.getRawErrorMessage(error);
      expect(message).toBe('Plain error message');
    });

    it('extracts message from NetworkExceptions instance', () => {
      const error = new NetworkExceptions(NetworkExceptionType.NOT_FOUND, 'Resource missing');

      const message = NetworkExceptions.getRawErrorMessage(error);
      expect(message).toBe('Resource missing');
    });

    it('handles error with message property', () => {
      const error = { message: 'Connection failed' };

      const message = NetworkExceptions.getRawErrorMessage(error);
      expect(message).toBe('Connection failed');
    });

    it('handles unknown error format', () => {
      const error = null;

      const message = NetworkExceptions.getRawErrorMessage(error);
      expect(message).toBe('Unknown error occurred');
    });
  });

  describe('getErrorMessage', () => {
    it('returns connection error message', () => {
      const exception = new NetworkExceptions(NetworkExceptionType.CONNECTION_ERROR);
      expect(exception.getErrorMessage()).toBe('Connection error');
    });

    it('returns unauthorized message', () => {
      const exception = new NetworkExceptions(NetworkExceptionType.UNAUTHORISED_REQUEST);
      expect(exception.getErrorMessage()).toBe('Unauthorized request');
    });

    it('returns not found with custom message', () => {
      const exception = new NetworkExceptions(NetworkExceptionType.NOT_FOUND, 'User not found');
      expect(exception.getErrorMessage()).toBe('User not found');
    });

    it('returns default error with custom message', () => {
      const exception = new NetworkExceptions(NetworkExceptionType.DEFAULT_ERROR, 'Custom error');
      expect(exception.getErrorMessage()).toBe('Custom error');
    });

    it('returns no internet connection message', () => {
      const exception = new NetworkExceptions(NetworkExceptionType.NO_INTERNET_CONNECTION);
      expect(exception.getErrorMessage()).toBe('No internet connection');
    });

    it('returns internal server error message', () => {
      const exception = new NetworkExceptions(NetworkExceptionType.INTERNAL_SERVER_ERROR);
      expect(exception.getErrorMessage()).toBe('Internal server error');
    });
  });
});
