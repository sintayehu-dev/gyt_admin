const env = {
  appTitle: import.meta.env.VITE_APP_TITLE || 'NEST Admin',
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  environment: import.meta.env.VITE_ENV || 'development',
  debug: import.meta.env.VITE_DEBUG === 'true',

  isDevelopment: () => env.environment === 'development',
  isStaging: () => env.environment === 'staging',
  isProduction: () => env.environment === 'production',
};

export default env;
