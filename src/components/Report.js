import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { AiOutlineDownload } from 'react-icons/ai';
import { FaPaw, FaUser, FaRegCalendarAlt, FaDog, FaTools } from 'react-icons/fa'; // Import icons

function Report() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsResponse = await axios.get('http://localhost:5000/api/appointment', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(appointmentsResponse.data);

        const usersResponse = await axios.get('http://localhost:5000/api/users/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data.data.allUsers);

        const petsResponse = await axios.get('http://localhost:5000/api/pets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPets(petsResponse.data);

        const servicesResponse = await axios.get('http://localhost:5000/api/service', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(servicesResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Set font and font size for the title
    doc.setFont('helvetica');
    doc.setFontSize(20); // Larger font size for title
    doc.setTextColor(0, 0, 255); // Blue color
    doc.text('Report', 10, 10);
    
    // Set font and font size for the content
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black color
  
    // Helper function to apply styling to specific text
    const applyStyling = (text, x, y) => {
      doc.setFontSize(16); // Larger font size for titles
      doc.setTextColor(255, 165, 0); // Orange color
      doc.text(text, x, y);
      doc.setFontSize(14); // Reset font size
      doc.setTextColor(0, 0, 0); // Reset color to black
    };
  
    // Apply styling to the desired text
    applyStyling('Number of staff members:', 10, 30);
    doc.text(`${staffMembers.length}`, 10, 40); // Text for staff members count
    
    applyStyling('Number of appointments scheduled:', 10, 50);
    doc.text(`${appointments.length}`, 10, 60); // Text for appointments count
    
    applyStyling('Number of users in the system:', 10, 70);
    doc.text(`${users.length}`, 10, 80); // Text for users count
    
    applyStyling('Number of pets:', 10, 90);
    doc.text(`${pets.length}`, 10, 100); // Text for pets count
    
    applyStyling('Number of services:', 10, 110);
    doc.text(`${services.length}`, 10, 120); // Text for services count
  
    doc.save('report.pdf');
  };
  
  

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto text-center">
      <div className="mt-8 mb-4">
        <h1 className="text-3xl font-bold mt-2">Pets Care System</h1>
        <p className="text-lg italic">Your trusted partner in pet care</p>
      </div>
      <div className="bg-gray-200 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pets care system Report</h2>
        <div className="flex items-center justify-center mb-4">
          <FaPaw className="text-4xl mr-2" />
          <p className="text-lg">Date: <u>{new Date().toLocaleDateString()}</u></p>
        </div>
        <div className="mt-4 text-left">
          <p className="mb-2">
            <FaUser className="inline-block mr-2" />
            Number of staff members: {staffMembers.length}
          </p>
          <p className="mb-2">
            <FaRegCalendarAlt className="inline-block mr-2" />
            Number of appointments scheduled: {appointments.length}
          </p>
          <p className="mb-2">
            <FaUser className="inline-block mr-2" />
            Number of users in the system: {users.length}
          </p>
          <p className="mb-2">
            <FaDog className="inline-block mr-2" />
            Number of pets: {pets.length}
          </p>
          <p className="mb-2">
            <FaTools className="inline-block mr-2" />
            Number of services: {services.length}
          </p>
        </div>
      </div>
      <button onClick={handleDownload} className="bg-blue-500 text-white px-4 py-2 rounded">
        <AiOutlineDownload className="inline-block mr-2" />
        Download Report
      </button>
    </div>
  );
}

export default Report;
