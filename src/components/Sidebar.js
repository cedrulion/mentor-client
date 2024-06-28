import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaComments, FaBookmark, FaHome, FaRegHandshake } from 'react-icons/fa';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faUser } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const token = localStorage.getItem('Token');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/detail/getdetail', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetail(response.data);
        setUserRole(response.data?.role); // Assuming role is accessible in response data
      } catch (error) {
        console.error('Error fetching user detail:', error);
      }
    };

    fetchUserDetail();
  }, [token]);

  const handleItemClick = (path) => {
    navigate(path);
    onClose();
  };

  const renderMenuItems = () => {
    if (userRole === 'mentor') {
      return (
        <>
          <li className="p-3 hover:bg-gray-700 hover:text-white">
            <Link
              to="/dashboard/profilee"
              onClick={() => handleItemClick('/dashboard/profilee')}
              className="flex items-center space-x-2"
            >
              <FaHome className="text-xl" />
              <span className="text-lg">Profile</span>
            </Link>
          </li>
          <li className="p-5  hover:bg-gradient-to-r from-orange-500 to-violet-900 hover:text-gray-950">
            <Link
              to="/dashboard/requests"
              onClick={() => handleItemClick('/dashboard/requests')}
              className="flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faUserGroup} size="lg" className="fill-current text-xl " />
              <span className="text-lg">Requested learner</span>
            </Link>
          </li>
          <li className="p-5 hover:bg-gradient-to-r from-orange-500 to-violet-900 hover:text-gray-950">
            <Link
              to="/dashboard/chat"
              onClick={() => handleItemClick('/dashboard/chat')}
              className="flex items-center space-x-2"
            >
              <FaComments className="text-xl" />
              <span className="text-lg">Messages</span>
            </Link>
          </li>
          <li className="p-5  hover:bg-gradient-to-r from-orange-500 to-violet-900 hover:text-gray-950">
            <Link
              to="/dashboard/resource"
              onClick={() => handleItemClick('/dashboard/resource')}
              className="flex items-center space-x-2"
            >
              <FaBookmark className="text-xl" />
               <span className="text-lg">Forum</span>
            </Link>
          </li>
          <li className="pt-12  hover:bg-gradient-to-r from-orange-500 to-violet-900 hover:text-gray-950">
            <Link
              to="/signin"
              onClick={() => handleItemClick('/signin')}
              className="flex items-center space-x-2"
            >
              <span className="text-lg">Logout</span>
            </Link>
          </li>
        </>
      );
    } else if (userRole === 'learner') {
      return (
        <>
          <li className="p-3 hover:bg-gradient-to-r from-orange-500 to-violet-900 hover:text-gray-950">
            <Link
              to="/dashboard/profile"
              onClick={() => handleItemClick('/dashboard/profile')}
              className="flex items-center space-x-2"
            >
              <FaHome className="text-xl" />
              <span className="text-lg">Profile</span>
            </Link>
          </li>
          <li className="p-3 hover:bg-gradient-to-r from-orange-500 to-violet-900 hover:text-gray-950">
  <Link
    to="/dashboard/matching"
    onClick={() => handleItemClick('/dashboard/matching')}
    className="flex items-center space-x-2"
  >
    <FaRegHandshake className="text-xl" />
    <span className="text-lg">Matching</span>
  </Link>
</li>

          <li className="p-3  hover:bg-gradient-to-r from-orange-500 to-violet-900 hover:text-gray-950">
            <Link
              to="/dashboard/uresource"
              onClick={() => handleItemClick('/dashboard/uresource')}
              className="flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faUserGroup} size="lg" className=" text-xl " />
              <span className="text-lg">Forum</span>
            </Link>
          </li>
          <li className="p-3  hover:bg-gradient-to-r from-orange-500 to-violet-900 hover:text-gray-950">
            <Link
              to="/dashboard/status"
              onClick={() => handleItemClick('/dashboard/status')}
              className="flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faUserGroup} size="lg" className=" text-xl " />
              <span className="text-lg">View Requests</span>
            </Link>
          </li>
          <li className="p-3  hover:bg-gradient-to-r from-orange-500 to-violet-900 hover:text-gray-950">
            <Link
              to="/dashboard/track"
              onClick={() => handleItemClick('/dashboard/track')}
              className="flex items-center space-x-2"
            >
              <FaBookmark className="text-3xl" />
              <span className="text-lg">Tracking</span>
            </Link>
          </li>
<li className="p-3 hover:bg-gradient-to-r from-orange-500 to-violet-900 hover:text-gray-950">
            <Link
              to="/dashboard/chato"
              onClick={() => handleItemClick('/dashboard/chato')}
              className="flex items-center space-x-2"
            >
              <FaComments className="text-xl" />
              <span className="text-lg">Messages</span>
            </Link>
          </li>
          <li className="pt-12  hover:text-gray-950">
            <Link
              to="/signin"
              onClick={() => handleItemClick('/signin')}
              className="flex items-center space-x-2"
            >
              <span className="text-lg">Logout</span>
            </Link>
          </li>
        </>
      );
    } else {
      // Default case when userRole is not fetched or is empty
      return (
        <>
     <p className="text-lg font-semibold mb-9"> Admin Panel </p>
          <li className="pt-9 hover:bg-gradient-to-r from-orange-500 to-violet-900 hover:text-white">
            <Link
              to="/dashboard/usermanagement"
              onClick={() => handleItemClick('/dashboard/usermanagement')}
              className="flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faUser} size="lg" className=" text-xl " />
              <span className="text-lg">User Management</span>
            </Link>
            </li>
<li className="pt-9 hover:bg-gradient-to-r from-orange-500 to-violet-900 hover:text-white">
            <Link
              to="/dashboard/uploads"
              onClick={() => handleItemClick('/dashboard/uploads')}
              className="flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faUser} size="lg" className=" text-xl " />
              <span className="text-lg">Content Management</span>
            </Link>
          </li>
<li className="pt-12   hover:text-gray-950">
            <Link
              to="/signin"
              onClick={() => handleItemClick('/signin')}
              className="flex items-center space-x-2"
            >
              <span className="text-lg">Logout</span>
            </Link>
          </li>
        </>
      );
    }
  };

  return (
    <div className="font-poppins fixed top-0 bottom-0 left-0 w-56 bg-gradient-to-r from-orange-500 to-violet-900 text-white text-center">
      <div className="">
        {userDetail && <p className="text-lg font-semibold mb-4">{userDetail.firstName} {userDetail.lastName}</p>}
        <ul className="space-y-1 pt-28 flex justify-center items-center flex-col">{renderMenuItems()}</ul>
      </div>
    </div>
  );
};

export default Sidebar;
