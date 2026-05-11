'use client';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Message = ({ message }) => {
  const [isRead, setIsRead] = useState(message.read);

  const handleRead = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/messages/${message._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        setIsRead(!isRead);
        if (!isRead) {
          toast.success('Message marked as read');
        } else {
          toast.success('Marked as new');
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Error marking message as read');
    }
  };

  return (
    <>
      {' '}
      <div className='relative bg-white p-4 rounded-md shadow-md border border-gray-200'>
        {!isRead && (
          <div className='absolute top-2 right-2 bg-yellow-500 text-white rounded-full p-1'>
            <span className='text-xs font-bold'>New</span>
          </div>
        )}
        <h2 className='text-xl mb-4'>
          <span className='font-bold'>Property Inquiry:</span>{' '}
          {message.property.name}
        </h2>
        <p className='text-gray-700'>{message.body}</p>

        <ul className='mt-4'>
          <li>
            <strong>Name:</strong> {message.sender.username}
          </li>

          <li>
            <strong>Reply Email:</strong>
            <a href={`mailto:${message.email}`} className='text-blue-500'>
              {' '}
              {message.email}
            </a>
          </li>
          <li>
            <strong>Reply Phone:</strong>
            <a href={`tel:${message.phone}`} className='text-blue-500'>
              {' '}
              {message.phone}
            </a>
          </li>
          <li>
            <strong>Received:</strong>{' '}
            {moment(message.createdAt.toLocaleString()).format(
              'M/D/YYYY h:mm:ss A'
            )}
          </li>
        </ul>
        <button
          onClick={handleRead}
          className={`mt-4 mr-3 ${
            isRead ? 'bg-gray-500' : 'bg-blue-500 text-white'
          }  py-1 px-3 rounded-md`}
        >
          {isRead ? 'Mark as New' : 'Mark as Read'}
        </button>
        <button className='mt-4 bg-red-500 text-white py-1 px-3 rounded-md'>
          Delete
        </button>
      </div>
    </>
  );
};

export default Message;
