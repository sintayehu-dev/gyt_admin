# Testing Guide

This project uses a comprehensive testing strategy with three levels of testing:

## Testing Stack

- **Vitest** - Fast unit and integration test runner
- **React Testing Library** - Component testing utilities
- **MSW** - API mocking for integration tests
- **Playwright** - End-to-end testing

## Installation

Install all testing dependencies:

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event msw @playwright/test
```

Install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

### Integration Tests

```bash
# Run integration tests only
npm run test:integration
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug
```

## Test Structure

```
src/
├── test/
│   ├── setup.ts                 # Global test setup
│   ├── utils/
│   │   └── test-utils.tsx       # Custom render with providers
│   ├── mocks/
│   │   ├── handlers.ts          # MSW API handlers
│   │   └── server.ts            # MSW server setup
│   ├── integration/             # Integration tests
│   │   └── auth.test.tsx
│   └── e2e/                     # E2E tests
│       ├── auth.spec.ts
│       └── movies.spec.ts
└── features/
    └── auth/
        └── components/
            └── organisms/
                └── __tests__/   # Component unit tests
                    └── LoginForm.test.tsx
```

## Writing Tests

### Unit Tests (Components)

Test individual components in isolation:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../../../test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

Test feature flows with mocked APIs:

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import LoginPage from '../../features/auth/pages/LoginPage';

describe('Auth Integration Tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('successfully logs in user', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
    });
  });
});
```

### E2E Tests

Test complete user flows in a real browser:

```typescript
import { test, expect } from '@playwright/test';

test('should complete login flow', async ({ page }) => {
  await page.goto('/login');
  
  await page.getByLabel(/email/i).fill('admin@example.com');
  await page.getByLabel(/password/i).fill('admin123');
  await page.getByRole('button', { name: /login/i }).click();
  
  await expect(page).toHaveURL(/\/dashboard/);
});
```

## Best Practices

### Unit Tests
- Test component behavior, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Mock external dependencies
- Keep tests focused and isolated

### Integration Tests
- Test feature workflows
- Mock API calls with MSW
- Test error scenarios
- Verify user interactions

### E2E Tests
- Test critical user journeys
- Test across different browsers
- Keep tests stable and reliable
- Use page object pattern for complex flows

## Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Cover all critical user flows
- **E2E Tests**: Cover main user journeys

## Continuous Integration

Add to your CI pipeline:

```yaml
- name: Run tests
  run: npm run test:run

- name: Run E2E tests
  run: npm run test:e2e
```

## Debugging Tests

### Vitest
```bash
# Run specific test file
npm test -- Button.test.tsx

# Run tests matching pattern
npm test -- --grep "login"
```

### Playwright
```bash
# Debug mode with browser
npm run test:e2e:debug

# Run specific test
npx playwright test auth.spec.ts
```

## Common Issues

### Tests timing out
- Increase timeout in vitest.config.ts
- Check for unresolved promises
- Verify API mocks are working

### Flaky E2E tests
- Add proper waits (waitFor, expect)
- Avoid hard-coded delays
- Use stable selectors

### Mock not working
- Verify MSW handlers are registered
- Check API URL matches
- Ensure server.listen() is called
