import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Modal from './Modal'; // Ensure this component is defined

const styles = {
  button: {
    backgroundColor: '#1e90ff', /* DodgerBlue */
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  buttonHover: {
    backgroundColor: '#1c86ee', /* Slightly darker */
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
  },
  modalContent: {
    margin: '20px',
  },
  close: {
    cursor: 'pointer',
    background: 'red',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '50%',
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
};

function ManageUploads() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
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

  useEffect(() => {
    const storedToken = localStorage.getItem('Token');
    if (storedToken) {
      setToken(storedToken);
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      setUserId(decodedToken.userId);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchResources();
    }
  }, [token, filterType]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await Axios.get('https://mentor-server-qd42.onrender.com/api/resources', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(response.data);
    } catch (error) {
      setError('Error fetching resources. Please try again later.');
    } finally {
      setLoading(false);
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
    formData.append('date', date);
    formData.append('description', description);
    formData.append('type', type);
    if (file) {
      formData.append('file', file);
    }

    try {
      await Axios.post('https://mentor-server-qd42.onrender.com/api/resources', formData, {
        headers: { Authorization: `Bearer ${token}` },
        'Content-Type': 'multipart/form-data',
      });
      setTitle('');
      setDate('');
      setDescription('');
      setType('Webinar');
      setFile(null);
      alert('Resource created successfully!');
      fetchResources();
    } catch (error) {
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
      await Axios.delete(`https://mentor-server-qd42.onrender.com/api/resources/${id}`, {
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

  const countResourcesByType = (type) => {
    return resources.filter(resource => resource.type === type).length;
  };

  const renderResource = (resource) => {
    switch (resource.type) {
      case 'Video':
        return (
          <div>
            <video controls width="400">
              <source src={`https://mentor-server-qd42.onrender.com${resource.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'Article':
        return (
          <div>
            <a href={`https://mentor-server-qd42.onrender.com${resource.articleUrl}`} target="_blank" rel="noopener noreferrer">
              View Article
            </a>
          </div>
        );
      case 'Webinar':
        return (
          <div>
            {resource.webinarUrl}
          </div>
        );
      case 'Module':
        return (
          <div>
            <a href={`https://mentor-server-qd42.onrender.com${resource.moduleUrl}`} target="_blank" rel="noopener noreferrer">
              View Module
            </a>
            <button onClick={() => handleLearnMore(resource)} style={styles.button}>
              Learn More
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-slate-300 to-orange-200 px-9">
        <div className="py-3">
          <p className="text-center text-xl mb-5">Uploaded Contents</p>
          
          <div className="flex justify-around">
            <div className="bg-green-300 py-2 px-5 rounded-md">
              <p>Webinar</p>
              <p>{countResourcesByType('Webinar')}</p>
            </div>
            <div className="bg-yellow-300 py-2  px-5 rounded-md">
              <p>Video</p>
              <p>{countResourcesByType('Video')}</p>
            </div>
            <div className="bg-orange-300 py-2  px-5 rounded-md">
              <p>Module</p>
              <p>{countResourcesByType('Module')}</p>
            </div>
            <div className="bg-blue-300 py-2  px-5 rounded-md">
              <p>Article</p>
              <p>{countResourcesByType('Article')}</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-8 pt-3">
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === '' ? 'font-bold' : ''}`} onClick={() => setFilterType('')}>
              All
            </button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Webinar' ? 'font-bold' : ''}`} onClick={() => setFilterType('Webinar')}>
              Webinar
            </button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Video' ? 'font-bold' : ''}`} onClick={() => setFilterType('Video')}>
              Video
            </button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Module' ? 'font-bold' : ''}`} onClick={() => setFilterType('Module')}>
              Module
            </button>
            <button className={`bg-yellow-200 py-2 px-4 ${filterType === 'Article' ? 'font-bold' : ''}`} onClick={() => setFilterType('Article')}>
              Articles
            </button>
          </div>
        </div>

        <div className="my-8">
          <h2 className="text-lg font-bold">Resources</h2>
          {loading ? (
            <p>Loading resources...</p>
          ) : (
            <div className="mt-2">
              <ul className="mt-2 grid grid-cols-3 gap-3">
                {resources
                  .filter((resource) => filterType === '' || resource.type === filterType)
                  .map((resource) => (
                    <li key={resource._id} className="bg-gray-200 border border-gray-300 rounded-md p-2 mb-2">
                      <span className="bg-orange-300 text-red-800 rounded-lg p-1">{resource.type}</span>
                      <p className="font-bold pt-5 text-2xl break-words">{resource.title}</p>
                      <p className="break-words whitespace-normal">{resource.description}</p>
                      <p className="break-words whitespace-normal">{new Date(resource.date).toLocaleString()}</p>
                      {renderResource(resource)}
                      <button onClick={() => handleDelete(resource._id)} className="bg-red-500 text-white px-3 py-1 rounded-md">
                        Delete
                      </button>
                      <button onClick={() => handleLearnMore(resource)} className="bg-green-500 text-white px-3 py-1 rounded-md">
                        Learn More
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
      {isModalOpen && selectedResource && (
        <Modal onClose={closeModal} resource={selectedResource} />
      )}
    </div>
  );
}

export default ManageUploads;
