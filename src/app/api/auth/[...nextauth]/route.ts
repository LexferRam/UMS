import NextAuth from 'next-auth'
import { authOptions } from '@/util/authOptions';

 const handler = NextAuth(authOptions)
 export const maxDuration = 60;

export { handler as GET, handler as POST }
