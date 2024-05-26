// lib/options.ts
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import type { RowDataPacket } from "mysql2";

interface DatabaseUser extends RowDataPacket {
    id: number;
    name: string;
    email: string;
    password: string;
}

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "your email" },
                password: { label: "Password", type: "password", placeholder: "your password" },
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    return null;
                }

                const { email, password } = credentials;

                if (!email || !password) {
                    return null;
                }

                const [rows] = await pool.query<DatabaseUser[]>(
                    "SELECT * FROM users WHERE email = ?",
                    [email]
                );

                const user = rows[0];

                if (!user || !user.password) {
                    return null;
                }

                const isCorrectPassword = await bcrypt.compare(password, user.password);

                if (!isCorrectPassword) {
                    return null;
                }

                const { password: _, ...userWithoutPassword } = user;

                return userWithoutPassword as User;
            },
        }),
    ],
    pages: {
        signIn: "/signin",
        error: "/signin",
    },
    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.uid;
            }
            return session;
        },
        async jwt({ user, token }) {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};
