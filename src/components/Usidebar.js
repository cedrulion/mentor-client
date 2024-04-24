// Sidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaPaw, FaUser, FaSignOutAlt, FaCogs } from 'react-icons/fa';

const Usidebar = ({ onClose }) => {
  const navigate = useNavigate();

  const handleItemClick = (path) => {
   
    navigate(path);
  };

  return (
    <div className="fixed h-full w-1/4 bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 ">
      <div className="flex justify-between items-center mb-6">
        <FaPaw className="text-9xl" />
        <h1 className="text-6xl">PCS</h1>
        <FaTimes onClick={onClose} className="cursor-pointer text-2xl mt-0" />
      </div>
      <ul className="space-y-20 text-5xl ">
        <li>
          <Link
            to="/udashboard/profile"
            onClick={() => handleItemClick('/udashboard/profile')}
            className="flex items-center space-x-2"
          >
            <FaUser />
            Profile
          </Link>
        </li>
        <li>
          <Link
            to="/udashboard/services"
            onClick={() => handleItemClick('/udashboard/services')}
            className="flex items-center space-x-2"
          >
            <FaCogs />
            Services
          </Link>
        </li>
        <li>
          <Link
            to="/udashboard/PetsPage"
            onClick={() => handleItemClick('/udashboard/PetsPage')}
            className="flex items-center space-x-2"
          >
            <FaCogs />
            PETS
          </Link>
          </li>
          <li>
          <Link to="/udashboard/account" className="flex items-center space-x-2">
          <FaUser />
          Account
        </Link>
        </li>
      </ul>
      <div className="mt-9 space-y-60 text-3xl">
        
        <Link to="/signout" className="flex items-center space-x-2 ">
          <FaSignOutAlt />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Usidebar;

