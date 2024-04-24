// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, resource }) => {
  if (!isOpen || !resource) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-8 z-50 max-w-3xl overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{resource.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-700 mb-4">{resource.description}</p>
        <div className="mt-4">
          {/* Render resource based on type */}
          {/* Example: Video */}
          {resource.type === 'Video' && (
            <video controls width="100%" className="mb-4">
              <source src={`http://localhost:5000/uploads/${resource.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Example: Article */}
          {resource.type === 'Article' && (
            <a href={`http://localhost:5000${resource.articleUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Article</a>
          )}

          {/* Example: Webinar */}
          {resource.type === 'Webinar' && (
            <iframe title="Webinar" src={resource.webinarUrl} width="100%" height="400" className="mb-4"></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
