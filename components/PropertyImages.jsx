import Image from 'next/image';

const PopertyImages = ({ images }) => {
  return (
    <>
      <section className='bg-blue-50 p-4'>
        <div className='container mx-auto'>
          {images.length === 1 ? (
            <Image
              src={images[0]}
              height='0'
              alt=''
              className='object-cover h-[400px] w-full'
              width={1800}
              sizes='100vw'
              priority={true}
            />
          ) : (
            <div className='grid grid-cols-2 gap-4'>
              {images.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    images.length === 3 && index === 2
                      ? 'col-span-2'
                      : 'col-span-1'
                  }`}
                >
                  <Image
                    src={item}
                    height='0'
                    alt=''
                    className='object-cover h-[400px] w-full rounded-xl'
                    width={1800}
                    sizes='100vw'
                    priority={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PopertyImages;
