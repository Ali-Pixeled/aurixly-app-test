import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log('Environment check:', {
  PUBLISHABLE_KEY: PUBLISHABLE_KEY ? 'Present' : 'Missing',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'Present' : 'Missing',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing'
});

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
  // Don't throw error, show fallback instead
}

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('Root element found, rendering app...');
  createRoot(rootElement).render(
    <StrictMode>
      {PUBLISHABLE_KEY ? (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <App />
        </ClerkProvider>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
            <p className="text-red-800">Missing Clerk Publishable Key. Please check your environment variables.</p>
          </div>
        </div>
      )}
    </StrictMode>
  );
} else {
  console.error('Root element not found!');
}