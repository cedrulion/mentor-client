import React from 'react';

const CommentsModal = ({ comments, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-96">
        <div className="text-xl font-bold mb-4">Comments</div>
        <ul className="divide-y divide-gray-300">
          {comments.map((comment) => (
            <li key={comment._id} className="py-2">
              <div className="text-gray-700">{comment.message}</div>
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
