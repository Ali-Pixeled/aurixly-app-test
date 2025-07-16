import React from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AuthForm } from './components/AuthForm';

function AppContent() {
  const [activeTab, setActiveTab] = React.useState('home');

  console.log('App rendering...');

  return (
    <div>
      <SignedOut>
        {console.log('User signed out, showing AuthForm')}
        <AuthForm />
      </SignedOut>
      <SignedIn>
        {console.log('User signed in, showing Dashboard')}
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
  console.log('Main App component rendering...');
  return <AppContent />;
}

export default App;