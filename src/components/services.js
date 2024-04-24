import React, { useState, useEffect } from 'react';
import { FaDog, FaShower, FaSyringe, FaUserMd, FaWalking } from 'react-icons/fa';
import axios from 'axios';

const Service2 = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', detail: '', servicefee: '', staff: '' });
  const [staffMembers, setStaffMembers] = useState([]);
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/service', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaffMembers(response.data.data.allUsers);
      } catch (error) {
        console.error('Error fetching staff members:', error);
      }
    };

    fetchStaffMembers();
  }, [token]);

  const handleCreate = async () => {
    try {
      // Show modal for data input
      setShowModal(true);
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleModalClose = () => {
    // Close the modal and reset form data
    setShowModal(false);
    setFormData({ name: '', detail: '', servicefee: '', staff: '' });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make the API request to create a new service
      const response = await axios.post(
        'http://localhost:5000/api/service/create',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the services state with the new service
      setServices((prevServices) => [...prevServices, response.data]);

      // Close the modal and reset form data
      handleModalClose();
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await axios.delete(`http://localhost:5000/api/service/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the services state by filtering out the deleted service
      setServices((prevServices) => prevServices.filter((service) => service._id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  if (loading) {
    return <p>Loading services...</p>;
  }

  return (
    <div className='pt-9'>
    <div className="flex flex-wrap justify-center gap-8 mt-9 ml-20">
      {services.map((service, index) => (
        <div
          key={index}
          className="max-w-sm rounded-md overflow-hidden shadow-lg transition-transform transform hover:scale-105"
        >
          <div className="bg-gray-200 p-2 flex items-center justify-center text-3xl">
            {service.name === 'groomer' && <FaDog />}
            {service.name === 'boarding' && <FaShower />}
            {service.name === 'Vaccine' && <FaSyringe />}
            {service.name === 'Consultation' && <FaUserMd />}
            {service.name === 'Walking' && <FaWalking />}
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{service.name}</h3>
            <p className="text-gray-700">{service.detail}</p>
            <button
              onClick={() => handleDelete(service._id)}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Modal for creating a new service */}
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal Content */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleFormSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="name"
                      type="text"
                      placeholder="Service Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="detail">
                      Detail
                    </label>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="detail"
                      placeholder="Service Detail"
                      value={formData.detail}
                      onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="servicefee">
                      Service Fee
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="servicefee"
                      type="text"
                      placeholder="Service Fee"
                      value={formData.servicefee}
                      onChange={(e) => setFormData({ ...formData, servicefee: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="staff">
                      Staff
                    </label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="staff"
                      value={formData.staff}
                      onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                      required
                    >
                      <option value="">Select Staff</option>
                      {staffMembers.filter(user => !["administrator", "user"].includes(user.role)).map((user) => (
                        <option key={user._id} value={user.role}>
                          {user.role} 
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Create
                  </button>
                  <button
                    onClick={handleModalClose}
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
    <div className="max-w-sm flex justify-center items-center rounded-md overflow-hidden shadow-lg transition-transform transform hover:scale-105">
        <div
          onClick={handleCreate}
          className="bg-green-200 p-4 flex items-center justify-center text-5xl cursor-pointer"
        >
          <span role="img" aria-label="Create">
            ➕
          </span>
        </div>
        <div className="p-4 ">
          <h3 className="text-xl font-bold mb-2">Create New Service</h3>
          <p className="text-gray-700">Click to create a new service</p>
        </div>
      </div>
    </div>
  );
};

export default Service2;
