import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/SupabaseAuthContext';
import toast from 'react-hot-toast';

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

  // Production user accounts in display order
  const productionUsers = [
    { email: 'admin@nexaflow.com', password: 'NexaFlow2025!Admin', name: 'System Administrator', role: 'admin' },
    { email: 'pm@nexaflow.com', password: 'NexaFlow2025!PM', name: 'Project Manager', role: 'project_manager' },
    { email: 'senior.dev@nexaflow.com', password: 'NexaFlow2025!Senior', name: 'Senior Developer', role: 'team_member' },
    { email: 'frontend.dev@nexaflow.com', password: 'NexaFlow2025!Frontend', name: 'Frontend Developer', role: 'team_member' },
    { email: 'backend.dev@nexaflow.com', password: 'NexaFlow2025!Backend', name: 'Backend Developer', role: 'team_member' },
    { email: 'designer@nexaflow.com', password: 'NexaFlow2025!Design', name: 'UI/UX Designer', role: 'team_member' },
    { email: 'qa@nexaflow.com', password: 'NexaFlow2025!QA', name: 'QA Engineer', role: 'team_member' },
    { email: 'devops@nexaflow.com', password: 'NexaFlow2025!DevOps', name: 'DevOps Engineer', role: 'team_member' }
  ];

  const handleQuickLogin = (user: typeof productionUsers[0]) => {
    setEmail(user.email);
    setPassword(user.password);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!password.trim()) {
      toast.error('Please enter your password');
      return;
    }
    
    if (isSignUp) {
      if (!firstName.trim() || !lastName.trim()) {
        toast.error('Please enter your first and last name');
        return;
      }
      
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
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
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address');
        return;
      }
      
      await signIn(email, password);
    }
  };



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

          {/* Quick Login - Production Users */}
          {!isSignUp && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-900 mb-3">Quick Login - Production Users</h3>
              <div className="space-y-2">
                {productionUsers.map((user, index) => (
                  <button
                    key={user.email}
                    onClick={() => handleQuickLogin(user)}
                    className="w-full text-left px-3 py-2 bg-white rounded-md border border-blue-200 hover:bg-blue-50 transition-colors text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-blue-900">{user.name}</div>
                        <div className="text-blue-600 text-xs">{user.email}</div>
                      </div>
                      <div className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-blue-700 mt-2 text-center">
                Click any user to auto-fill login credentials
              </p>
            </div>
          )}

          {/* Login/Signup Form */}
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
                  minLength={1}
                  autoComplete="current-password"
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