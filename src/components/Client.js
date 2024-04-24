import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiEyeLine, RiDeleteBinLine } from 'react-icons/ri';

const Client = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data.data.allUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [token]);

  const handleViewUser = (user) => {
    setShowModal(true);
    setSelectedUser(user);
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mx-auto mt-32 ml-32 grid grid-cols-3 gap-4">
      {users.filter((user) => user.role === 'user').map((user) => (
        <div key={user._id} className="max-w-sm rounded-md overflow-hidden shadow-lg mb-4">
          <div className="p-4 ">
            <h3 className="text-xl font-bold mb-2">{user.firstname} {user.lastname}</h3>
            <p>Email: {user.email}</p>
            <p>Username: {user.username}</p>
            <p>Phone Number: {user.phonenumber}</p>
            <p>Role: {user.role}</p>
            <div className="flex justify-between mt-4">
              <button onClick={() => handleViewUser(user)} className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
                <RiEyeLine className="mr-1" /> View
              </button>
              <button onClick={() => handleDeleteUser(user._id)} className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none">
                <RiDeleteBinLine className="mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Modal for viewing user details */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-xl font-bold mb-2">User Details</h3>
                <p>Name: {selectedUser.firstname} {selectedUser.lastname}</p>
                <p>Email: {selectedUser.email}</p>
                <p>Username: {selectedUser.username}</p>
                <p>Phone Number: {selectedUser.phonenumber}</p>
                <p>Role: {selectedUser.role}</p>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button onClick={() => setShowModal(false)} className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Client;
