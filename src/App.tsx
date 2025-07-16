import React from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AuthForm } from './components/AuthForm';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

function AppContent() {
  const [activeTab, setActiveTab] = React.useState('home');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  console.log('App rendering...');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-auto">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-4 w-16 h-16 mx-auto mb-6">
              <div className="animate-spin">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Aurixly</h2>
            <p className="text-gray-600 text-sm">Loading your investment platform...</p>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

function App() {
  console.log('Main App component rendering...');
  return <AppContent />;
}

export default App;