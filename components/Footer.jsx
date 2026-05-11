import React from 'react';
import Link from 'next/link';
import { FaCompass } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-200 py-4 mt-24'>
      <div className='container mx-auto flex flex-col md:flex-row items-center justify-between px-4'>
        <div className='mb-4 md:mb-0'>
          <Link
            href='/'
            className='flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'
          >
            <span
              className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-dark text-white shadow-sm'
              aria-hidden
            >
              <FaCompass className='h-5 w-5' />
            </span>
            <span className='text-lg font-bold text-brand-dark'>HomeHaven</span>
          </Link>
        </div>
        {/*         <div className='flex flex-wrap justify-center md:justify-start mb-4 md:mb-0'>
          <ul className='flex space-x-4'>
            <li>
              <Link href='/properties'>Properties</Link>
            </li>
            <li>
              <Link href='/terms'>Terms of Service</Link>
            </li>
          </ul>
        </div> */}
        <div>
          <p className='text-sm text-gray-500 mt-2 md:mt-0'>
            &copy; {currentYear} HomeHaven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
