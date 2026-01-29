import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './features/auth';
import { QueryProvider } from './core/util/providers/QueryProvider';
import router from './core/routes/router';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
