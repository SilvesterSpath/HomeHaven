'use client';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const BookmarkButton = ({ property, variant = 'pill' }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const checkBookmarkStatus = async () => {
      try {
        const res = await fetch('/api/bookmarks/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId: property._id }),
        });

        if (res.status === 200) {
          const data = await res.json();
          setIsBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    checkBookmarkStatus();
  }, [property._id, userId]);

  const handleClick = async () => {
    if (!userId) {
      toast.error('Please sign in to bookmark a property');
      return;
    }

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property._id }),
      });

      if (res.status === 200) {
        const data = await res.json();
        toast.success(data.message);
        setIsBookmarked(data.isBookmarked);
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  if (variant === 'icon') {
    return (
      <button
        type='button'
        onClick={handleClick}
        disabled={loading}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Save property'}
        aria-pressed={isBookmarked}
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 ${
          isBookmarked ? 'text-red-500' : 'text-gray-700'
        }`}
      >
        {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
      </button>
    );
  }

  if (loading) {
    return <p className='text-center'>...Loading</p>;
  }

  return isBookmarked ? (
    <button
      onClick={handleClick}
      className='bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center'
    >
      <FaBookmark className='mr-2' /> Remove Bookmark
    </button>
  ) : (
    <button
      onClick={handleClick}
      className='bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center'
    >
      <FaBookmark className='mr-2' /> Bookmark Property
    </button>
  );
};

export default BookmarkButton;
