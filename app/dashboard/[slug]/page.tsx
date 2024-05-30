import React, { useEffect, useState } from 'react';
import pool from '../../lib/db';
import ImageGallery from '../ImageGallery';
import Info from '../Info';
import Review from '@/app/components/Review';
import ReviewSection from '../ReviewSection';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

interface Product {
  id: number;
  name: string;
  category: string;
  style: string;
  store: string;
  color: string;
  description: string;
  images: string;
}

interface Review {
  id: number;
  rating: number;
  // Add other properties of Review as needed
}

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

export default function Page({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [allReview, setAllReview] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const productId = parseInt(params.slug, 10);
      const session = await getServerSession(options);
      const userId = session?.user.id;
      setCurrentUserId(userId);

      try {
        // Fetch product
        const productQuery = `SELECT * FROM Products WHERE id = ?`;
        const [productResult] = await pool.query<Product[]>(productQuery, [productId]);
        setProduct(productResult[0]);

        // Fetch reviews
        const reviewQuery = `SELECT * FROM Review WHERE productId = ?`;
        const [reviewResult] = await pool.query<Review[]>(reviewQuery, [productId]);
        setAllReview(reviewResult);
        calculateAverageRating(reviewResult);
        
        // Fetch user data
        const credentials = { email: session?.user.email, password: '' }; // Assuming you have user credentials
        console.log('Querying database for user:', credentials.email);
        const [rows]: [RowDataPacket[], any] = await pool.query(
          'SELECT * FROM users WHERE email = ?',
          [credentials.email]
        );

        // Now `rows` contains the result of the SELECT query
        // You can access individual rows in the result array and access their properties
        if (rows.length > 0) {
          const user = rows[0]; // Accessing the first row, assuming there's only one user per email

          // Now you can access user properties like user.id, user.name, etc.
          console.log('User found:', user);
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [params.slug]);

  const calculateAverageRating = (reviews: Review[]) => {
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const avgRating = totalRating / reviews.length;
      setAverageRating(avgRating);
    }
  };
  
  return (
    <div className='max-w-[1280px] mx-auto px-5 py-5'>
      <div className='font-semibold text-2xl mb-2'>
        <a href='/'>SEINE</a>
      </div>
      <hr />
      {product && (
        <div className='grid grid-cols-2 mt-10 gap-14'>
          <ImageGallery imageUrls={product.images} />
          <Info {...product} rating={averageRating} numbercomments={allReview.length} />
        </div>
      )}
      <div className='mb-20 mt-20'>
        <div className='flex items-center space-x-5 mb-10'>
          <span className='w-[5px] h-[30px] bg-purple-600 rounded-full inline-block'></span>
          <span className='font-medium text-xl'>Product Description</span>
        </div>
        {product && (
          <div className='grid grid-cols-2'>
            <div className='fles flex-col justify-center'>
              <div className='grid grid-cols-3 gap-5 mb-5'>
                <div>
                  <h3 className='font-medium'>Category</h3>
                  <p className='text-sm text-purple-500'>{product.category}</p>
                </div>
                <div>
                  <h3 className='font-medium'>Dress Style</h3>
                  <p className='text-sm text-purple-500'>{product.style}</p>
                </div>
                <div>
                  <h3 className='font-medium'>Store</h3>
                  <p className='text-sm text-purple-500'>{product.store}</p>
                </div>
              </div>
              <div
                style={{ borderColor: `{${product.color.split(',').pop()}}` }}
                className={`leading-6 text-sm text-neutral-700 h-[200px] border-[1px] rounded-md p-4 overflow-scroll`}
                dangerouslySetInnerHTML={{ __html: product?.description }}
              ></div>
            </div>
            <div className='flex justify-end relative items-center'>
              <img src={product.images.split(',').pop()} className='max-h-[300px] w-10/12 rounded-lg object-cover' alt='' />
              <span className='text-sm absolute bottom-2 right-2 text-white font-medium'>{product.title}</span>
            </div>
          </div>
        )}
      </div>
      <div className='mt-20 mb-20'>
        <div className='flex items-center space-x-5 mb-10'>
          <span className='w-[5px] h-[30px] bg-purple-600 rounded-full inline-block'></span>
          <span className='font-medium text-xl'>Comment & Review Section</span>
        </div>
        <div className='grid grid-cols-2'>
          <div>
            {allReview.map((review, index) => (
              <div key={review.id} className='mb-5'>
                <h1 className='mb-2 font-medium'>Comment: {index + 1}</h1>
                <ReviewSection {...review} />
              </div>
            ))}
          </div>
          <Review productId={product?.id} userId={currentUserId} />
        </div>
      </div>
    </div>
  );
}
