'use client';
import Spinner from '@/components/Spinner';
import { useEffect, useState } from 'react';
import Message from '@/components/Message';

const Messages = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch('/api/messages');
        if (res.status === 200) {
          const data = await res.json();
          setMessages(data);
        } else {
          console.log(res.statusText);
        }
      } catch (error) {
        console.log('Error fetching messages: ', error);
      } finally {
        setIsLoading(false);
      }
    };
    getMessages();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className='bg-blue-50'>
        <div className='container m-auto py-14 max-w-6xl'>
          <div className='bg-white px-6 py-4 mb-4 shadow-md rounded-md border m-4 md:m-0'>
            <h1 className='text-3xl font-bold mb-4'>Your Messages</h1>
            <div className='space-y-4'>
              {messages.length === 0 ? (
                <p>You have no messages to show</p>
              ) : (
                messages.map((item) => (
                  <Message message={item} key={item._id} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Messages;
