import React, { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { TrendingUp, Mail, Lock, User, Eye, EyeOff, Shield } from 'lucide-react';

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, setActive } = useSignIn();
  const { signUp, setActive: setActiveSignUp } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign up flow
        const result = await signUp?.create({
          emailAddress: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        });

        if (result?.status === 'complete') {
          await setActiveSignUp({ session: result.createdSessionId });
        }
      } else {
        // Sign in flow
        const result = await signIn?.create({
          identifier: email,
          password: password,
        });

        if (result?.status === 'complete') {
          await setActive({ session: result.createdSessionId });
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp?.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: window.location.origin,
          redirectUrlComplete: window.location.origin,
        });
      } else {
        await signIn?.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: window.location.origin,
          redirectUrlComplete: window.location.origin,
        });
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Google authentication failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-40 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-12">
            <div className="bg-white bg-opacity-20 rounded-xl p-3">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Aurixly</span>
          </div>
          
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Grow Your Wealth with Smart Investments
            </h1>
            <p className="text-xl text-indigo-100 leading-relaxed">
              Join thousands of investors earning consistent returns with our proven investment platform.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: Shield, title: 'Bank-Level Security', desc: 'Your funds are protected with enterprise security' },
              { icon: TrendingUp, title: 'Guaranteed Returns', desc: 'Multiple investment plans with guaranteed profits' },
              { icon: User, title: '24/7 Support', desc: 'Get help whenever you need it from our team' }
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-3 flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-indigo-100">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-indigo-200 text-sm relative z-10">
          <p>© 2025 Aurixly. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="bg-indigo-600 rounded-xl p-2">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Aurixly</span>
            </div>
            <p className="text-gray-600">Smart Investment Platform</p>
          </div>

          {/* Single Auth Container */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-indigo-100">
                {isSignUp 
                  ? 'Join Aurixly and start investing today' 
                  : 'Sign in to continue to your dashboard'
                }
              </p>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Google Button */}
              <button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-6 disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="John"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </button>
              </form>

              {/* Toggle */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setEmail('');
                    setPassword('');
                    setFirstName('');
                    setLastName('');
                  }}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Create one"
                  }
                </button>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <p className="text-xs text-green-800">
                    Your data is encrypted and secure. We never store your passwords.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}