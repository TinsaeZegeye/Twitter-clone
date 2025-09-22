import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
    
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }), 
    ], 
    secret: process.env.NEXTAUTH_SECRET, 

    pages: {
        signIn: '/auth/signin'
    }, 

    callbacks: {
            async jwt({ token, user }) {
                if (user) {
                token.username = user.name?.split(" ").join("").toLocaleLowerCase();
                token.uid = user.sub;
                }
                return token;
            },
        async session({ session, token }) {
            session.user.username = token.username;
            session.user.uid = token.sub;
            return session;
        },
    }
})

export { handler as GET, handler as POST }
