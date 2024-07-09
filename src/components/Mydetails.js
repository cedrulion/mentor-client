import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

const Mydetails = () => {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get('https://mentor-server-qd42.onrender.com/api/detail/getdetail', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetail(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user detail:', error);
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [token]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Detail</h2>
        <div className="relative">
          <div className="absolute top-0 right-0 mt-2 mr-2">
            <FaSearch className="fill-current w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search user detail"
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8 py-2 pr-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {userDetail ? (
        <div>
          <p>First Name: {userDetail.firstName}</p>
          <p>Last Name: {userDetail.lastName}</p>
          <p>Role: {userDetail.role}</p>
          <p>School: {userDetail.school}</p>
          <p>University: {userDetail.university}</p>
          <p>Study Field: {userDetail.studyField}</p>
          <p>Date of Birth: {userDetail.dob}</p>
          <p>Country: {userDetail.country}</p>
          <p>City: {userDetail.city}</p>
          <p>Street: {userDetail.street}</p>
        </div>
      ) : (
        <p>User detail not found</p>
      )}
    </div>
  );
};

export default Mydetails;
