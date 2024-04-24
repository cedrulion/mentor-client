import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Forum from './Forum';
import Modal from './Modal';
import { FaArrowRight } from 'react-icons/fa';

function Uresource() {
  const [resources, setResources] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [selectedResource, setSelectedResource] = useState(null); // New state for selected resource
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [filterType]);

  const fetchResources = async () => {
    try {
      const response = await Axios.get('http://localhost:5000/api/resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleLearnMore = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true); // Open the modal when learning more about a resource
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderResource = (resource) => {
    if (resource.type === 'Video') {
      return (
        <video controls className="max-w-full h-auto">
          <source src={resource.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (resource.type === 'Article') {
      return (
        <iframe
          src={resource.articleUrl}
          title={resource.title}
          className="max-w-full h-screen"
        ></iframe>
      );
    } else {
      return <p>No preview available for this resource type.</p>;
    }
  };

  return (
    <div>
      <Forum />
      <div className='min-h-screen bg-gradient-to-r from-slate-400 to-orange-200 shadow-lg'>
        <div className='container mx-auto py-8'>
          <p className='text-center text-xl m-9'>Explore the wealth of information, tools, and insights curated to enhance your skills, knowledge, and career development</p>
          <div className='flex justify-center gap-8 pt-6 text-2xl'>
            <h1 className='py-2 px-4 font-bold'>Content Types</h1>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === '' ? 'font-bold' : ''}`} onClick={() => setFilterType('')}>All</button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Webinar' ? 'font-bold' : ''}`} onClick={() => setFilterType('Webinar')}>Webinar</button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Video' ? 'font-bold' : ''}`} onClick={() => setFilterType('Video')}>Video</button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Module' ? 'font-bold' : ''}`} onClick={() => setFilterType('Module')}>Module</button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Article' ? 'font-bold' : ''}`} onClick={() => setFilterType('Article')}>Articles</button>
          </div>

          <div className='mt-8'>
            <ul className='mt-4 grid grid-cols-3 gap-5'>
              {resources
                .filter(resource => filterType === '' || resource.type === filterType) // Filter based on selected filterType
                .map((resource) => (
                  <li key={resource._id} className='bg-gray-200 border border-gray-300 rounded-md p-4 mb-4 ml-6'>
                    <span className='bg-orange-300 text-red-800 rounded-lg p-1'>{resource.type}</span>
                    <p className='font-bold font-Interi pt-5 text-2xl'>{resource.title}</p>
                    <p>{resource.description}</p>
                    <button onClick={() => handleLearnMore(resource)} className='text-red-800 px-3 py-1 mt-2 rounded-md flex items-center'>
                      View More <FaArrowRight className='ml-1' />
                    </button>
                  </li>
                ))}
            </ul>
          </div>
          {selectedResource && (
            <Modal isOpen={isModalOpen} onClose={closeModal} resource={selectedResource}>
              {renderResource(selectedResource)}
            </Modal>
              )}
        </div>
      </div>
    </div>
  );
}

export default Uresource;
