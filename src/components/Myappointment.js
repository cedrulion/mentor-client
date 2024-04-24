import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaClock, FaTag, FaPaw } from 'react-icons/fa';

const Myappointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
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

        // Find the two most recent appointment dates
        const sortedAppointments = response.data
          .map((appointment) => new Date(appointment.date))
          .sort((a, b) => b - a);

        const mostRecentDates = sortedAppointments.slice(0, 2);

        // Set the most recent dates as highlighted
        setHighlightedDates(mostRecentDates);

        // Set the selected date as the most recent date
        setSelectedDate(mostRecentDates[0]);
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
  .filter(appointment => appointment.status !== 'approved')
  .slice(indexOfFirstAppointment, indexOfLastAppointment);

  return (
    <div className="bg-white mt-9 pl-9 rounded-md shadow-md flex">
      <div className="w-1/4 p-4">
        <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
        <ul className="list-none ">
          {currentAppointments.map((appointment) => (
            <li key={appointment._id} className="mb-4 p-2 bg-gray-100 rounded-md">
              <div className="grid grid-cols-3 gap-4">
                <p className="mb-2">
                  <FaClock className="mr-2" /> Time: {appointment.time}
                </p>
                <p className="mb-2">
                          <FaClock className="mr-2" /> Time: {appointment.date}
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
        <div className="flex justify-between mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-500 rounded-md"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastAppointment >= appointments.length}
            className="px-4 py-2 bg-gray-500 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
      <div className="w-3/4 p-4">
        <h1 className="text-2xl font-bold mb-4">Upcoming Appointments</h1>
        <div className="flex">
          <div className="mr-4">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={({ date }) =>
                highlightedDates.some(highlightedDate =>
                  date.toISOString().slice(0, 10) === highlightedDate.toISOString().slice(0, 10)
                )
                  ? 'bg-green-400 text-gray-800 rounded-full p-2'
                  : ''
              }
            />
          </div>
          {selectedDate && (
  <div>
    <h2 className="text-xl mb-4">Appointments on {selectedDate.toLocaleDateString()}</h2>
    <ul className="list-none">
      {appointments
        .filter(
          (appointment) =>
            new Date(appointment.date).toISOString().slice(0, 10) ===
            selectedDate.toISOString().slice(0, 10)
        )
        .map((appointment) => (
          <li key={appointment._id} className="mb-4 p-4 bg-gray-100 rounded-md">
            <div className="flex flex-col">
              <p className="mb-2">
                <FaClock className="mr-2" /> Time: {appointment.time}
              </p>
              <p className="mb-2">
                <FaTag className="mr-2" /> Service: {appointment.serviceId}
              </p>
              <p className="mb-2">
                <FaPaw className="mr-2" /> Pet: {appointment.petId}
              </p>
            </div>
          </li>
        ))}
    </ul>
  </div>
)}
       
        </div>
      </div>
    </div>
  );
};

export default Myappointment;
