import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import LOGO from "../Assets/LOGO.png";

const Profile = () => {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('Token');
  const currentDate = new Date();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/detail/getdetail', {
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

  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  };

  const formattedDate = currentDate.toLocaleString('en-US', options);

  return (
    <div className="h-screen items-center justify-center ">
      <div className="hidden sticky top-0 z-10 md:flex justify-between shadow-lg pt-3 bg-gray-950">
        <div className="flex justify-between">
          <img src={LOGO} alt="logo" className="h-14" />
          <h1 className="text-white font-Roboto text-xl">National Women's Council</h1>
        </div>
        <input
          type="text"
          placeholder="Search"
          className="text-white p-2 rounded-md bg-gray-950"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className='h-screen container flex justify-between'>
      <div className=" flex-1 ">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome Back</h3>
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiUser className="text-white bg-white rounded-full mr-2" />
                <p className="text-sm font-medium">Olivier </p>
                <p className="text-xs text-blue-500">3 minutes ago</p>
              </div>
              
            </div>
            <div className='border-b border-gray-400' >
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem voluptate tenetur quasi officia velit enim ducimus aspernatur delectus cupiditate recusandae accusamus, commodi esse illo, ipsam libero necessitatibus quae repudiandae culpa.</p>
              <p className="text-blue-500">Description with hashtags here</p>
            </div>
          </div>
      <div className="">
        <div className="min-h-screen bg-gray-600 rounded bg-opacity-20">
          <p className="pb-6 text-lg bg-gradient-to-r from-violet-800 to-orange-600  py-3 px-3 mx-3 rounded-lg text-white">
            {formattedDate}
          </p>
          <h2 className="text-3xl font-semibold text-center text-gray-800">Profile</h2>
          {userDetail ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
              <div className="flex cursor-pointer">
                <FiUser className="text-gray-900 rounded-lg text-6xl text-center" />
              </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center cursor-pointer">
                  <FiUser className="text-gray-600 mr-2" />
                  <p className="text-lg font-medium">First Name</p>
                  <p className="text-lg font-medium ml-8">{userDetail.firstName}</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center cursor-pointer">
                  <FiUser className="text-gray-600 mr-2" />
                  <p className="text-lg font-medium">Last Name</p>
                  <p className="text-lg font-medium ml-8">{userDetail.lastName}</p>
                </div>
              </div>
              {/* Add other profile details similarly */}
            </div>
          ) : (
            <p className="text-lg text-center ">Profile not found</p>
          )}
          <div className="flex justify-center mt-4">
            <Link to="/edit-profile" className="bg-gradient-to-r from-violet-800 to-orange-600 text-white font-bold py-2 px-4 rounded">
              Edit Profile
            </Link>
          </div>
          <div className='m-9 '>
          <p className='p-6 font-serif font-semibold'>Messages</p>
          <button className='px-6 text-white bg-violet-900 font-serif font-semibold'>View All</button>
          </div>
          
        </div>
      </div>
     
    </div>
    </div>
  );
};

export default Profile;
