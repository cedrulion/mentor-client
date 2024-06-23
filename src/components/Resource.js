import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Forum from './Forum';

// Define inline styles for CSS
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

// Modal Component
const Modal = ({ onClose, resource }) => {
  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 className="text-2xl font-bold">{resource.title}</h2>
        <p><strong>Date:</strong> {new Date(resource.date).toLocaleString()}</p>
        <p><strong>Description:</strong> {resource.description}</p>
        <p><strong>Type:</strong> {resource.type}</p>

        <button onClick={onClose} style={{ ...styles.button, backgroundColor: 'red' }}>
          Close
        </button>
      </div>
    </div>
  );
};

// Main Resource Component
function Resource() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Webinar');
  const [file, setFile] = useState(null);
  const [webinarUrl, setWebinarUrl] = useState('');
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
    formData.append('date', date);
    formData.append('description', description);
    formData.append('type', type);
    if (file) {
      formData.append('file', file);
    }
    if (type === 'Webinar') {
      formData.append('webinarUrl', webinarUrl);
    }

    try {
      const response = await Axios.post('http://localhost:5000/api/resources', formData, {
        headers: { Authorization: `Bearer ${token}` },
        'Content-Type': 'multipart/form-data',
      });
      setTitle('');
      setDate('');
      setDescription('');
      setType('Webinar');
      setFile(null);
      setWebinarUrl('');
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

  const printIframeContent = (url) => {
    const printWindow = window.open(url, '_blank');
    printWindow.print();
  };

  const renderResource = (resource) => {
    switch (resource.type) {
      case 'Video':
        return (
          <div>
            <video controls width="400">
              <source src={`http://localhost:5000${resource.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'Article':
        return (
          <div>
            
            <button
              onClick={() => printIframeContent(`http://localhost:5000${resource.articleUrl}`)}
              style={styles.button}
            >
              Print
            </button>
          </div>
        );
      case 'Module':
        return (
          <div>
            
            <button
              onClick={() => printIframeContent(`http://localhost:5000${resource.moduleUrl}`)}
              style={styles.button}
            >
              Print
            </button>
          </div>
        );
      case 'Webinar':
        return (
          <div>
            <iframe title="Webinar" src={resource.webinarUrl} width="800" height="600"></iframe>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Forum />
      <div className="bg-gradient-to-r from-slate-300 to-orange-200 px-9">
        <div className="py-3">
          <p className="text-center text-xl">
            Explore the wealth of information, tools, and insights curated to enhance your skills, knowledge, and career development
          </p>
          <div className="flex justify-center gap-8 pt-3 ">
            <h1 className="py-2 px-4">Content Types</h1>
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

          <form onSubmit={handleSubmit} className="mt-3">
            <h1 className="text-lg font-bold">Adding New Resources</h1>
            <div className="grid grid-cols-2 gap-4">
              <label>Title:</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="border border-gray-300 rounded-md p-2" />

              <label>Date:</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="border border-gray-300 rounded-md p-2" />

              <label>Description:</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="border border-gray-300 rounded-md p-2" />

              <label>Type:</label>
              <select value={type} onChange={(e) => setType(e.target.value)} required className="border border-gray-300 rounded-md p-2">
                <option value="Webinar">Webinar</option>
                <option value="Video">Video</option>
                <option value="Module">Module</option>
                <option value="Article">Article</option>
              </select>
              {type === 'Webinar' && (
                <>
                  <label>Webinar URL:</label>
                  <input type="text" value={webinarUrl} onChange={(e) => setWebinarUrl(e.target.value)} required className="border border-gray-300 rounded-md p-2" />
                </>
              )}
              {['Video', 'Article', 'Module'].includes(type) && (
                <>
                  <label>File Upload:</label>
                  <input type="file" onChange={handleFileChange} className="border border-gray-300 rounded-md p-2" />
                </>
              )}
            </div>
            <button type="submit" style={styles.button}>
              {loading ? 'Uploading...' : 'Create Resource'}
            </button>
          </form>
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

export default Resource;
