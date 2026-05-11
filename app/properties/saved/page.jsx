'use client';
import { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';

const SavedPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedProperties = async () => {
      try {
        const res = await fetch('/api/bookmarks');
        if (res.status === 200) {
          const data = await res.json();
          setProperties(data);
        } else {
          console.log(res.statusText);
          toast.error('Failed to fetch saved properties');
        }
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarkedProperties();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className='px-4 py-6'>
        <h1 className='text-2xl mb-4'>Saved Properties</h1>
        <div className='container-xl lg:container m-auto px-4 py-6'>
          {properties.length === 0 ? (
            <div>No saved properties found</div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {properties.map((item, index) => (
                <PropertyCard
                  key={item._id ? item._id.toString() : index}
                  property={item}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SavedPropertiesPage;
