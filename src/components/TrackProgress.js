import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const TrackProgress = () => {
  const [status, setStatus] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/requests', {
          headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
        });
        setStatus(response.data);
        processChartData(response.data);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();
  }, []);

  const processChartData = (statusData) => {
    if (!Array.isArray(statusData)) {
      // Handle single value case
      const singleObject = {
        classTime: new Date().toISOString(), // Example date
        status: statusData,
        learnerFirstName: '', // Example learner name
        classType: '', // Example class type
        // Add other properties as needed
      };
  
      setChartData({ labels: ['Today'], datasets: [{ data: [1] }] }); // Example chart data
      setStatus([singleObject]); // Update status with the single object
      return;
    }
  
    // Rest of your processing code for array data
    const labels = statusData.map((item) => item.classTime.slice(0, 10)); // Extracting only the date part
    const uniqueLabels = [...new Set(labels)]; // Removing duplicate dates
  
    const data = {
      labels: uniqueLabels,
      datasets: [
        {
          label: 'Status',
          data: uniqueLabels.map((date) =>
            statusData.filter((item) => item.classTime.slice(0, 10) === date).length
          ),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  
    setChartData(data);
  };
  

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold">Track Progress</h1>
      <div className="w-full max-w-xl">
        <Line data={chartData} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {status && status.length > 0 ? (
          status.map((item, index) => (
            <div key={index} className="bg-gray-200 p-4 rounded-md">
              <p className="font-bold">{item.learnerFirstName}</p>
              <p>Status: {item.status}</p>
              <p>Class Type: {item.classType}</p>
              <p>Class Time: {new Date(item.classTime).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>No status data available</p>
        )}
      </div>
    </div>
  );
};

export default TrackProgress;
