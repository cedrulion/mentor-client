import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Forum from './Forum';
import Modal from './Modal';
import { FaArrowRight } from 'react-icons/fa';

function Uresource() {
  const [resources, setResources] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [selectedResource, setSelectedResource] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [filterType]);

  const fetchResources = async () => {
    try {
      const response = await Axios.get('https://mentor-server-qd42.onrender.com/api/resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleLearnMore = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderResource = (resource) => {
    if (resource.type === 'Video') {
      return (
        <div>
          <video controls width="400">
              <source src={`https://mentor-server-qd42.onrender.com${resource.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (resource.type === 'Article') {
      return (
        <a href={`https://mentor-server-qd42.onrender.com${resource.articleUrl}`} target="_blank" rel="noopener noreferrer">
          Read Article
        </a>
      );
}
 else if (resource.type === 'Module') {
      return (
        <a href={`https://mentor-server-qd42.onrender.com${resource.moduleUrl}`} target="_blank" rel="noopener noreferrer">
          Read Article
        </a>
      );
    } else if (resource.type === 'Webinar') {
      return (
        <div>
            {resource.webinarUrl} 
          </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Forum />
      <div className='min-h-screen bg-gradient-to-r from-slate-400 to-orange-200 shadow-lg ml-5'>
        <div className='container mx-auto py-2'>
          <p className='text-center text-xl m-2'>
            Explore the wealth of information, tools, and insights curated to enhance your skills, knowledge, and career development
          </p>
          <div className='flex justify-center gap-8 pt-3 text-xl'>
            <h1 className='py-2 px-2 font-bold'>Content Types</h1>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === '' ? 'font-bold' : ''}`} onClick={() => setFilterType('')}>All</button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Webinar' ? 'font-bold' : ''}`} onClick={() => setFilterType('Webinar')}>Webinar</button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Video' ? 'font-bold' : ''}`} onClick={() => setFilterType('Video')}>Video</button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Module' ? 'font-bold' : ''}`} onClick={() => setFilterType('Module')}>Module</button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Article' ? 'font-bold' : ''}`} onClick={() => setFilterType('Article')}>Articles</button>
          </div>

          <div className='mt-2'>
            <ul className='mt-2 grid grid-cols-3 gap-3'>
              {resources
                .filter(resource => filterType === '' || resource.type === filterType)
                .map((resource) => (
                  <li key={resource._id} className='bg-gray-200 border border-gray-300 rounded-md p-2 mb-2'>
                    <span className='bg-orange-300 text-red-800 rounded-lg p-1'>{resource.type}</span>
                    <p className='font-bold pt-5 text-2xl break-words'>{resource.title}</p>
                    <p className='break-words whitespace-normal'>{resource.description}</p>
                    <p className='break-words whitespace-normal'>{resource.date}</p>
                   
                    <button onClick={() => handleLearnMore(resource)} className='text-red-800 px-3 py-1 mt-2 rounded-md flex items-center'>
                      View More <FaArrowRight className='ml-1' />
                    </button>
                  </li>
                ))}
            </ul>
          </div>
          {selectedResource && (
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              {renderResource(selectedResource)}
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}

export default Uresource;
