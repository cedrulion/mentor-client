import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCommentDots, FaPlusCircle, FaMinusCircle } from 'react-icons/fa'; // Import icons for comments and add
import Forum from './Forum';
import CommentsModal from './CommentsModal'; // Import the CommentsModal component

function Discussion() {
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [showComments, setShowComments] = useState({}); // State to track which comments to show
  const [commentsData, setCommentsData] = useState([]); // State to store comments data

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('https://mentor-server-qd42.onrender.com/api/questions', {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      setQuestions(response.data);
      // Initialize showComments state based on fetched questions
      const initialShowComments = {};
      response.data.forEach((question) => {
        initialShowComments[question._id] = false; // Initially hide all comments
      });
      setShowComments(initialShowComments);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    fetchQuestions(); // Initial fetch when the component mounts
  }, []);

  const handleUpvote = async (questionId) => {
    try {
      await axios.put(`https://mentor-server-qd42.onrender.com/api/questions/upvote/${questionId}`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      // Re-fetch questions after successful upvote
      fetchQuestions();
    } catch (error) {
      console.error('Error upvoting question:', error);
    }
  };

  const handleShowComments = async (questionId) => {
    try {
      const response = await axios.get(`https://mentor-server-qd42.onrender.com/api/questions/${questionId}/comments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      // Update state to show comments for the clicked question
      setShowComments((prevShowComments) => ({
        ...prevShowComments,
        [questionId]: !prevShowComments[questionId], // Toggle comments for this question
      }));
      setCommentsData(response.data); // Store comments data in state
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await axios.put(
        `https://mentor-server-qd42.onrender.com/api/questions/comment/${questionId}`,
        { comment: message },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
        }
      );
      // Re-fetch questions after successful comment submission
      fetchQuestions();
      // Close the modal and reset comment input
      setShowModal(false);
      setMessage('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div>
      <div className='h-screen bg-gradient-to-r from-stone-400 to-orange-200'>
        <Forum />
        {questions.length > 0 && (
          <div>
            <ul className='grid grid-rows-1 sm:grid-rows-2 md:grid-rows-4 gap-4 mt-5'>
              {questions.map((question) => (
                <li className='bg-gray-100 shadow-md rounded-lg p-4' key={question._id}>
                  
                  <div className='flex justify-between items-center'>
                    <div className='flex  items-center'>
                      <div className='flex flex-col items-center bg-gradient-to-r from-stone-400 to-gray-500 rounded-md'>
                        <h1 className='text-white px-6 rounded-md'>{question.upvotes}</h1>
                        <button className='text-white px-2 py-1 rounded-md' onClick={() => handleUpvote(question._id)}>
                           Votes
                        </button>
                      </div>
                      <button
                        className='bg-gray-500 text-white px-2 py-1 rounded-md ml-2 flex items-center'
                        onClick={() => handleShowComments(question._id)}
                      >
                        {showComments[question._id] ? (
                          <>
                            <FaMinusCircle className='mr-1' />
                          </>
                        ) : (
                          <>
                            <FaCommentDots className='mr-1' /> 
                          </>
                        )}
                      </button>
                      {/* Add button to toggle comment modal */}
                      <button
                        className='bg-gray-500 text-white px-2 py-1 rounded-md ml-2 flex items-center'
                        onClick={() => {
                          setShowModal(true);
                          setQuestionId(question._id.toString()); // Convert to string before setting
                        }}
                      >
                        <FaPlusCircle className='mr-1' />
                      </button>
                    </div>
                    <div className='bg-white p-2 w-full text-xl font-serif font-extrabold'>
                      {question.message} <br />
                      <p className='text-sm text-gray-700'> by {question.learnerFirstName}</p>
                    </div>
                  </div>
                  {/* Render comments if available and show/hide based on state */}
                  {showComments[question._id] && question.comments && (
                    <CommentsModal comments={commentsData} onClose={() => setShowComments({ ...showComments, [question._id]: false })} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Comment Modal */}
      {showModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50'>
          <div className='bg-white p-4 rounded-lg'>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Enter your comment...'
              className='w-full h-32 p-2 border border-gray-300 rounded-md resize-none'
            ></textarea>
            <div className='flex justify-end mt-2'>
              <button className='bg-blue-500 text-white px-4 py-2 rounded-md mr-2' onClick={handleCommentSubmit}>
                Submit
              </button>
              <button className='bg-gray-500 text-white px-4 py-2 rounded-md' onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Discussion;
