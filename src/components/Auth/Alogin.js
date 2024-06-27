import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Alogin() {
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Clear error message on component mount
  useEffect(() => {
    setError(null);
  }, []);

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:5000/api/auth/signin', { email, password });
      if (response.data && response.data.user && response.data.user.email) {
        localStorage.setItem('Profile', JSON.stringify(response.data));
      }
      const { token } = response.data;
      localStorage.setItem('Token', token);
      console.log('Login successful! Token:', token);

      // Navigate directly to the dashboard
      navigate('/dashboard/usermanagement');
    } catch (error) {
      console.log(error);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center bg-gradient-to-r from-orange-800 via-black to-violet-800 font-poppins">
      <Link to="/" className="absolute top-6 left-6 text-white text-2xl">
        <FaArrowLeft />
      </Link>

      <div className="p-8 rounded-lg shadow-lg text-center max-w-md w-full bg-gray-800 bg-opacity-20">
        <h2 className="text-3xl font-semibold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="relative mb-4">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email/Username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input-field font-bold bg-transparent text-white border-b-2 border-white py-2 px-3"
              required
            />
            <FaEnvelope className="inline-block top-3 left-3 text-white" />
          </div>
          {/* Password input */}
          <div className="relative mb-4 p-5">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input-field font-bold bg-transparent text-white border-b-2 border-white py-2 px-3"
              required
            />
            <div
              className="absolute top-6 right-12 text-xl cursor-pointer text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash className="inline-block top-3 left-3 text-white" /> : <FaEye className="inline-block top-3 left-3 text-white" />}
            </div>
          </div>
          <div className="relative p-5 mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <label htmlFor="rememberMe" className="text-white">
              Remember Me
            </label>
          </div>
          {/* Submit button */}
          <div className="flex items-center justify-center pt-9">
            <button
              type="submit"
              className="btn-login text-2xl bg-gradient-to-r from-red-800 to-violet-600 hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
          {/* Error message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      
      </div>
    </div>
  );
}

export default Alogin;
