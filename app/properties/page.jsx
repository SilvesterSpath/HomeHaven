import PropertyCard from '@/components/PropertyCard';
import { fetchProperties } from '@/utils/requests';
import PropertySeachFrom from '@/components/PropertySeachFrom';

const PropertiesPage = async () => {
  const properties = await fetchProperties();

  // Sort properties by date
  properties.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <>
      <section className='bg-brand-dark py-4 mb-4'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
          <div className='text-center'></div>
          <PropertySeachFrom />
        </div>
      </section>
      <section className='px-4 py-6'>
        {properties.length === 0 ? (
          <div>No properties found</div>
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
      </section>
    </>
  );
};

export default PropertiesPage;
