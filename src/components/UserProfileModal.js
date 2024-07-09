// UserProfileModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfileModal = ({ userId, onClose }) => {
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://mentor-server-qd42.onrender.com/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.data.User);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, token]);

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      {/* Modal Content */}
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        {/* Render user data in the modal */}
        {userData && (
          <div>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-xl font-bold mb-2">User Profile</h3>
              <p>
                <strong>First Name:</strong> {userData.firstname}
              </p>
              <p>
                <strong>Last Name:</strong> {userData.lastname}
              </p>
              {/* Add more fields as needed */}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={onClose}
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;
