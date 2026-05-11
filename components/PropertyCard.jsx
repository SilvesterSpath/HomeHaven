'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';
import BookmarkButton from './BookmarkButton';

const formatPrice = (rates) => {
  if (rates?.monthly) return `$${Number(rates.monthly).toLocaleString()}/mo`;
  if (rates?.weekly) return `$${Number(rates.weekly).toLocaleString()}/wk`;
  if (rates?.nightly) return `$${Number(rates.nightly).toLocaleString()}/night`;
  return null;
};

const formatMeta = ({ beds, baths, square_feet }) => {
  const parts = [];
  if (beds != null) parts.push(`${beds} ${beds === 1 ? 'bed' : 'beds'}`);
  if (baths != null) parts.push(`${baths} ${baths === 1 ? 'bath' : 'baths'}`);
  if (square_feet != null) {
    parts.push(`${Number(square_feet).toLocaleString()} sqft`);
  }
  return parts.join(' · ');
};

const formatPeriods = (rates) => {
  const labels = [];
  if (rates?.nightly) labels.push('Nightly');
  if (rates?.weekly) labels.push('Weekly');
  if (rates?.monthly) labels.push('Monthly');
  return labels.join(' · ');
};

const PropertyCard = ({ property }) => {
  const price = formatPrice(property.rates);
  const meta = formatMeta(property);
  const periods = formatPeriods(property.rates);
  const location = `${property.location.city}, ${property.location.state}`;

  return (
    <article className='group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-md focus-within:ring-2 focus-within:ring-brand'>
      <Link
        href={`/properties/${property._id}`}
        className='block focus:outline-none'
      >
        <div className='relative aspect-[16/10] w-full overflow-hidden bg-gray-100'>
          <Image
            src={property.images[0]}
            alt={property.name}
            fill
            sizes='(min-width: 768px) 33vw, 100vw'
            className='object-cover transition duration-300 group-hover:scale-105'
          />
          <span className='absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm backdrop-blur'>
            <FaMapMarkerAlt className='text-brand-dark' aria-hidden />
            {location}
          </span>
        </div>
        <div className='p-4'>
          <p className='text-xs font-medium uppercase tracking-wide text-gray-500'>
            {property.type}
          </p>
          <h3 className='mt-1 text-lg font-semibold text-gray-900 line-clamp-2'>
            {property.name}
          </h3>
          {price && (
            <p className='mt-2 text-lg font-bold text-brand-dark'>{price}</p>
          )}
          {meta && <p className='mt-1 text-sm text-gray-600'>{meta}</p>}
          {periods && (
            <p className='mt-3 text-xs uppercase tracking-wide text-gray-500'>
              {periods}
            </p>
          )}
        </div>
      </Link>
      <div className='absolute right-3 top-3'>
        <BookmarkButton property={property} variant='icon' />
      </div>
    </article>
  );
};

export default PropertyCard;
