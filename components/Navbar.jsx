'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import profileDefault from '@/assets/images/profile.png';
import {
  FaCompass,
  FaGoogle,
  FaUser,
  FaBookmark,
  FaSignOutAlt,
} from 'react-icons/fa';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

const navLinkClasses = (isActive) =>
  `relative text-sm font-medium transition after:absolute after:left-0 after:right-0 after:bottom-[-6px] after:h-[2px] after:rounded-full after:bg-brand-accent after:transition-opacity after:content-[''] ${
    isActive
      ? 'text-brand-accent after:opacity-100'
      : 'text-white/90 hover:text-white after:opacity-0'
  }`;

const mobileNavLinkClasses = (isActive) =>
  `block rounded-md px-3 py-2 text-base font-medium transition ${
    isActive
      ? 'bg-white/10 text-white'
      : 'text-white/90 hover:bg-white/5 hover:text-white'
  }`;

const Navbar = () => {
  const { data: session } = useSession();
  const [isMobilOpen, setIsMobilOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [providers, setProviders] = useState(false);

  const profileImage = session?.user?.image;
  const pathname = usePathname();

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
  }, []);

  return (
    <nav className='bg-brand-dark border-b border-brand'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-20 items-center justify-between'>
          <div className='absolute inset-y-0 left-0 flex items-center md:hidden'>
            <button
              type='button'
              id='mobile-dropdown-button'
              className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
              aria-controls='mobile-menu'
              aria-expanded={isMobilOpen}
              onClick={() => setIsMobilOpen((prev) => !prev)}
            >
              <span className='absolute -inset-0.5'></span>
              <span className='sr-only'>Open main menu</span>
              <svg
                className='block h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </button>
          </div>

          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            <Link className='flex flex-shrink-0 items-center' href='/'>
              <span
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-dark shadow-sm'
                aria-hidden
              >
                <FaCompass className='h-5 w-5' />
              </span>
              <span className='hidden md:block text-white text-2xl font-bold ml-2'>
                HomeHaven
              </span>
            </Link>

            <div className='hidden md:ml-8 md:flex md:items-center md:gap-4'>
              <Link
                href='/properties'
                className={navLinkClasses(pathname === '/properties')}
              >
                Properties
              </Link>
              {session && (
                <Link
                  href='/properties/add'
                  className='inline-flex items-center rounded-md bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-dark transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-dark'
                >
                  List your place
                </Link>
              )}
            </div>
          </div>

          {!session && providers && (
            <div className='hidden md:block md:ml-6'>
              <div className='flex items-center'>
                {Object.values(providers).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => signIn(item.id)}
                    className='flex items-center text-white bg-gray-700 hover:bg-gray-900 rounded-md px-3 py-2'
                  >
                    <FaGoogle className='text-white mr-2' />
                    <span>Sign in</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className='absolute inset-y-0 right-0 flex items-center gap-3 pr-2 md:static md:inset-auto md:ml-6 md:pr-0'>
            {session && (
              <Link href='messages' className='relative group'>
                <button
                  type='button'
                  className='relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                >
                  <span className='absolute -inset-1.5'></span>
                  <span className='sr-only'>View notifications</span>
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
                    />
                  </svg>
                </button>
                <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
                  2
                  {/* <!-- Replace with the actual number of notifications --> */}
                </span>
              </Link>
            )}

            {session && (
              <div className='relative ml-1'>
                <div>
                  <button
                    type='button'
                    className='relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                    id='user-menu-button'
                    aria-expanded={isProfileOpen}
                    aria-haspopup='true'
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                  >
                    <span className='absolute -inset-1.5'></span>
                    <span className='sr-only'>Open user menu</span>
                    <Image
                      className='h-8 w-8 rounded-full'
                      src={profileImage || profileDefault}
                      alt=''
                      width={40}
                      height={40}
                    />
                  </button>
                </div>

                {isProfileOpen && (
                  <div
                    id='user-menu'
                    className='absolute right-0 z-10 mt-2 w-52 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none'
                    role='menu'
                    aria-orientation='vertical'
                    aria-labelledby='user-menu-button'
                    tabIndex='-1'
                  >
                    <Link
                      href='/profile'
                      className='flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                      role='menuitem'
                      tabIndex='-1'
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaUser className='text-gray-400' aria-hidden />
                      Your Profile
                    </Link>
                    <Link
                      href='/properties/saved'
                      className='flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                      role='menuitem'
                      tabIndex='-1'
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaBookmark className='text-gray-400' aria-hidden />
                      Saved Properties
                    </Link>
                    <div className='my-1 border-t border-gray-100' />
                    <button
                      className='flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                      role='menuitem'
                      tabIndex='-1'
                      onClick={() => {
                        setIsProfileOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                    >
                      <FaSignOutAlt className='text-gray-400' aria-hidden />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobilOpen && (
        <div id='mobile-menu'>
          <div className='space-y-1 px-2 pb-3 pt-2'>
            <Link
              href='/properties'
              className={mobileNavLinkClasses(pathname === '/properties')}
              onClick={() => setIsMobilOpen(false)}
            >
              Properties
            </Link>
            {session && (
              <Link
                href='/properties/add'
                className='block rounded-md bg-brand-accent px-3 py-2 my-2 text-center text-base font-semibold text-brand-dark'
                onClick={() => setIsMobilOpen(false)}
              >
                List your place
              </Link>
            )}
            {!session &&
              providers &&
              Object.values(providers).map((item) => (
                <Link
                  key={item.id}
                  onClick={() =>
                    signIn(item.id, {
                      callbackUrl: item.callbackUrl,
                    })
                  }
                  href={'/login'}
                  className='flex items-center text-white bg-gray-700 hover:bg-gray-900 rounded-md px-3 py-2 my-4'
                >
                  <FaGoogle className='text-white mr-2' />
                  <span>Sign in</span>
                </Link>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
