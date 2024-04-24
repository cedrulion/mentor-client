import React, { useState, useEffect } from 'react';
import { FaDog, FaShower, FaSyringe, FaUserMd, FaWalking } from 'react-icons/fa';
import axios from 'axios';

const Service2 = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedServices, setExpandedServices] = useState({});

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

  const toggleServiceExpansion = (index) => {
    setExpandedServices({
      ...expandedServices,
      [index]: !expandedServices[index],
    });
  };

  if (loading) {
    return <p>Loading services...</p>;
  }

  return (
    <div className="container mx-auto pt-9">
      <h1 className="text-3xl font-bold text-center my-8">Available Pet Care Services</h1>
      <div className="flex flex-wrap justify-center gap-8">
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
              
              <p className="text-gray-700 mt-2">Price: ${service.price}</p>
              <p className="text-gray-700 mt-2">Duration: {service.duration} minutes</p>
              <p className="text-gray-700 mt-2">Availability: {service.availability}</p>
              <p className="text-gray-700">{expandedServices[index] ? service.detail : `${service.detail.substring(0, 100)}...`} 
                <span className="text-blue-500 cursor-pointer" onClick={() => toggleServiceExpansion(index)}>
                  {expandedServices[index] ? " Read less" : " Read more"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service2;
