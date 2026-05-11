import { authOptions } from '@/utils/authOptions';
import NextAuth from 'next-auth/next';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; //export the same handler function under two different names: GET and POST
