import { connectMongoDB } from "@/db/mongodb";
import Event from "@/models/event";
import Patient from "@/models/patient";
import User from "@/models/user";
import { NextAuthOptions } from "next-auth";
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
            const sessionUser = await User.findOne({ email: session?.user?.email }).populate({
                path: 'asignedPatients',
                model: Patient
            }).populate({
                path: 'events',
                model: Event
            });

            return sessionUser
        },
        async signIn({ user, account }: any) {
            // console.log("User: " + JSON.stringify(user))
            // console.log("Account: " + JSON.stringify(account))

            if (account?.provider === 'google') {
                const { name, email, image } = user;

                try {
                    await connectMongoDB()
                    const userExists = await User.findOne({ email })

                    // if(!userExists?.isActive || !userExists) return

                     if (!userExists) {
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
