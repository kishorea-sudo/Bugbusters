import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<'admin' | 'pm' | 'client'>('admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use demo credentials based on selection
    const demoCredentials = {
      admin: 'admin@nexaflow.com',
      pm: 'pm@nexaflow.com', 
      client: 'client@nexaflow.com'
    };
    
    await login(email || demoCredentials[selectedDemo], password || 'demo123');
  };

  const demoUsers = [
    {
      role: 'admin' as const,
      name: 'Admin User',
      description: 'Full system access, analytics, and team management',
      color: 'bg-red-50 border-red-200 text-red-700'
    },
    {
      role: 'pm' as const,
      name: 'Project Manager',
      description: 'Create projects, upload files, manage workflows',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      role: 'client' as const,
      name: 'Client User',
      description: 'Review deliverables, approve work, track progress',
      color: 'bg-green-50 border-green-200 text-green-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to NexaFlow</h1>
            <p className="text-gray-600 mt-2">Actually helps you finish things</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Demo Accounts</h3>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.role}
                  type="button"
                  onClick={() => setSelectedDemo(user.role)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                    selectedDemo === user.role 
                      ? user.color
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium capitalize">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.description}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email or leave blank for demo"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password or leave blank for demo"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In to Demo'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Demo Features Available:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Project management with real-time updates</li>
              <li>• File versioning and approval workflows</li>
              <li>• AI-powered weekly report generation</li>
              <li>• WhatsApp notification simulation</li>
              <li>• Role-based access control</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;