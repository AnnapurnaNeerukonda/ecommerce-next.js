import { NextResponse } from "next/server";
import pool from "../../lib/db"; // Import the local MySQL pool configuration
import type { RowDataPacket } from 'mysql2/promise';

export async function GET(request: Request) {
    try {
        // Execute a raw SQL query to fetch all distinct colors from the products table
        const [rows]: [RowDataPacket[], any] = await pool.query('SELECT DISTINCT color FROM products');

        // Extract the colors from the query result
        const allColors = rows.map((row) => row.color);

        // Return the colors as JSON response
        return NextResponse.json(allColors);
    } catch (error) {
        console.error('Error fetching all colors:', error);
        return NextResponse.error();
    }
}
