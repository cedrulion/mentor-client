import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Forum from './Forum';

function Question() {
  const [questionText, setQuestionText] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleQuestionChange = (event) => {
    setQuestionText(event.target.value);
  };

  const handleSendQuestion = async () => {
    setLoading(true); // Set loading state while sending question
    try {
      await axios.post('https://mentor-server-qd42.onrender.com/api/questions/ask/general', { message: questionText }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      console.log('Question sent successfully');
      setQuestionText(''); // Clear input after sending question
      // Optionally, update state or show notification for successful submission
    } catch (error) {
      console.error('Error sending question:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://mentor-server-qd42.onrender.com/api/questions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
        });
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  // Function to get frequently asked questions
  const getFrequentQuestions = () => {
    const questionCounts = {};
    questions.forEach((question) => {
      const message = question.message;
      questionCounts[message] = (questionCounts[message] || 0) + 1;
    });

    const sortedQuestions = Object.keys(questionCounts).sort((a, b) => questionCounts[b] - questionCounts[a]);
    return sortedQuestions.slice(0, 4);
  };

  const frequentQuestions = getFrequentQuestions();

  return (
    <div>
      <Forum />
      <div className="h-screen bg-gradient-to-r from-gray-300 to-orange-200 p-6">
        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder="Ask a question..."
            value={questionText}
            onChange={handleQuestionChange}
            className="p-2 rounded-md w-3/4 bg-gray-100"
          />
          <button className="bg-amber-600 py-3 px-8 rounded-md text-white" onClick={handleSendQuestion}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        {frequentQuestions.length > 0 && (
          <>
            <p className='text-orange-500 text-2xl text-center'>Frequently Asked Questions</p>
            <div className="grid grid-rows-1 sm:grid-rows-2 md:grid-rows-4 gap-4 mt-5">
              {frequentQuestions.map((question, index) => (
                <div
                  key={index}
                  className={`rounded-md p-4 text-xl font-Roboto font-bold ${index === 0 || index === 3 ? 'bg-orange-400 text-white ' : 'bg-gray-200'}`}
                >
                  <p>{question}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Question;
