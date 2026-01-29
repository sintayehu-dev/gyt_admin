import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './features/auth';
import router from './core/routes/router';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
