import React from 'react';
import Link from 'next/link';
import pool from "../../lib/db";
import type { RowDataPacket } from 'mysql2/promise';

type Props = {};

const parseImages = (images: string) => {
    try {
        const parsed = JSON.parse(images);
        // Check if parsed result is an array
        if (Array.isArray(parsed)) {
            return parsed;
        } else if (typeof parsed === 'string') {
            // If it's a string, split by commas (handling cases where it's a single string)
            return parsed.split(',').map((url) => url.trim());
        } else {
            return [];
        }
    } catch (e) {
        // If JSON.parse fails, fallback to treating it as a comma-separated string
        return images.split(',').map((url) => url.trim());
    }
};

const Item = async (props: Props) => {
    let products: any[] = [];
    try {
        const [rows]: [RowDataPacket[], any] = await pool.query('SELECT * FROM products');
        products = rows;
    } catch (error) {
        console.error('Error fetching products:', error);
        return <div>Error fetching products</div>;
    }

    if (products.length === 0) {
        return <div>empty</div>;
    }

    return (
        <div>
            <h1 className='py-3 text-xl'>Clothing</h1>
            <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-20 gap-12'>
                {products.map((product) => (
                    <div key={product.id}>
                        <Link href={`/dashboard/${product.id}`}>
                            <div className='relative rounded-lg'>
                                {parseImages(product.images).map((image: string, index: number) => (
                                    <img 
                                        key={index}
                                        src={image.trim()} 
                                        className='w-[250px] h-[300px] object-cover object-top rounded-lg' 
                                        alt={product.title} 
                                    />
                                ))}
                            </div>
                            <div className='flex items-center justify-between mt-4'>
                                <div>
                                    <h1 className='text-[14px] font-medium max-w-[150px] whitespace-nowrap overflow-hidden'>
                                        {product.title}
                                    </h1>
                                    <p className='text-[13px] opacity-60'>{product.store}</p>
                                </div>
                                <span className='px-2 font-medium bg-gray-100 rounded-lg'>${product.price}.00</span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Item;
