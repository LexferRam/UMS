import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { connectMongoDB } from '@/db/mongodb';
import User from '@/models/user';

export const authOptions = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    callbacks: {
        // async session({ session, token }) {
        //     const sessionUser = await User.findOne({ email: session?.user?.email });

        //     // session.user && (session.user.id = sessionUser._id.toString())
        //     // console.log( {...session.user, id : sessionUser._id.toString()})
        //     return {...session.user, id : sessionUser._id.toString()}
        // },
        async signIn({ user, account }: any) {
            // console.log("User: " + JSON.stringify(user))
            // console.log("Account: " + JSON.stringify(account))

            if (account?.provider === 'google') {
                const { name, email, image } = user;

                try {
                    await connectMongoDB()
                    const userExists = await User.findOne({ email })

                    if (!userExists) {
                        const res = await fetch('http://localhost:3000/api/user', {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                name, email, lastname: image
                            })
                        })

                        if (res.ok) {
                            return user
                        }
                    }

                } catch (error) {
                    console.log(error)
                }
            }
            return user
        }
    }
})

export { authOptions as GET, authOptions as POST }