# Test Examples Quick Reference

## Unit Test Examples

### Testing Atoms (Simple Components)

```typescript
// src/core/components/atoms/__tests__/Label.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../../test/utils/test-utils';
import Label from '../Label';

describe('Label', () => {
  it('renders text', () => {
    render(<Label>Username</Label>);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('applies required class', () => {
    render(<Label required>Email</Label>);
    expect(screen.getByText('Email')).toHaveClass('label--required');
  });
});
```

### Testing Molecules (Composite Components)

```typescript
// src/core/components/molecules/__tests__/InputField.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../../test/utils/test-utils';
import InputField from '../InputField';

describe('InputField', () => {
  it('renders label and input', () => {
    render(<InputField label="Email" name="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<InputField label="Email" name="email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });
});
```

### Testing Forms with Validation

```typescript
// src/features/directors/__tests__/AddDirectorForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../../../test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import AddDirectorForm from '../AddDirectorForm';

describe('AddDirectorForm', () => {
  it('validates required fields', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<AddDirectorForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<AddDirectorForm onSubmit={onSubmit} />);
    
    await user.type(screen.getByLabelText(/name/i), 'Christopher Nolan');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Christopher Nolan',
      });
    });
  });
});
```

## Integration Test Examples

### Testing API Calls

```typescript
// src/test/integration/movies.test.tsx
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import MoviesPage from '../../features/movies/pages/MoviesPage';

describe('Movies API Integration', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('loads and displays movies', async () => {
    render(<MoviesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    server.use(
      http.get('*/movies', () => {
        return HttpResponse.json(
          { message: 'Server error' },
          { status: 500 }
        );
      })
    );

    render(<MoviesPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading movies/i)).toBeInTheDocument();
    });
  });
});
```

### Testing with React Query

```typescript
// src/features/genres/__tests__/useGenres.test.tsx
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryProvider } from '../../../core/util/providers/QueryProvider';
import { server } from '../../../test/mocks/server';
import { useGenres } from '../hooks/useGenres';

describe('useGenres Hook', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('fetches genres successfully', async () => {
    const { result } = renderHook(() => useGenres(), {
      wrapper: QueryProvider,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

## E2E Test Examples

### Testing Navigation

```typescript
// src/test/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('navigates through main sections', async ({ page }) => {
    await page.goto('/dashboard');
    
    await page.getByRole('link', { name: /movies/i }).click();
    await expect(page).toHaveURL(/\/movies/);
    
    await page.getByRole('link', { name: /directors/i }).click();
    await expect(page).toHaveURL(/\/directors/);
  });
});
```

### Testing CRUD Operations

```typescript
// src/test/e2e/directors-crud.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Directors CRUD', () => {
  test('creates new director', async ({ page }) => {
    await page.goto('/directors');
    
    await page.getByRole('button', { name: /add director/i }).click();
    await page.getByLabel(/name/i).fill('Steven Spielberg');
    await page.getByRole('button', { name: /save/i }).click();
    
    await expect(page.getByText('Steven Spielberg')).toBeVisible();
  });

  test('edits existing director', async ({ page }) => {
    await page.goto('/directors');
    
    await page.getByRole('button', { name: /edit/i }).first().click();
    await page.getByLabel(/name/i).clear();
    await page.getByLabel(/name/i).fill('Updated Name');
    await page.getByRole('button', { name: /save/i }).click();
    
    await expect(page.getByText('Updated Name')).toBeVisible();
  });

  test('deletes director', async ({ page }) => {
    await page.goto('/directors');
    
    const directorName = await page.locator('table tr').first().textContent();
    
    await page.getByRole('button', { name: /delete/i }).first().click();
    await page.getByRole('button', { name: /confirm/i }).click();
    
    await expect(page.getByText(directorName!)).not.toBeVisible();
  });
});
```

### Testing Forms with File Upload

```typescript
// src/test/e2e/movie-upload.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test('uploads movie poster', async ({ page }) => {
  await page.goto('/movies/add');
  
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'poster.jpg'));
  
  await expect(page.getByText('poster.jpg')).toBeVisible();
});
```

## Testing Hooks

```typescript
// src/features/auth/hooks/__tests__/useAuth.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth Hook', () => {
  it('provides auth state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBeDefined();
    expect(result.current.user).toBeDefined();
  });

  it('logs out user', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

## Testing Context

```typescript
// src/core/context/__tests__/ToastContext.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';

const TestComponent = () => {
  const { showToast } = useToast();
  return <button onClick={() => showToast('Test message')}>Show</button>;
};

describe('ToastContext', () => {
  it('displays toast message', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    await act(async () => {
      screen.getByRole('button').click();
    });
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
});
```

## Mocking API Handlers

```typescript
// src/test/mocks/handlers.ts - Add more handlers
export const handlers = [
  // Directors
  http.get('*/directors', () => {
    return HttpResponse.json({
      data: [
        { id: '1', name: 'Christopher Nolan' },
        { id: '2', name: 'Steven Spielberg' },
      ],
      meta: { total: 2, page: 1, limit: 10 },
    });
  }),

  http.post('*/directors', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: '3',
      ...body,
    }, { status: 201 });
  }),

  http.put('*/directors/:id', async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: params.id,
      ...body,
    });
  }),

  http.delete('*/directors/:id', () => {
    return HttpResponse.json({ success: true });
  }),
];
```

## Running Specific Tests

```bash
# Run single test file
npm test -- Button.test.tsx

# Run tests matching pattern
npm test -- --grep "login"

# Run tests in specific folder
npm test src/features/auth

# Run E2E test file
npx playwright test auth.spec.ts

# Run E2E tests in headed mode
npx playwright test --headed

# Run E2E tests in specific browser
npx playwright test --project=chromium
```
