import { NextResponse } from "next/server";
import pool from "../../lib/db"; // Import the local MySQL pool configuration
import type { ResultSetHeader } from 'mysql2/promise';

export async function POST(request: Request) {
    const body = await request.json();
    const {
        title,
        description,
        category,
        style,
        size,
        inventory,
        color,
        price,
        images,
        userId,
        store
    } = body;

    try {
        const [result]: [ResultSetHeader, any] = await pool.query(
            'INSERT INTO products (title, description, category, style, size, inventory, color, price, images, userId, store) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, category, style, size, inventory, color, price, JSON.stringify(images), userId, store]
        );

        const product = {
            id: result.insertId,
            title,
            description,
            category,
            style,
            size,
            inventory,
            color,
            price,
            images,
            userId,
            store
        };

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error creating the product', error);
        return NextResponse.error();
    }
}
