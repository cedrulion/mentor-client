import React, { useState } from 'react';
import { FaPaw, FaUser, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData((prevState) => ({ ...prevState, [name]: inputValue }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {}; // Renamed from errors to newErrors

    // Existing validation checks...

    if (!formData.agree) {
      newErrors.agree = 'Please agree to the terms and conditions';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.dob) {
      newErrors.dob = 'Please enter your date of birth';
      isValid = false;
    }

    setErrors(newErrors); // Changed from errors to newErrors
    return isValid;
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log('Form data:', formData); // Add this line for debugging
      try {
        await axios.post('http://localhost:5000/api/auth/signup', formData);
        console.log('Signup successful');
        alert('Signup successful!');
        navigate('/signin');
      } catch (error) {
        console.error('Signup failed', error);
        alert('Signup failed');
      }
    }
  };


  return (
    <div className="min-h-screen flex text-white items-center justify-center bg-gradient-to-r from-orange-700 to-violet-900 font-poppins">
      <Link to="/signin" className="absolute top-6 left-6 text-white text-2xl">
        <FaArrowLeft />
      </Link>

      <div className=" p-9 rounded shadow-md ">
        <h2 className="text-3xl font-semibold mb-6 ">Create an Account</h2>
        <form onSubmit={handleSignup} className="text-center ">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
                className={`input-field font-bold bg-transparent text-white border-b-2 border-white ${errors.email && 'border-red-500'}`}
                required
              />
              <FaEnvelope className="inline-block top-3 left-3 text-gray-500" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                onChange={handleInputChange}
                className={`input-field font-bold bg-transparent text-white border-b-2 border-white ${errors.username && 'border-red-500'}`}
                required
              />
              <FaUser className="inline-block  top-3 left-3 text-white" />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
                className={`input-field font-bold bg-transparent text-white border-b-2 border-white ${errors.password && 'border-red-500'}`}
                required
              />
              <FaLock className="inline-block  top-3 left-3 text-gray-500" />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleInputChange}
                className={`input-field font-bold bg-transparent text-white border-b-2 border-white ${errors.confirmPassword && 'border-red-500'}`}
                required
              />
              <FaLock className="inline-block  top-3 left-3 text-gray-500" />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <input
                type="date"
                id="dob"
                name="dob"
                placeholder="Date of Birth"
                onChange={handleInputChange}
                className={`input-field font-bold bg-transparent text-white border-b-2 border-white ${errors.dob && 'border-red-500'}`}
                required
              />
       
              {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
            </div>
          </div>
          <div className="flex items-center mb-4 pt-9">
            <input
              type="checkbox"
              id="agree"
              name="agree"
              checked={formData.agree}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="agree" className="text-white">
              I agree to the <span>terms and conditions</span>
            </label>
          </div>
          {errors.agree && <p className="text-red-500 text-sm mt-1">{errors.agree}</p>}
          <div className="flex items-center justify-center mt-6">
            <button
              type="submit"
              className="text-2xl bg-gradient-to-r from-red-800 to-orange-600  hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline "
            >
              Signup
            </button>
          </div>
          <h2 className="mt-4 text-white">
            Already have an account? <u> <Link to='/signin'>Log in</Link> </u> </h2>
          </form>
        </div>
      </div>
  );
};

export default SignUp;
