import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '../../../lib/db';
import bcrypt from 'bcrypt';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

interface RequestBody {
    name: string;
    email: string;
    password: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body: RequestBody = await request.json();
    const { name, email, password } = body;

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        // Insert the new user into the database
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        const user: User = {
            id: result.insertId,
            name,
            email,
        };

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error inserting user:', error);
        return NextResponse.json({ error: 'Error inserting user' }, { status: 500 });
    }
}
