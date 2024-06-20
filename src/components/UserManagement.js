import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash, faEye, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 8;
  const token = localStorage.getItem('Token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/detail/user/info', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to fetch user details');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/detail/delete/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user detail:', error);
      setError('Failed to delete user detail');
    }
  };

  const handleView = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/detail/view/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      setSelectedUser(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error viewing user detail:', error);
      setError('Failed to view user detail');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleNext = () => {
    if ((currentPage + 1) * usersPerPage < users.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const downloadPDF = () => {
    const input = document.getElementById('user-management-page');
    html2canvas(input, { useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('user-management.pdf');
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const startIndex = currentPage * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <div id="user-management-page" className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">User Management</h1>
      <div className="flex justify-between mb-4">
        <button
          className={`text-gray-700 hover:text-gray-900 ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handlePrev}
          disabled={currentPage === 0}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Previous
        </button>
        <button
          onClick={downloadPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          Download PDF
        </button>
        <button
          className={`text-gray-700 hover:text-gray-900 ${(currentPage + 1) * usersPerPage >= users.length ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleNext}
          disabled={(currentPage + 1) * usersPerPage >= users.length}
        >
          Next <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentUsers.map(user => (
          <div key={user._id} className="max-w-md bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105">
            <div className="p-4 flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex justify-center items-center">
                <FontAwesomeIcon icon={faUser} size="lg" className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{user.firstName} {user.lastName}</h2>
                <p className="text-gray-600">{user.city}</p>
                <p className="text-gray-600">{user.role}</p>
              </div>
            </div>
            <div className="flex justify-around p-4 border-t border-gray-200">
              <button className="text-blue-500 hover:text-blue-700" onClick={() => handleView(user._id)}>
                <FontAwesomeIcon icon={faEye} /> View
              </button>
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(user._id)}>
                <FontAwesomeIcon icon={faTrash} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FontAwesomeIcon icon={faUser} size="lg" className="text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">User Detail</h3>
                    {selectedUser && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Name: {selectedUser.firstName} {selectedUser.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Location: {selectedUser.city}
                        </p>
                        <p className="text-sm text-gray-500">
                          Role: {selectedUser.role}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={closeModal}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
