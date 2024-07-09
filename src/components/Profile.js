import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser } from 'react-icons/fi';
import Modal from 'react-modal';
import LOGO from "../Assets/LOGO.png";
import './Profile.css';
import LOG from "../Assets/loading.gif";

Modal.setAppElement('#root');

const Profile = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userDetail, setUserDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newSkill, setNewSkill] = useState({
    sname: '',
    description: '',
  });
  const token = localStorage.getItem('Token');
  const currentDate = new Date();
  const navigate = useNavigate();

  const fetchUserSkills = async () => {
    try {
      const response = await axios.get(`https://mentor-server-qd42.onrender.com/api/skill/${userDetail?.user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching user Skills:', error);
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
      fetchUserSkills();
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
    setNewSkill((prevSkill) => ({
      ...prevSkill,
      [name]: value,
    }));
  };

  const handleAddSkill = async () => {
    try {
      await axios.post('https://mentor-server-qd42.onrender.com/api/skill', {
        userId: userDetail?.user,
        sname: newSkill.sname,
        description: newSkill.description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUserSkills();
      handleCloseModal();
    } catch (error) {
      console.error('Error adding Skill:', error);
    }
  };

  const handleEditSkill = async (skillId, updatedSkill) => {
    try {
      await axios.put(`https://mentor-server-qd42.onrender.com/api/skill/${skillId}`, updatedSkill, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUserSkills();
    } catch (error) {
      console.error('Error editing Skill:', error);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await axios.delete(`https://mentor-server-qd42.onrender.com/api/skill/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUserSkills();
    } catch (error) {
      console.error('Error deleting Skill:', error);
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
        <div className="min-h-screen bg-gradient-to-r from-gray-300 to-orange-200 flex items-center justify-center">
          <img src={LOG} alt="logo" />
        </div>
      ) : (
        <div className="min-h-screen items-center justify-center ml-7 bg-gradient-to-r from-gray-300 to-orange-200">
        

          <div className="flex justify-between">
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
                  <Link to='dashboard/chato' onClick={() => handleItemClick('/dashboard/chato')}>
                    <button className='px-6 text-white bg-violet-900 font-serif font-semibold'>View All</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} className="modal">
        <h2 className="text-3xl font-semibold text-center text-gray-800 pt-8 font-mono">Skills</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <ul>
              {skills.map((skill) => (
                <li key={skill._id} className="flex justify-between bg-slate-200 p-4 m-5 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold">{skill.sname}</h3>
                    <p className="text-gray-600">{skill.description}</p>
                  </div>
                  <div>
                    <button onClick={() => handleEditSkill(skill._id, { sname: skill.sname, description: skill.description })} className="bg-blue-500 text-white p-1 rounded mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteSkill(skill._id)} className="bg-red-500 text-white p-1 rounded">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <form className="flex flex-col items-center space-y-2 ">
          <input
            type="text"
            name="sname"
            placeholder="Skill name"
            value={newSkill.sname}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newSkill.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
         
          <button type="button" onClick={handleAddSkill} className="bg-blue-500 text-white py-2 px-4 rounded-lg">
            Add Skill
          </button>
        </form>
          </div>
        )}
        <button onClick={handleCloseModal} className="absolute top-2 right-2 text-xl text-white bg-gray-800 p-2 rounded-full">X</button>
      </Modal>
    </>
  );
};

export default Profile;
