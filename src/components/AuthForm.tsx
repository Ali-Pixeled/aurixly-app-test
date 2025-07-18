import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { TrendingUp, Shield, Users, DollarSign, CheckCircle } from 'lucide-react';

export function AuthForm() {
  const [isLogin, setIsLogin] = React.useState(true);

  const features = [
    {
      icon: DollarSign,
      title: 'Secure Investments',
      description: 'Multiple investment plans with guaranteed returns'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your funds are protected with enterprise security'
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Get help whenever you need it from our team'
    }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <TrendingUp className="h-10 w-10 text-yellow-400" />
            <span className="text-3xl font-bold text-white">Aurixly</span>
          </div>
          
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Grow Your Wealth with Smart Investments
            </h1>
            <p className="text-xl text-indigo-100">
              Join thousands of investors earning consistent returns with our proven investment platform.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-indigo-100">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-indigo-200 text-sm">
          <p>© 2024 Aurixly. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">Aurixly</span>
            </div>
            <p className="text-gray-600">Smart Investment Platform</p>
          </div>

          {/* Single Auth Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back!' : 'Join Aurixly'}
              </h2>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Sign in to continue to your dashboard' 
                  : 'Create your account to start investing'
                }
              </p>
            </div>

            {/* Terms Notice for Sign Up Only */}
            {!isLogin && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}

            {/* Clerk Auth Components */}
            <div className="mb-6">
              {isLogin ? (
                <SignIn 
                  routing="virtual"
                  signUpUrl="#"
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                      card: 'shadow-none border-none p-0',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50 mb-4',
                      formFieldInput: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                      footerActionLink: 'text-indigo-600 hover:text-indigo-500',
                      footer: 'hidden',
                      dividerLine: 'bg-gray-300',
                      dividerText: 'text-gray-500',
                    },
                    layout: {
                      socialButtonsPlacement: 'top',
                    }
                  }}
                />
              ) : (
                <SignUp 
                  routing="virtual"
                  signInUrl="#"
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                      card: 'shadow-none border-none p-0',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50 mb-4',
                      formFieldInput: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                      footerActionLink: 'text-indigo-600 hover:text-indigo-500',
                      footer: 'hidden',
                      dividerLine: 'bg-gray-300',
                      dividerText: 'text-gray-500',
                    },
                    layout: {
                      socialButtonsPlacement: 'top',
                    }
                  }}
                />
              )}
            </div>

            {/* Toggle Auth Mode */}
            <div className="text-center border-t border-gray-200 pt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                {isLogin 
                  ? "Don't have an account? Create one" 
                  : 'Already have an account? Sign in'
                }
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-800">
                  Your data is encrypted and secure. We never store your passwords.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}