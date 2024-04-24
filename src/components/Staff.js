import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa';

const Staff = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    phonenumber: '',
    email: '',
    password: '',
    role: 'nutrition_specialist', // Setting a default role value
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // State to track user to delete
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

    if (formData.role !== 'user') {
      fetchAllUsers();
    } else {
      setLoading(false);
    }
  }, [token, formData.role]);

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData({
      firstname: '',
      lastname: '',
      username: '',
      phonenumber: '',
      email: '',
      password: '',
      role: 'nutrition_specialist', // Setting a default role value when modal is closed
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data.data.allUsers);

      handleModalClose();
    } catch (error) {
      console.error('Error creating staff:', error);
    }
  };

  const handleDelete = async (userId) => {
    setConfirmDeleteId(userId); // Set the ID of the user to delete
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter(user => user._id !== confirmDeleteId));
      setConfirmDeleteId(null); // Reset the confirmation state after successful deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null); // Reset the confirmation state if the user cancels deletion
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto mt-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Staff Members</h2>
        {formData.role !== 'user' && (
          <button
            onClick={handleCreate}
            className="flex items-center bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none"
          >
            <FaPlus className="mr-2" />
            <span>Create New Staff</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.filter((user) => user.role !== 'user' && user.role !== 'administrator').map((user) => (
          <div key={user._id} className="bg-white rounded-md shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{user.firstname} {user.lastname}</h3>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
              <p className="text-sm text-gray-600">Username: {user.username}</p>
              <p className="text-sm text-gray-600">Phone Number: {user.phonenumber}</p>
              <p className="text-sm text-gray-600">Role: {user.role}</p>
              <button onClick={() => handleDelete(user._id)} className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none">
  <FaTrash className="mr-1" /> Delete
</button>

            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white rounded-md shadow-md overflow-hidden max-w-lg w-full">
          <form onSubmit={handleFormSubmit}>
            <div className="p-6">
            <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={formData.firstname}
                      onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={formData.lastname}
                      onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phonenumber">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phonenumber"
                      name="phonenumber"
                      value={formData.phonenumber}
                      onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="" disabled>Select Role</option>
                      <option value="nutrition_specialist">Nutrition Specialist</option>
                      <option value="vaccination_technician">Vaccination Technician</option>
                      <option value="groomer">Groomer</option>
                      <option value="boarding_attendant">Boarding Attendant</option>
                      <option value="daycare_assistant">Daycare Assistant</option>
                      <option value="veterinary_nurse">Veterinary Nurse</option>
                    </select>
                  </div>
            </div>
            <div className="px-6 py-4 bg-gray-100 flex justify-end">
              <button
                onClick={handleModalClose}
                className="text-gray-600 mr-4 hover:text-gray-800 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  
      

      {/* Confirmation modal for deletion */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-md shadow-md overflow-hidden max-w-lg w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Are you sure you want to delete this staff member?</h3>
              <div className="flex justify-end">
                <button onClick={cancelDelete} className="text-gray-600 mr-4 hover:text-gray-800 focus:outline-none">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
