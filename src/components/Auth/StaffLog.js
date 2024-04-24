import React, { useState, useEffect } from 'react';
import { FaPaw,  FaEnvelope, FaLock, FaEye, FaEyeSlash , FaUserCog , FaSyringe} from 'react-icons/fa';
import { useNavigate , Link} from 'react-router-dom';

import axios from 'axios';

function StaffLog() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
  }, []);

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
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center gap-9 justify-center bg-gradient-to-r from-gray-600 to-teal-800">
       <div className="text-5xl font-bold mb-4 text-white ">
        <div className='flex justify-between items-center mt-20'>
       <FaPaw className="text-8xl text-orange-600" />
<FaSyringe className="absolute ml-6 text-6xl text-white opacity-80" />
</div>
         <h2> Pets Care System </h2> 
         <div className="text-sm text-white mt-2">
            Your data is secure with us. We do not share your information with third parties.
          </div>
        </div>
      <div className="bg-gray-100 p-8  rounded shadow-md w-full max-w-md">
      <div className="flex items-center justify-center mb-6">
          <FaUserCog className="text-8xl text-white rounded-full bg-indigo-600 p-4" />
        </div>
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">STAFF?</h2>
        <form onSubmit={handleSubmit} >
        <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                        Staff?
                      </label>
                      <select
                        id="role"
                        name="role"
                        className="input-field"
                        required
                      >
                        <option value="" disabled></option>
                       
                        <option value="Nutrition speacialist">Nutrition speacialist</option>
                        <option value="Vaccination technician">Vaccination technician</option>
                        <option value="Grommer">Grommer</option>
                        <option value="Boarding Attendant">Boarding Attendant</option>
                        <option value="Daycare assistant">Daycare assistant</option>
                        <option value="Vertinary nurse">Vertinary nurse</option>
                        
                        
                      </select>
                    </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              <FaEnvelope className="inline-block mr-2" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='enter your email...'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              <FaLock className="inline-block mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder='enter your password...'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input-field pr-3"
                required
              />
              <div
                className="absolute text-3xl top-1 right-9 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center">
  <button
    type="submit"
    className="text-2xl bg-gradient-to-r from-yellow-500 to-red-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
  >
    Enter
  </button>

</div>

        </form>
      </div>
    </div>
  );
}

export default StaffLog;
