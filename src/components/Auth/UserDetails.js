import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import Axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

const UserDetails = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    school: '',
    university: '',
    studyField: '',
    dob: '',
    country: '',
    city: '',
    street: '',
  });
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('Token');
      const response = await Axios.post('http://localhost:5000/api/detail/userdetail', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Assuming 'token' is defined elsewhere
        },
      });
      console.log(response.data);
      console.log('Form data submitted successfully:');
      navigate('/dashboard/profile');
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <div className="font-poppins bg-gradient-to-r from-violet-950 via-black to-orange-800 min-h-screen flex items-center justify-center text-xl">
      <div className="text-white">
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-semibold mb-6">But first, let's get to know you better</h2>
            <form onSubmit={handleNextStep} className="text-black">
              <div className="mb-4">
                <label htmlFor="firstName" className="text-white block mb-2">What's your name?</label>
                <div className='flex justify-between gap-4'>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    onChange={handleInputChange}
                    className="input-field font-bold"
                    required
                  />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    onChange={handleInputChange}
                    className="input-field font-bold"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="text-white block mb-2">Are you a Mentor or a Learner?</label>
                <select
                  id="role"
                  name="role"
                  onChange={handleInputChange}
                  className="input-field font-bold text-gray-900"
                  required
                >
                  <option value="">Mentor/Leaner</option>
                  <option value="mentor">Mentor</option>
                  <option value="learner">Learner</option>
                </select>
              </div>
              <footer className='text-right mr-2'>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="text-2xl bg-gradient-to-r from-red-800 to-orange-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                >
                  Next <FaArrowRight className="inline-block ml-2" />
                </button>
              </footer>
            </form>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-semibold mb-6">Education</h2>
            <form onSubmit={handleNextStep} className="flex justify-between gap-8 text-black">
              <div>
                <div className="mb-4">
                  <label htmlFor="school" className="text-white block mb-2">High School</label>
                  <input
                    type="text"
                    id="school"
                    name="school"
                    placeholder="School attended"
                    onChange={handleInputChange}
                    className="input-field font-bold"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="university" className="text-white block mb-2">University</label>
                  <input
                    type="text"
                    id="university"
                    name="university"
                    placeholder="University attended"
                    onChange={handleInputChange}
                    className="input-field font-bold"
                    required
                  />
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <label htmlFor="studyField" className="text-white block mb-2">Field of Study</label>
                  <select
                    id="studyField"
                    name="studyField"
                    onChange={handleInputChange}
                    className="input-field font-bold text-gray-900"
                    required
                  >
                    <option value="">Select your field of study</option>
                    <option value="computerScience">Computer Science</option>
                    <option value="engineering">Engineering</option>
                    <option value="biology">Biology</option>
                    <option value="psychology">Psychology</option>
                    <option value="business">Business</option>
                  </select>
                </div>
              </div>
              <footer className='text-right mr-2 pt-9'>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="text-2xl bg-gradient-to-r from-red-800 to-orange-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                >
                  Next <FaArrowRight className="inline-block ml-2" />
                </button>
              </footer>
            </form>
          </div>
        )}
        {step === 3 && (
          <div>
            <form onSubmit={handleSubmit} className="text-black">
              <label className="text-3xl font-semibold mb-6 text-white pt-3 ">What's your date of birth?</label> <br />
              <input
                type="date"
                id="dob"
                name="dob"
                placeholder="Date of Birth"
                onChange={handleInputChange}
                className="input-field font-bold border-b-2 border-white p-3"
                required
              /><br />
              <label className="text-3xl font-semibold mb- text-white p-3">Where do you live?</label>
              <div className='grid grid-cols-2 '>
                <label htmlFor="country" className='text-white p-3'>Country <br />
                  <input
                    type="text"
                    id="country"
                    name="country"
                    placeholder="Country"
                    onChange={handleInputChange}
                    className="input-field font-bold text-black p-3"
                    required
                  />
                </label>
                <label htmlFor="city" className='text-white p-3'>City <br />
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="City"
                    onChange={handleInputChange}
                    className="input-field font-bold text-black p-3"
                    required
                  />
                </label>
              </div>
              <label htmlFor="street" className='text-white p-3'>Street <br />
              <input
                type="text"
                id="street"
                name="street"
                placeholder="Street"
                onChange={handleInputChange}
                className="input-field font-bold text-black p-3"
                required
              />
              </label>
            </form>
            <footer className='text-right mr-2 pb-0'>
              <button
                type="submit"
                onClick={handleSubmit}
                className="text-2xl bg-gradient-to-r from-red-800 to-orange-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
              >
                Finish
              </button>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;

