import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaSearch, FaUser } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';

const Request = () => {
  const [classType, setClassType] = useState('');
  const [classTime, setClassTime] = useState('');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [ignoredMentors, setIgnoredMentors] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // New state for modal
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/detail/user/details', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMentors(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized access. Redirect to login page.');
        } else {
          console.error('Error fetching mentors:', error);
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

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.studyField.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !ignoredMentors.includes(mentor.user)
  );

  const sendRequest = async (mentorId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/requests/${mentorId}`,
        { classType, classTime }, // Include classType and classTime in the request body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Request sent successfully:', response.data);
      // Optionally, you can update state or show a notification on successful request
    } catch (error) {
      console.error('Error sending request:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const viewDetail = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/detail/user/detail/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Error fetching user detail:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const ignoreMentor = (mentorId) => {
    setIgnoredMentors([...ignoredMentors, mentorId]);
  };

  const ConfirmationModal = ({ onCancel, onConfirm }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 min-h-screen bg-gray-200">
      <div className="m-6 bg-transparent flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <button className="font-bold py-2 px-4 rounded">
          <FaUserPlus className="fill-current text-2xl mr-1" />
        </button>
        <div className="text-2xl font-bold py-2 px-4 rounded">Find Mentors</div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search mentors..."
            value={searchTerm}
            onChange={handleSearch}
            className="bg-orange-100 py-2 px-3 rounded-md w-full focus:outline-none"
          />
          <FaSearch className="fill-current w-4 h-4 text-gray-500 absolute top-0 right-0 mt-2 mr-2" />
        </div>
      </div>
      {selectedUser ? (
        <div className=" bg-gradient-to-r from-gray-500 to-orange-300 h-screen rounded-md shadow-md p-4">
          <div className="flex flex-col items-center">
            <div className="flex cursor-pointer">
              <FiUser className="text-gray-900 rounded-lg text-6xl text-center" />
            </div>
            <h2 className="text-3xl font-bold mt-4">
              {selectedUser.firstName} {selectedUser.lastName}
            </h2>
            <p className="text-lg">
              {selectedUser.studyField}, {selectedUser.school}
            </p>
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
                  <option value="in person">In Person</option>
                  <option value="online">Online</option>
                  <option value="workshops">Workshops</option>
                  <option value="one-one">One-on-One</option>
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
              className=" bg-gradient-to-r from-violet-800 to-orange-800 py-2 px-8 text-lg rounded-md text-white mt-11 font-semibold"
              onClick={() => setShowConfirmationModal(true)} // Open modal on button click
            >
              Request Session
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 bg-gray-200 rounded-md shadow-md overflow-hidden">
          <div>
            <h1 className="flex justify-center font-bold text-xl text-red-700">BEST MATCHES</h1>
            {filteredMentors.map((mentor) => (
              <div key={mentor._id} className="hover:bg-orange-200">
                <div className="p-6 flex gap-3 ">
                  <FaUser className="ml-9 text-orange-300 z-10 rounded-full p-1 text-5xl bg-yellow-900" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {mentor.firstName} {mentor.lastName}
                  </h3>
                </div>
                <div className="ml-20 flex gap-6 text-white">
                  <button className="bg-orange-900 py-2 px-3 rounded-md" onClick={() => viewDetail(mentor.user)}>
                    Request
                  </button>
                  <button className="bg-orange-900 py-2 px-3 rounded-md" onClick={() => ignoreMentor(mentor.user)}>
                    Ignore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Render confirmation modal if showConfirmationModal is true */}
      {showConfirmationModal && (
        <ConfirmationModal
          onCancel={() => setShowConfirmationModal(false)} // Close modal on cancel
          onConfirm={() => {
            setShowConfirmationModal(false); // Close modal
            sendRequest(selectedUser.user); // Send request
          }}
        />
      )}
    </div>
  );
};

export default Request;
