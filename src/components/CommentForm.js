import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ questionId, token, fetchComments }) => {
  const [text, setText] = useState('');

  const handlePostComment = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/comments/post',
        { text, questionId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.message);
      fetchComments(); // Fetch comments again after posting a new comment
      setText(''); // Clear the text input after posting
    } catch (error) {
      console.error('Error posting comment:', error);
      console.log(error);
    }
  };

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} className='border border-gray-400 p-2 w-full'></textarea>
      <button onClick={handlePostComment} className='bg-blue-500 text-white py-2 px-4 rounded mt-2'>Post Comment</button>
    </div>
  );
};

export default CommentForm;
