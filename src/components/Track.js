import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import LOGO from "../Assets/loader.gif";

const Track = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/learner-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching learner requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const data = requests.map((req, index) => ({
    name: `Session ${index + 1}`,
    Attendance: 1, // Each request represents one attendance
  }));

  const attendanceSummary = {
    inperson: requests.filter(req => req.classType === 'inperson').length,
    online: requests.filter(req => req.classType === 'online').length,
    workshops: requests.filter(req => req.classType === 'workshops').length,
    oneonone: requests.filter(req => req.classType === 'oneonone').length,
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><img src={LOGO} alt="logo"  /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 to-orange-200 p-4 text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold">Track Your Progress</h1>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Progress Overview */}
        <div className="p-4 bg-gradient-to-r from-gray-300 to-orange-200 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Hey!</h2>
          <p>You've attended {requests.length} sessions this month.</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="w-20 h-20 relative">
              <div className="w-full h-full rounded-full border-4 border-green-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-semibold">{Math.round((requests.length / (requests.length + 7)) * 100)}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600">7 Absences</p>
              <p className="text-gray-600">{requests.length} Meetings</p>
            </div>
          </div>
        </div>

        {/* Attendance Chart */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Last 30 Days</h2>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Attendance" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Attendance Summary */}
        <div className="p-4 bg-gradient-to-r from-gray-300 to-orange-200 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total number of attendances: {requests.length}</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-4 h-4 bg-orange-500 rounded-full mr-2"></span> In person: {attendanceSummary.inperson}
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span> Online: {attendanceSummary.online}
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span> Workshops: {attendanceSummary.workshops}
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-teal-500 rounded-full mr-2"></span> One-on-One: {attendanceSummary.oneonone}
            </li>
          </ul>
        </div>

        {/* Messages */}
        <div className="p-4 bg-gradient-to-r from-gray-300 to-orange-200 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Messages</h2>
          <ul className="space-y-2">
            {requests.map((req, index) => (
              <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg">
                <div>
                  <p className="font-semibold">{req.learnerFirstName}</p>
                  <p className="text-sm text-gray-600">Class Type: {req.classType}</p>
                </div>
                <span className="text-sm text-gray-500">{new Date(req.classTime).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Track;
