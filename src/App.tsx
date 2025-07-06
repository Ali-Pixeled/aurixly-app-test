import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AuthForm } from './components/AuthForm';

function AppContent() {
  const [activeTab, setActiveTab] = React.useState('home');

  return (
    <div>
      <SignedOut>
        <AuthForm />
      </SignedOut>
      <SignedIn>
        <AppProvider>
          <Layout activeTab={activeTab} onTabChange={setActiveTab}>
            <Dashboard activeTab={activeTab} onTabChange={setActiveTab} />
          </Layout>
        </AppProvider>
      </SignedIn>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;