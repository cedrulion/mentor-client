import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaUser, FaArrowLeft } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import LOGO from "../Assets/loading.gif";

const SearchBarr = ({ onStartChat }) => {
  const [classType, setClassType] = useState('');
  const [classTime, setClassTime] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userExperiences, setUserExperiences] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mentorsResponse = await axios.get('https://mentor-server-qd42.onrender.com/api/detail/user/details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentors(mentorsResponse.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized access. Redirect to login page.');
        } else {
          console.error('Error fetching data:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMentorClick = (mentor) => {
    setSelectedUser(mentor);
  };

  const renderStars = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <FontAwesomeIcon key={index} icon={faStar} size="1x" color="orange" className="ml-1" />
    ));
  };

  const getRequestStatus = (mentorId) => {
    // Dummy function, replace with actual logic for fetching request status if needed
    return 'accepted'; // Example: Hardcoded for demonstration
  };

  const sendRequest = async (mentorId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/requests/${mentorId}`,
        { classType, classTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Request sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const viewDetail = async (userId) => {
    try {
      const response = await axios.get(`https://mentor-server-qd42.onrender.com/api/detail/user/detail/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(response.data);
      fetchUserExperiences(userId);
    } catch (error) {
      console.error('Error fetching user detail:', error);
    }
  };

  const fetchUserExperiences = async (userId) => {
    try {
      const response = await axios.get(`https://mentor-server-qd42.onrender.com/api/experience/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserExperiences(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching user experiences:', error);
    }
  };

  const resetForm = () => {
    setClassType('');
    setClassTime('');
  };

  const startChat = async (mentorId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/chats/start/${mentorId}`,
     
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const chatId = response.data.chatId;
      onStartChat(chatId);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const ConfirmationModal = ({ onCancel, onConfirm }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-Interi">
      <div className="bg-white p-4 rounded-md shadow-md">
        <p className="mb-4">Are you sure you want to send the request?</p>
        <div className="flex justify-end">
          <button className="bg-gray-400 px-3 py-1 rounded-md mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button className="bg-orange-900 px-3 py-1 text-white rounded-md" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-300 to-orange-200 flex items-center justify-center">
        <img src={LOGO} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-gray-300 to-orange-200">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <div></div>
        <div className="text-2xl font-bold text-gray-700 ml-6">Find Mentors</div>
        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search by study field..."
            className="border rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute top-2.5 right-3 fill-current w-4 h-4 text-gray-500" />
        </div>
      </div>

      {selectedUser ? (
        <div className="bg-gradient-to-r from-gray-400 to-orange-200 h-screen rounded-md shadow-md p-4">
          <div className="flex cursor-pointer" onClick={() => setSelectedUser(null)}>
            <FaArrowLeft className="text-gray-900 rounded-lg text-xl text-center" />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mt-4">
              {selectedUser.firstName} {selectedUser.lastName}
            </h2>
            <p className="text-lg">
              {selectedUser.studyField}, {selectedUser.school}
            </p>
            <div className='w-full'>
              <h2 className="text-3xl font-bold mt-4 text-red-800">About</h2>
              <h2 className="text-xl font-bold mt-4">Experience</h2>
              {userExperiences.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {userExperiences.map((experience) => (
                    <div key={experience._id} className="bg-gray-200 p-4 rounded-md shadow">
                      <h3 className="text-lg font-semibold">{experience.title}</h3>
                      <p className="text-sm font-bold">{experience.description}</p>
                      <p className="text-xs mt-2 ">
                        {new Date(experience.startDate).toLocaleDateString()} -{' '}
                        {new Date(experience.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lg text-center text-gray-800">No experiences found.</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div>
                <label htmlFor="classType" className="text-lg font-semibold">
                  Choose your class type
                </label>
                <select
                  id="classType"
                  value={classType}
                  onChange={(e) => setClassType(e.target.value)}
                  className="bg-white py-2 px-3 rounded-md w-full"
                >
                  <option value="">Select Class Type</option>
                  <option value="inperson">In Person</option>
                  <option value="online">Online</option>
                  <option value="workshops">Workshops</option>
                  <option value="oneonone">One-on-One</option>
                </select>
              </div>
              <div>
                <label htmlFor="classTime" className="text-lg font-semibold">
                  Choose preferred class time
                </label>
                <input
                  type="datetime-local"
                  id="classTime"
                  value={classTime}
                  onChange={(e) => setClassTime(e.target.value)}
                  className="bg-white py-2 px-3 rounded-md w-full"
                />
              </div>
            </div>
            <button
              className="bg-gradient-to-r from-violet-800 to-orange-800 py-2 px-8 text-lg rounded-md text-white mt-11 font-semibold"
              onClick={() => setShowConfirmationModal(true)}
            >
              Request Session
            </button>
            <button
              className="bg-gradient-to-r from-violet-800 to-orange-800 py-2 px-8 text-lg rounded-md text-white mt-4 font-semibold"
              onClick={() => startChat(selectedUser._id)}
            >
              Start Chat
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-200 rounded-md shadow-md overflow-hidden">
          <h1 className="flex justify-center font-bold text-xl text-red-700 font-poppins">Close to you</h1>
          <div className="grid grid-cols-3 gap-4 p-4">
            {mentors.map((mentor) => (
              <div
                key={mentor._id}
                onClick={() => handleMentorClick(mentor)}
                className="hover:bg-orange-200 p-4 rounded-lg shadow-md bg-white cursor-pointer"
              >
                <div className="p-4 bg-gradient-to-r from-gray-200 to-orange-100 rounded-md shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white rounded-full mr-4"></div>
                    <div className="text-lg font-semibold text-gray-800">
                      {mentor.firstName} {mentor.lastName}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 mb-2">{mentor.city}, {mentor.country}</div>
                    <div className="text-gray-500 mb-2">{mentor.studyField}, {mentor.school}</div>
                    <div className="border-t border-gray-300 my-2"></div>
                    <div className="flex justify-center items-center mb-2">
                      {renderStars(mentor.review)}
                      <span className="ml-2 text-gray-600">({mentor.review} reviews)</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-6 text-white">
                    <button className="bg-orange-900 py-2 px-3 rounded-md" onClick={() => startChat(mentor._id)}>
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          onCancel={() => setShowConfirmationModal(false)}
          onConfirm={() => {
            sendRequest(selectedUser._id);
            resetForm();
            setShowConfirmationModal(false);
          }}
        />
      )}
    </div>
  );
};

export default SearchBarr;
