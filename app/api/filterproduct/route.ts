import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
export const dynamic = 'auto';
import pool from "../../lib/db"; // Import the local MySQL pool configuration


export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const categories = searchParams.getAll("categories[]");
    const colors = searchParams.getAll("colors[]");
    const sizes = searchParams.getAll("size[]");

    const minPrice = parseInt(searchParams.get("price[min]") || "0");
    const maxPrice = parseInt(searchParams.get("price[max]") || "100000");

    const queryParts: string[] = [];
    const queryParams: any[] = [];

    if (categories.length > 0) {
      const categoryQuery = categories.map(() => 'style LIKE ?').join(' OR ');
      queryParts.push(`(${categoryQuery})`);
      categories.forEach(category => queryParams.push(`%${category}%`));
    }

    if (sizes.length > 0) {
      const sizeQuery = sizes.map(() => 'size LIKE ?').join(' OR ');
      queryParts.push(`(${sizeQuery})`);
      sizes.forEach(size => queryParams.push(`%${size}%`));
    }

    if (colors.length > 0) {
      const colorQuery = colors.map(() => 'color LIKE ?').join(' OR ');
      queryParts.push(`(${colorQuery})`);
      colors.forEach(color => queryParams.push(`%${color}%`));
    }

    queryParts.push('price BETWEEN ? AND ?');
    queryParams.push(minPrice, maxPrice);

    const queryString = `
      SELECT * FROM products
      ${queryParts.length > 0 ? 'WHERE ' + queryParts.join(' AND ') : ''}
    `;

    const [products] = await pool.query(queryString, queryParams);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error selecting product", error);
    return NextResponse.error();
  }
}
