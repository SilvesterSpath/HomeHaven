/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**', // allows path with no path segment also
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**', // allows path with no path segment also
      },
    ],
  },
};

export default nextConfig;
