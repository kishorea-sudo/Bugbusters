import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/SupabaseAuthContext';
import { loginWithDemo } from '../../context/SupabaseAuthContext';

const SupabaseLoginForm: React.FC = () => {
  const { signIn, signUp, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'admin' | 'project_manager' | 'team_member' | 'client'>('team_member');
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      if (password !== confirmPassword) {
        return; // Handle password mismatch
      }
      
      await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        role: role,
        email: email,
        is_active: true,
        phone: null,
        avatar_url: null,
        department: null,
        skills: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        id: '' // Will be set by Supabase
      });
    } else {
      await signIn(email, password);
    }
  };

  const handleDemoLogin = async (demoRole: 'admin' | 'pm' | 'client' | 'sarah' | 'alex') => {
    await loginWithDemo(demoRole);
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
      description: 'Create projects, assign tasks, manage team workflows',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      role: 'sarah' as const,
      name: 'Sarah Wilson (Team Member)',
      description: 'Frontend developer - can only see assigned tasks',
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      role: 'alex' as const,
      name: 'Alex Chen (Team Member)',
      description: 'Backend developer - can only see assigned tasks',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700'
    },
    {
      role: 'client' as const,
      name: 'Client User',
      description: 'View project progress and communicate with team',
      color: 'bg-green-50 border-green-200 text-green-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/logo.png" 
                alt="NexaFlow" 
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to NexaFlow</h1>
            <p className="text-gray-600 mt-2">Actually helps you finish things</p>
          </div>

          {/* Demo Login Section */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Demo Access</h3>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.role}
                  onClick={() => handleDemoLogin(user.role)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors hover:shadow-md ${user.color}`}
                  disabled={isLoading}
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs opacity-75">{user.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Regular Login/Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={isSignUp}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={isSignUp}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="team_member">Team Member</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your password"
                  required={isSignUp}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {isSignUp ? <UserPlus className="w-5 h-5 mr-2" /> : <Mail className="w-5 h-5 mr-2" />}
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Powered by Supabase Authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseLoginForm;