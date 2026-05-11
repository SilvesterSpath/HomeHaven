const LoginPage = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-brand-surface'>
      <div className='bg-white p-8 rounded-lg shadow-md'>
        <h1 className='text-3xl font-bold mb-2 text-brand-dark'>
          Sign in to HomeHaven
        </h1>
        <p className='text-sm text-gray-600 mb-6'>
          Continue to save rentals, message hosts, and manage your listings.
        </p>
        <div className='mb-4'>
          <input
            type='email'
            placeholder='you@email.com'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand'
          />
        </div>
        <button className='w-full py-2 mb-4 bg-brand text-white font-bold rounded-md hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2'>
          Continue with email
        </button>
        <div className='flex justify-center mb-4'>
          <span className='mx-2 text-gray-500'>or</span>
        </div>
        <button className='w-full py-2 mb-4 bg-white text-gray-700 font-bold border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400'>
          Continue with Google
        </button>
        <button className='w-full py-2 bg-black text-white font-bold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500'>
          Continue with Apple
        </button>
        <p className='mt-6 text-center text-xs text-gray-500'>
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
