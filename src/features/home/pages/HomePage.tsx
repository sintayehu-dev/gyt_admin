/**
 * HomePage Component
 * 
 * Purpose: Landing page that displays a welcome message and environment configuration details.
 * This component serves as the main entry point for authenticated users and provides
 * visibility into the current environment settings (development, staging, production).
 * 
 * Features:
 * - Displays welcome message
 * - Shows current environment configuration (API URL, debug mode, etc.)
 * - Provides helpful information about environment variable configuration
 */

import env from '../../../core/config/env';

const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to NEST Admin</p>
      
      {/* Example: Displaying environment variables */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Environment Configuration:</h3>
        <p><strong>App Title:</strong> {env.appTitle}</p>
        <p><strong>API URL:</strong> {env.apiUrl}</p>
        <p><strong>Environment:</strong> {env.environment}</p>
        <p><strong>Debug Mode:</strong> {env.debug ? 'Enabled' : 'Disabled'}</p>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          Note: Environment variables are defined in .env.{env.environment} and must be prefixed with VITE_
        </p>
      </div>
    </div>
  );
};

export default HomePage;
