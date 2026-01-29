import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './features/auth';
import { QueryProvider } from './core/util/providers/QueryProvider';
import { ToastProvider } from './core/context/ToastContext';
import router from './core/routes/router';

function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </QueryProvider>
  );
}

export default App;
