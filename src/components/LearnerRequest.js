import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaCheck } from 'react-icons/fa'; // Import the check icon
import LOGO from "../Assets/loading.gif";

function LearnerRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('Token');
    
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/learner-requests', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Learner Requests:', response.data);
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching learner requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [token]);

    const deleteRequest = async (requestId) => {
        try {
            await axios.delete(`http://localhost:5000/api/requests/${requestId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests((prevRequests) => prevRequests.filter(request => request._id !== requestId));
            console.log('Request deleted successfully');
        } catch (error) {
            console.error('Error deleting request:', error);
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-gray-300 to-orange-200 flex items-center justify-center">
                <img src={LOGO} alt="Loading" />
            </div>
        );
    }
    
    return (
        <div className="p-4 min-h-screen bg-gradient-to-r from-gray-300 to-orange-200">
            <div className="m-6 bg-transparent flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                <div className="text-2xl font-bold py-2 px-4 rounded">Requests</div>
            </div>
            {requests.length === 0 ? (
                <div className="text-center text-gray-800 font-semibold">No requests available</div>
            ) : (
                <div className="bg-white rounded-md shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Learner Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.map((request) => (
                                <tr key={request._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <FaUser className="h-6 w-6 text-blue-400" />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {request.learnerName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{request.classType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{request.classTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            request.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : request.status === 'accepted'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                        {request.status === 'accepted' ? (
                                            <FaCheck className="text-green-600" title="Accepted" />
                                        ) : (
                                            <button
                                                onClick={() => deleteRequest(request._id)}
                                                className="ml-2 text-red-600 hover:text-red-900"
                                            >
                                                Remove request
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default LearnerRequest;
