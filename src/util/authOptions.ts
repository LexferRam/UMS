import { connectMongoDB } from "@/db/mongodb";
import Event from "@/models/event";
import Patient from "@/models/patient";
import User from "@/models/user";
import { getServerSession, NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    callbacks: {
        async session({ session }: any) {
            await connectMongoDB()
            const sessionUser = await User.findOne({ email: session?.user?.email })

            return sessionUser
        },
        async signIn({ user, account }: any) {

            if (account?.provider === 'google') {
                const { name, email, image } = user;

                try {
                    await connectMongoDB()
                    const userExists: any = await User.find({ email })

                    if(!userExists?.isActive) {
                        return null
                    }

                     if (!userExists.length) {
                         const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/user`, {
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
                    return userExists

                } catch (error) {
                    console.log(error)
                }
            }
            return user
        }
    }
}

export const getSession = async () =>  await getServerSession(authOptions)