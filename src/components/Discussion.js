import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Forum from './Forum';
import { AiOutlinePlus, AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'; // Import icons for buttons

function Discussion() {
  const [status, setStatus] = useState('');
  const [questions, setQuestions] = useState([]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/questions/view', {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      setQuestions(response.data); // Assuming the questions array is directly in response.data
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/request/status', {
          headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
        });
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    fetchQuestions(); // Initial fetch when the component mounts
  }, []);

  const handleUpvote = async (questionId) => {
    try {
      await axios.put(`http://localhost:5000/api/questions/upvote/${questionId}`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      // Re-fetch questions after successful upvote
      fetchQuestions();
    } catch (error) {
      console.error('Error upvoting question:', error);
    }
  };

  const handleDownvote = async (questionId) => {
    try {
      await axios.put(`http://localhost:5000/api/questions/downvote/${questionId}`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      // Re-fetch questions after successful downvote
      fetchQuestions();
    } catch (error) {
      console.error('Error downvoting question:', error);
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
                  <span className='bg-gray-500 text-white px-2 py-1 rounded-md mr-2'>{question.upvotes}</span>
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center'>
                      <button className='bg-gray-500 text-white px-2 py-1 rounded-md' onClick={() => handleUpvote(question._id)}>
                        <AiOutlineArrowUp /> Votes
                      </button>
                    </div>
                    <div className='bg-white p-2 w-full text-xl font-serif font-extrabold'>
                      {question.message} <br />
                     <p className='text-sm text-gray-700'> by {question.learnerFirstName}</p> 
                    </div>
                    
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Discussion;
