// src/pages/landing/landingpages/ResetPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Section from '../components/ui/Section';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import apiClient from '../../../Api';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing password reset token.");
      navigate('/auth/forgot-password'); // Optional: redirect
    }
  }, [token, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
        setError("Reset token is missing.");
        return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/password-reset/confirm/', {
        token,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword, // Serializer expects 'confirm_new_password'
      });
      setMessage(response.data.message || "Your password has been reset successfully. You can now log in.");
      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (err: any) {
      console.error('Reset password error:', err.response?.data);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        let errorMessages = [];
        if (errorData.token) errorMessages.push(...errorData.token);
        if (errorData.new_password) errorMessages.push(...errorData.new_password); // check for new_password
        if (errorData.detail) errorMessages.push(errorData.detail);
        if (errorData.error) errorMessages.push(errorData.error); // general error
        setError(errorMessages.length > 0 ? errorMessages.join(' ') : 'Failed to reset password. The link may be invalid or expired.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 min-h-screen flex flex-col"> {/* Ensure mt-20 for header offset */}
      <Section bgColor="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800" className="flex-grow flex items-center justify-center py-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl w-full max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-5">
                <Lock size={32} />
              </div>
              <SectionHeading
                title="Reset Your Password"
                subtitle="Enter your new password below."
                centered
                className="mb-0"
              />
            </div>

            {message && <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">{message}</div>}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">{error}</div>}

            {!message && ( 
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                    </label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="••••••••"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                    </label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="••••••••"
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                    type="submit"
                    variant="primary"
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    size="lg"
                    icon={<ArrowRight size={20} />}
                    iconPosition="right"
                    disabled={loading || !token}
                    >
                    {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </motion.div>
                </form>
            )}
             {message && (
                <div className="mt-8 text-center">
                     <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                        Proceed to Login
                    </Link>
                </div>
            )}
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default ResetPasswordPage;