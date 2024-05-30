import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "../../../lib/db"; // Import the local MySQL pool configuration
import bcrypt from "bcrypt";
import type { RowDataPacket } from 'mysql2/promise';

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'your email',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                    placeholder: 'your password',
                },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.error('Missing email or password');
                    throw new Error('Invalid credentials: Missing email or password');
                }
                
                try {
                    // Query the database to find the user by email
                    console.log('Querying database for user:', credentials.email);
                    const [rows]: [RowDataPacket[], any] = await pool.query(
                        'SELECT * FROM users WHERE email = ?',
                        [credentials.email]
                    );
                    const user = rows[0];
                    console.log("User found:", user);

                    if (!user || !user.password) {
                        console.error('User not found or no password in DB');
                        throw new Error('Invalid credentials: User not found or no password');
                    }

                    // Compare the provided password with the stored hashed password
                    console.log('Comparing passwords');
                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    console.log('Password comparison result:', isCorrectPassword);

                    if (!isCorrectPassword) {
                        console.error('Password does not match');
                        throw new Error('Invalid credentials: Password does not match');
                    }

                    // Return the user object
                    console.log('User authorized successfully');
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    };
                } catch (error) {
                    console.error('Error during user authorization:', error);
                    throw new Error('Invalid credentials: Catch block error');
                }
            },
        }),
    ],
    pages: {
        signIn: '/signin',
        error: '/signin',
    },
    callbacks: {
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.id = token.uid;
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};
