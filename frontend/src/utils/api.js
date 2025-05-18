import axios from 'axios';
import { FALLBACK_IMAGE_MEDIUM } from './images';

// Base URLs
const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
const UPLOADS_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to get full image URL
export const getImageUrl = (path) => {
  // If no path or empty string, return fallback
  if (!path || path === '') return FALLBACK_IMAGE_MEDIUM;
  
  // If already an absolute URL, return as is
  if (path.startsWith('http')) return path;
  
  // Remove any duplicate uploads prefix
  let cleanPath = path;
  if (path.startsWith('/uploads/uploads/')) {
    cleanPath = path.replace('/uploads/uploads/', '/uploads/');
  } else if (path.startsWith('uploads/uploads/')) {
    cleanPath = path.replace('uploads/uploads/', '/uploads/');
  } else if (!path.startsWith('/uploads/') && !path.startsWith('uploads/')) {
    // Add uploads prefix if it doesn't exist
    cleanPath = `/uploads/${path.startsWith('/') ? path.substring(1) : path}`;
  } else if (path.startsWith('uploads/')) {
    // Ensure leading slash
    cleanPath = `/${path}`;
  }
  
  // Create the full URL
  return `${UPLOADS_URL}${cleanPath}`;
};

export default api; 