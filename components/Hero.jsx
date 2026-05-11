import PropertySeachFrom from './PropertySeachFrom';

const Hero = () => {
  return (
    <section className='bg-brand-dark py-20 mb-4'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
        <div className='text-center'>
          <h1 className='text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl md:tracking-tighter'>
            Your next place starts here
          </h1>
          <p className='my-4 text-xl text-white'>
            Search verified rentals, save what you love, and reach hosts in one click.
          </p>
        </div>
        <PropertySeachFrom />
      </div>
    </section>
  );
};

export default Hero;
