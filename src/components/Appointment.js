import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Appointment = () => {
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [petId, setPetId] = useState('');
  const [services, setServices] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('Token');


  useEffect(() => {
    const fetchServices = async () => {
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

    fetchServices();
  }, [token]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPets(response.data);
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [token]);

  const handleBooking = async () => {
    // Perform validation if needed

    try {
      const response = await axios.post(
        'http://localhost:5000/api/appointment/book',
        {   
         
          serviceId,
          petId,
          date,
          time,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };
 
  if (loading) {
    return <p>Loading...</p>;
  }
  

  return (
    <div className="container mx-auto mt-9">
      <h2 className="text-2xl font-bold mb-4">Appointment Booking Form</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Select Service:</label>
          <select
            className="w-full border p-2"
            onChange={(e) => setServiceId(e.target.value)}
            value={serviceId}
          >
            <option value="" disabled>Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Select Pet:</label>
          <select
            className="w-full border p-2"
            onChange={(e) => setPetId(e.target.value)}
            value={petId}
          >
            <option value="" disabled>Select a pet</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Select Date:</label>
          <input
            type="date"
            className="w-full border p-2"
            onChange={(e) => setDate(e.target.value)}
            value={date}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Select Time:</label>
          <input
            type="time"
            className="w-full border p-2"
            onChange={(e) => setTime(e.target.value)}
            value={time}
          />
        </div>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleBooking}
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default Appointment;
