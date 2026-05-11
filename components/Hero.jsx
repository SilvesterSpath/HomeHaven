import Image from 'next/image';
import Link from 'next/link';
import PropertySeachFrom from './PropertySeachFrom';

const HERO_IMAGE =
  'https://res.cloudinary.com/drd3smx7a/image/upload/homehaven/d1_jwpzhr.jpg';

const QUICK_FILTERS = [
  { label: 'Apartments', value: 'Apartment' },
  { label: 'Houses', value: 'House' },
  { label: 'Lofts', value: 'Loft' },
  { label: 'Cabins', value: 'Cabin Or Cottage' },
  { label: 'Condos', value: 'Condo' },
];

const Hero = () => {
  return (
    <section className='relative isolate flex min-h-[600px] items-center justify-center overflow-hidden'>
      <Image
        src={HERO_IMAGE}
        alt=''
        fill
        priority
        sizes='100vw'
        className='-z-10 object-cover'
      />
      <div className='absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/45 to-black/70' />

      <div className='relative mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8'>
        <h1 className='text-4xl font-black tracking-tight text-white sm:text-5xl md:text-7xl md:tracking-tighter'>
          Your next place starts here
        </h1>
        <p className='mx-auto mt-4 max-w-xl text-lg text-white/90 sm:text-xl'>
          Search verified rentals, save what you love, and reach hosts in one
          click.
        </p>

        <div className='mt-8 rounded-2xl bg-white/10 p-2 shadow-2xl ring-1 ring-white/20 backdrop-blur-md sm:p-4'>
          <PropertySeachFrom />
        </div>

        <div className='mt-6 flex flex-wrap justify-center gap-2'>
          {QUICK_FILTERS.map((filter) => (
            <Link
              key={filter.value}
              href={`/properties/search-results?location=&propertyType=${encodeURIComponent(
                filter.value
              )}`}
              className='inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm ring-1 ring-white/20 transition hover:bg-white/20'
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
