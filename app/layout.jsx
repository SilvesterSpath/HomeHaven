import Navbar from '@/components/Navbar';
import '@/assets/styles/globals.css';
import AuthProvider from '@/components/AuthProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '@/components/Footer';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata = {
  title: 'HomeHaven — Rentals made simple',
  description:
    'Browse verified rental listings, save the ones you love, and message hosts directly. HomeHaven connects renters with property owners.',
  keywords:
    'rentals, apartment for rent, house for rent, rental listings, find rentals, list your rental',
};

const MainLayout = ({ children }) => {
  return (
    <AuthProvider>
      <html lang='en' className={dmSans.variable}>
        <body className='font-sans antialiased'>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ToastContainer />
        </body>
      </html>
    </AuthProvider>
  );
};

export default MainLayout;
