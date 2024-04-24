import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClock, FaTag, FaPaw } from 'react-icons/fa';

const Appointmentlist = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 2; // You can adjust this number based on your preference
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointment', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [token]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments
    .filter(appointment => appointment.status === 'approved')
    .slice(indexOfFirstAppointment, indexOfLastAppointment);

  return (
    <div className="bg-white mt-9 pl-24 rounded-md shadow-md flex items-center justify-center">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
        {currentAppointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <ul className="list-none">
            {currentAppointments.map((appointment) => (
              <li key={appointment._id} className="mb-4 p-4 bg-gray-100 rounded-md">
                <div className="flex flex-col">
                  <p className="mb-2">
                    <FaClock className="mr-2" /> Time: {appointment.time}
                  </p>
                  <p className="mb-2">
                    <FaClock className="mr-2" /> Date: {appointment.date}
                  </p>
                  <p className="mb-2">
                    <FaTag className="mr-2" /> Service: {appointment.serviceId}
                  </p>
                  <p className="mb-2">
                    <FaPaw className="mr-2" /> Pet: {appointment.petId}
                  </p>
                  <p className="mb-2">
                    <FaPaw className="mr-2" /> Status: {appointment.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastAppointment >= appointments.length}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appointmentlist;
