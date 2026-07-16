// Base URL for the backend server.
// In development, this defaults to localhost:5000.
// In production/deployment, set VITE_BACKEND_URL to your deployed backend URL.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const API_BASE_URL = `${BACKEND_URL}/api`;
export const ASSET_BASE_URL = BACKEND_URL;
