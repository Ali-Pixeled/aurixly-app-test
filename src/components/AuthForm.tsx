import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { TrendingUp, Shield, Users, DollarSign, CheckCircle } from 'lucide-react';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showTerms, setShowTerms] = useState(false);

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

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600 mt-2">
                {isLogin ? 'Sign in to your account' : 'Start your investment journey'}
              </p>
            </div>

            {/* Terms Notice for Sign Up */}
            {!isLogin && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  By creating an account, you agree to our{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-blue-600 hover:text-blue-500 underline font-medium"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-blue-600 hover:text-blue-500 underline font-medium"
                  >
                    Privacy Policy
                  </button>
                </p>
              </div>
            )}

            {/* Clerk Auth Components */}
            <div className="space-y-4">
              {isLogin ? (
                <SignIn 
                  routing="virtual"
                  signUpUrl="#"
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                      card: 'shadow-none border-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50',
                      formFieldInput: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                      footerActionLink: 'text-indigo-600 hover:text-indigo-500',
                      footer: 'hidden',
                    },
                    layout: {
                      socialButtonsPlacement: 'bottom',
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
                      card: 'shadow-none border-none',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50',
                      formFieldInput: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                      footerActionLink: 'text-indigo-600 hover:text-indigo-500',
                      footer: 'hidden',
                    },
                    layout: {
                      socialButtonsPlacement: 'bottom',
                    }
                  }}
                />
              )}
            </div>

            {/* Toggle Auth Mode */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'
                }
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-xs text-green-800">
                  Your data is encrypted and secure. We never store your passwords.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Terms of Service & Privacy Policy</h3>
                <button
                  onClick={() => setShowTerms(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6 text-sm text-gray-700">
                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">Terms of Service</h4>
                  <div className="space-y-2">
                    <p>By using Aurixly, you agree to the following terms:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>You must be 18 years or older to use this platform</li>
                      <li>You are responsible for maintaining the security of your account</li>
                      <li>All investments carry risk and past performance doesn't guarantee future results</li>
                      <li>We reserve the right to suspend accounts that violate our policies</li>
                      <li>Withdrawal requests are processed within 24-48 hours</li>
                      <li>You agree to provide accurate and truthful information</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">Privacy Policy</h4>
                  <div className="space-y-2">
                    <p>We are committed to protecting your privacy:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>We collect only necessary information to provide our services</li>
                      <li>Your personal data is encrypted and stored securely</li>
                      <li>We never sell or share your information with third parties</li>
                      <li>You can request deletion of your data at any time</li>
                      <li>We use cookies to improve your experience on our platform</li>
                      <li>All financial transactions are processed through secure, encrypted channels</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">Investment Disclaimer</h4>
                  <div className="space-y-2">
                    <p className="text-yellow-800 bg-yellow-50 p-3 rounded-lg">
                      <strong>Important:</strong> All investments involve risk. The value of investments can go down as well as up. 
                      Past performance is not indicative of future results. Please invest responsibly and only invest what you can afford to lose.
                    </p>
                  </div>
                </section>

                <section>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <p>If you have any questions about these terms, please contact us at support@aurixly.com</p>
                </section>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTerms(false)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}