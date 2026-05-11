import Image from 'next/image';
import React from 'react';

const PropertyHeaderImage = ({ image }) => {
  return (
    <div>
      {' '}
      <section>
        <div className='container-xl m-auto'>
          <div className='grid grid-cols-1'>
            <img
              src={image}
              height='0'
              alt=''
              className='object-cover h-[400px] w-full'
              width='0'
              sizes='100vw'
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyHeaderImage;
