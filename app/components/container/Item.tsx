import React from 'react';
import { AiOutlineHeart } from "react-icons/ai";
import Link from 'next/link';
import pool from "../../lib/db"; // Import the local MySQL pool configuration
import type { RowDataPacket } from 'mysql2/promise';

type Props = {};

const Item = async (props: Props) => {
    let products: any[] = [];
    try {
        // Query the database to get all products
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
                                {product.images.split(',').map((image: string, index: number) => (
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
