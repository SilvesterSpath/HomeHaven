'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import Spinner from '@/components/Spinner';
import { fetchSearchResults } from '@/utils/requests';
import Link from 'next/link';
import { FaArrowCircleLeft } from 'react-icons/fa';
import PropertySeachFrom from '@/components/PropertySeachFrom';

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = searchParams.get('location');
  const propertyType = searchParams.get('propertyType');

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSearchResults(location, propertyType);
      setProperties(data);
      setLoading(false);
    };
    fetchData();
  }, [location, propertyType]);

  return (
    <>
      {' '}
      <section className='bg-brand-dark py-4 mb-4'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
          <PropertySeachFrom />
        </div>
      </section>
      <section className='px-4 py-6'>
        <h2 className='text-3xl font-bold text-brand-dark mb-6 text-center'>
          {properties && properties.length === 0
            ? 'No search results found'
            : properties.length === 1
            ? 'Search Result'
            : 'Search Results'}
        </h2>
        <div className='container-xl lg:container m-auto'>
          <Link
            href='/properties'
            className='flex items-center text-brand hover:underline mb-3 font-medium'
          >
            <FaArrowCircleLeft className='mr-2 mb-1' /> Back to Properties
          </Link>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {loading ? (
              <Spinner />
            ) : (
              properties.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchResultsPage;
