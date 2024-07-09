import React, { useState, useEffect } from 'react';
import { Link,useNavigate} from 'react-router-dom';
import axios from 'axios';
import { FiUser } from 'react-icons/fi';
import Modal from 'react-modal';
import LOGO from "../Assets/LOGO.png";
import './Profile.css';
import LOG from "../Assets/loading.gif";

Modal.setAppElement('#root');

const Profilee = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userDetail, setUserDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newExperience, setNewExperience] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const token = localStorage.getItem('Token');
  const currentDate = new Date();
  const navigate = useNavigate();

  const fetchUserExperiences = async () => {
    try {
      const response = await axios.get(`https://mentor-server-qd42.onrender.com/api/experience/${userDetail?.user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExperiences(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching user experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://mentor-server-qd42.onrender.com/api/resources', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data.reverse());
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await axios.get('https://mentor-server-qd42.onrender.com/api/detail/getdetail', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserDetail(response.data);
      } catch (error) {
        console.error('Error fetching user detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [token]);

  useEffect(() => {
    if (userDetail) {
      fetchUserExperiences();
      fetchPosts();
    }
  }, [userDetail, token]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleItemClick = (path) => {
    navigate(path);
    onClose();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExperience((prevExperience) => ({
      ...prevExperience,
      [name]: value,
    }));
  };

  const handleAddExperience = async () => {
    try {
      await axios.post('https://mentor-server-qd42.onrender.com/api/experience', {
        userId: userDetail?.user,
        ...newExperience,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUserExperiences();
      handleCloseModal();
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  const handleEditExperience = async (experienceId, updatedExperience) => {
    try {
      await axios.put(`https://mentor-server-qd42.onrender.com/api/experience/${experienceId}`, updatedExperience, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUserExperiences();
    } catch (error) {
      console.error('Error editing experience:', error);
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    try {
      await axios.delete(`https://mentor-server-qd42.onrender.com/api/experience/${experienceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUserExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

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
    <>
      {loading ? (
        
       <div className="min-h-screen  bg-gradient-to-r from-gray-300 to-orange-200 flex items-center justify-center"><img src={LOG} alt="logo"  /></div>
      
      ) : (
        <div className="min-h-screen items-center justify-center ml-7 bg-gradient-to-r from-gray-300 to-orange-200">
          
          <div className='flex justify-between'>
            <div className="flex-1 p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 pt-9">Welcome Back</h3>
              {posts.map((post, index) => (
                <div key={index} className="mb-4 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-white bg-white rounded-full mr-2" />
                      <p className="text-sm font-medium">{post.title}</p>
                      <p className="text-xs text-blue-500">{new Date(post.date).toLocaleTimeString()} ago</p>
                    </div>
                  </div>
                  <div className='border-b border-gray-400'>
                   
                    <p>{post.description}</p>
                    <p className="text-blue-500">{post.type}</p>

                  </div>
                </div>
              ))}
            </div>
            <div className="">
              <div className="min-h-screen bg-gray-600 rounded bg-opacity-20">
                <p className="pb-6 text-lg bg-gradient-to-r from-violet-800 to-orange-600 py-3 px-3 mx-3 rounded-lg text-white">
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
                  </div>
                ) : (
                  <p className="text-lg text-center ">Profile not found</p>
                )}
                <div className="flex justify-center mt-4">
                  <button onClick={handleOpenModal} className="bg-gradient-to-r from-violet-800 to-orange-600 text-white font-bold py-2 px-4 rounded">
                   + Edit Profile
                  </button>
                </div>
                <div className='m-9'>
                  <p className='p-6 font-serif font-semibold'>Messages</p>
                <Link to='dashboard/chato'  onClick={() => handleItemClick('/dashboard/chato')}>  <button className='px-6 text-white bg-violet-900 font-serif font-semibold'>View All</button></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} className="modal">
        <h2 className="text-3xl font-semibold text-center text-gray-800 pt-8 font-mono">Experiences</h2>
        {loading ? (
          <p>Loading experiences...</p>
        ) : experiences.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 mt-2 font-mono">
            {experiences.map((experience) => (
              <div key={experience._id} className="bg-white p-4 rounded-md shadow">
                <h3 className="text-lg font-semibold">{experience.title}</h3>
                <p className="text-sm text-gray-500">{experience.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(experience.startDate).toLocaleDateString()} -{' '}
                  {new Date(experience.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-center text-gray-800">No experiences found.</p>
        )}
        <h2 className="text-center mb-4 font-mono">Add New Experience</h2>
        <form className="flex flex-col items-center space-y-2 font-mono">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newExperience.title}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newExperience.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={newExperience.startDate}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={newExperience.endDate}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button type="button" onClick={handleAddExperience} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
            Add Experience
          </button>
        </form>
        <button onClick={handleCloseModal} className="bg-red-500 text-white py-2 px-4 mt-2 rounded-lg">
          Cancel
        </button>
      </Modal>
    </>
  );
};

export default Profilee;
