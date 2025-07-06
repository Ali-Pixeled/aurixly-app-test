import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log('Clerk Key Length:', PUBLISHABLE_KEY?.length);
console.log('Clerk Key Preview:', PUBLISHABLE_KEY?.substring(0, 20) + '...');

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file");
  throw new Error("Missing Publishable Key");
}

if (PUBLISHABLE_KEY.length < 50) {
  console.error("Clerk Publishable Key appears to be truncated. Expected length > 50, got:", PUBLISHABLE_KEY.length);
  console.error("Please verify your key is complete in the .env file");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </StrictMode>
);