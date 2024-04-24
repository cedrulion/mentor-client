import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Forum from './Forum';
import Modal from './Modal';

function Resource() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Webinar');
  const [file, setFile] = useState(null);
  const [resources, setResources] = useState([]);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoUrl = '/uploads/1713964835302-891033530.mp4'; 

  useEffect(() => {
    const storedToken = localStorage.getItem('Token');
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      setUserId(decodedToken.userId);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [token, filterType]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await Axios.get('http://localhost:5000/api/resources', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Error fetching resources. Please try again later.');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('file', file);
    formData.append('filePath', file ? file.name : '');
    try {
      const response = await Axios.post('http://localhost:5000/api/resources', formData, {
        headers: { Authorization: `Bearer ${token}` },
        'Content-Type': 'multipart/form-data',
      });
      setTitle('');
      setDescription('');
      setType('Webinar');
      setFile(null);
      setFilterType('');
      alert('Resource created successfully!');
      fetchResources();
    } catch (error) {
      console.error('Error type:', error);
      setError('Error creating resource. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this resource?');
    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);
      await Axios.delete(`http://localhost:5000/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        
      });
      setResources(resources.filter((resource) => resource._id !== id));
      alert('Resource deleted successfully!');
    } catch (error) {
      setError('Error deleting resource. Please try again.');
    } finally {
      setLoading(false);
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
        <video controls width="400">
          <source type="video/mp4" />
          {resource.videoUrl}
          Your browser does not support the video tag.
        </video>
      );
    } else if (resource.type === 'Article') {
      return (
        <a href={`http://localhost:5000${resource.articleUrl}`} target="_blank" rel="noopener noreferrer">
          View Article
        </a>
      );
    } else if (resource.type === 'Webinar') {
      return (
        <iframe title="Webinar" src={resource.webinarUrl} width="800" height="600"></iframe>
      );
    }
    return null;
  };

  return (
    <div>
      <Forum />
      <div className='min-h-screen bg-gradient-to-r from-slate-300 to-orange-200'>
        <div className='container mx-auto py-8'>
          <p className='text-center text-xl'>Explore the wealth of information, tools, and insights curated to enhance your skills, knowledge, and career development</p>
          <div className='flex justify-center gap-8 pt-6 text-2xl'>
            <h1 className='py-2 px-4'>Content Types</h1>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === '' ? 'font-bold' : ''}`} onClick={() => setFilterType('')}>All</button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Webinar' ? 'font-bold' : ''}`} onClick={() => setFilterType('Webinar')}>Webinar</button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Video' ? 'font-bold' : ''}`} onClick={() => setFilterType('Video')}>Video</button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Module' ? 'font-bold' : ''}`} onClick={() => setFilterType('Module')}>Module</button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Article' ? 'font-bold' : ''}`} onClick={() => setFilterType('Article')}>Articles</button>
          </div>

          <form onSubmit={handleSubmit} className='mt-8'>
            <div className='grid grid-cols-2 gap-4'>
              <label>Title:</label>
              <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} required className='border border-gray-300 rounded-md p-2' />
              <label>Description:</label>
              <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} required className='border border-gray-300 rounded-md p-2' />
              <label>Type:</label>
              <select value={type} onChange={(e) => setType(e.target.value)} required className='border border-gray-300 rounded-md p-2'>
                <option value='Webinar'>Webinar</option>
                <option value='Video'>Video</option>
                <option value='Article'>Article</option>
              </select>
              {(type === 'Video' || type === 'Article') && (
                <div>
                  <label>Upload File:</label>
                  <input type='file' onChange={handleFileChange} required className='border border-gray-300 rounded-md p-2' />
                </div>
              )}
            </div>
            <button type='submit' className='bg-blue-500 text-white px-4 py-2 mt-4 rounded-md'>Create Resource</button>
          </form>

          {loading && <p className='text-center mt-4'>Loading...</p>}
          {error && <p className='text-center text-red-500 mt-4'>{error}</p>}

          <div className='mt-8'>
            <h2 className='text-2xl'>Resources:</h2>
            <ul className='mt-4 flex justify-between'>
              {resources
                .filter(resource => filterType === '' || resource.type === filterType)
                .map((resource) => (
                  <li key={resource._id} className='border border-gray-300 rounded-md p-4 mb-4 '>
                    <p>Title: {resource.title}</p>
                    <p>Description: {resource.description}</p>
                    <p>Type: {resource.type}</p>
                    <div className="flex justify-between items-center mt-2">
                      <button onClick={() => handleDelete(resource._id)} className='bg-red-500 text-white px-3 py-1 rounded-md'>Delete</button>
                      <button onClick={() => handleLearnMore(resource)} className='bg-green-500 text-white px-3 py-1 rounded-md'>Learn More</button>
                    </div>
                    {/* Render additional resource details or preview */}
                
                  </li>
                ))}
            </ul>
          </div>
          <Modal isOpen={isModalOpen} onClose={closeModal} resource={selectedResource} />
        </div>
      </div>
    </div>
  );
}

export default Resource;
