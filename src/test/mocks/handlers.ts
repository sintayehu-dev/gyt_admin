import { http, HttpResponse } from 'msw';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const handlers = [
  http.post(`${API_BASE_URL}/auth/login`, () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
    });
  }),

  http.post(`${API_BASE_URL}/auth/register`, () => {
    return HttpResponse.json({
      message: 'Registration successful',
      userId: '1',
    });
  }),

  http.get(`${API_BASE_URL}/movies`, () => {
    return HttpResponse.json({
      data: [
        { id: '1', title: 'Test Movie 1', releaseDate: '2024-01-01' },
        { id: '2', title: 'Test Movie 2', releaseDate: '2024-02-01' },
      ],
      meta: {
        total: 2,
        page: 1,
        limit: 10,
      },
    });
  }),
];
