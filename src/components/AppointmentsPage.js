import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(3);
  const [userRole, setUserRole] = useState(null);
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

  useEffect(() => {
    // Fetch user data based on the token
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('Token');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserRole(response.data.data.user.role);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Filter appointments based on userRole
 
  // Calculate current appointments to display based on pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const filteredAppointments = currentAppointments.filter(appointment => appointment.serviceId === userRole);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Update appointment function
  const updateAppointment = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/appointment/${appointmentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Assuming the backend returns the updated appointment
      const updatedAppointment = response.data;

      // Update the state with the updated appointment
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === updatedAppointment._id ? updatedAppointment : appointment
        )
      );
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <div className=" mt-28 ml-32 ">
      <h1 className="text-3xl font-bold mb-6">Appointments</h1>

      {filteredAppointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <li key={appointment._id} className="border p-4 rounded">
                <h2 className="text-xl font-bold">{appointment.date} - {appointment.time}</h2>
                <p>Pet: {appointment.petId}</p>
                <p>Service: {appointment.serviceId}</p>
                <p>Status: {appointment.status}</p>

                {/* Button to update appointment status to 'received' */}
                <button
                  onClick={() => updateAppointment(appointment._id, 'received')}
                  className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                >
                  Update to Received
                </button>

                {/* Button to update appointment status to 'approved' */}
                <button
                  onClick={() => updateAppointment(appointment._id, 'approved')}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2 ml-2"
                >
                  Update to Approved
                </button>
              </li>
            ))}
          </ul>

          {/* Pagination buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastAppointment >= appointments.length}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
