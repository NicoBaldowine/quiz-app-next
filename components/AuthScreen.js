import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from "@nextui-org/react";
import { Eye, EyeOff } from 'lucide-react';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setMessage('');
    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) throw result.error;
      setMessage(isLogin ? 'Logged in successfully!' : 'Registration successful! Check your email for confirmation.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4 pt-12">
      <div className="w-full max-w-md mt-12">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {isLogin ? 'Login' : 'Welcome to ToQuiz App'}
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-4 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <Button
          onClick={handleAuth}
          disabled={loading}
          className={`w-full ${isLogin ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded mb-4`}
        >
          {isLogin ? 'Log In' : 'Sign Up'}
        </Button>
        <p className="text-center text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:text-blue-300"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
};

export default AuthScreen;