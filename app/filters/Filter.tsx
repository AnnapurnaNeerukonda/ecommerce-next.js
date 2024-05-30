'use client'
import React, { useState, useEffect } from 'react';
import { BsSliders2Vertical, BsChevronUp } from "react-icons/bs";
import axios from 'axios';

type Props = {
    selectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    selectedSize: string[];
    setSelectedSize: React.Dispatch<React.SetStateAction<string[]>>;
    allHexValues: string[];
    setAllHexValues: React.Dispatch<React.SetStateAction<string[]>>;
    selectedHexValues: string[];
    setSelectedAllHexValues: React.Dispatch<React.SetStateAction<string[]>>;
    price: { min: number; max: number };
    setPrice: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
};

const Filter = (props: Props) => {
    const [showFilter, setShowFilter] = useState<boolean>(false);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.name === "min" ? parseInt(e.target.value) : e.target.value;
        props.setPrice({
            ...props.price,
            [e.target.name]: value
        });
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.name === "max" ? parseInt(e.target.value) : e.target.value;
        props.setPrice({
            ...props.price,
            [e.target.name]: value
        });
    };

    const toggleCategory = (category: string) => {
        props.setSelectedCategories((prevCategories) =>
            prevCategories.includes(category)
                ? prevCategories.filter((c) => c !== category)
                : [...prevCategories, category]
        );
    };

    const toggleSize = (size: string) => {
        props.setSelectedSize((prevSize) =>
            prevSize.includes(size)
                ? prevSize.filter((c) => c !== size)
                : [...prevSize, size]
        );
    };

    const toggleColor = (color: string) => {
        props.setSelectedAllHexValues((prevColor) =>
            prevColor.includes(color)
                ? prevColor.filter((c) => c !== color)
                : [...prevColor, color]
        );
    };

    const getAllColors = async () => {
        try {
            const response = await axios.get('/api/color');
            console.log("Colors:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error", error);
            return null;
        }
    };
    
    useEffect(() => {
        getAllColors().then((allColors) => {
            if (allColors) {
                const hexSet = new Set<string>();
                allColors.forEach((colorString: string) => { // Iterate over color strings
                    const colors = colorString.split(','); // Split color string by comma
                    colors.forEach((color: string) => {
                        const hexValue = color.replace("#", "").trim(); // Remove "#" and whitespace
                        hexSet.add(hexValue);
                    });
                });
                const uniqueHexValues: string[] = Array.from(hexSet);
                props.setAllHexValues(uniqueHexValues);
            }
        });
    }, []);
    

    const allHexValue = props.allHexValues;
    console.log("allHexValue",allHexValue)
    return (
        <div className='relative'>
            <div className={`md:w-[250px] border-l-[0.5px] border-r-[0.5px] ${showFilter ? "max-md:w-[250px]" : "w-0 max-md:invisible"}`}>
                <div className='flex items-center justify-between px-5 py-4 border-b-[0.5px]'>
                    <h1 className='text-neutral-800'>Filters</h1>
                    <BsSliders2Vertical size={20} className='text-neutral-600' />
                </div>
                <div className='flex flex-col py-3 pb-5 text-sm text-neutral-600 border-b-[0.5px]'>
                    {['Blouses', 'Shirt', 'Denim&Jeans', 'Party', 'Pants', 'Skirts', 'Tops&tees', 'Jackets&Coats'].map((category) => (
                        <span
                            key={category}
                            className={`py-3 px-5 ${props.selectedCategories.includes(category) ? "bg-purple-50" : ""}`}
                            onClick={() => toggleCategory(category)}
                        >
                            {category}
                        </span>
                    ))}
                </div>
                <div className='border-b-[0.5px] pb-10'>
                    <div className='flex items-center justify-between px-5 py-4 border-b-[0.5px] mb-5'>
                        <h1 className='text-neutral-800'>Prices</h1>
                        <BsChevronUp size={18} className='text-neutral-600' />
                    </div>
                    <div className='grid grid-cols-2 gap-5 px-5 overflow-hidden'>
                        <div className='flex flex-col justify-center items-center'>
                            <label htmlFor="min" className='text-[15px] opacity-75'>Min</label>
                            <div className='relative'>
                                <span className='absolute left-3 top-1'>$</span>
                                <input className='w-full outline-none border-[1px] rounded-lg px-2 text-center py-[2px]' type="number" name="min" onChange={handleMinChange} value={props.price.min} id="min" />
                            </div>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <label htmlFor="max" className='text-[15px] opacity-75'>Max</label>
                            <div className='relative'>
                                <span className='absolute left-3 top-1'>$</span>
                                <input className='w-full outline-none border-[1px] rounded-lg px-2 text-center py-[2px]' type="number" name="max" onChange={handleMaxChange} value={props.price.max} id="max" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='border-b-[0.5px]'>
                    <div className='flex items-center justify-between px-5 py-4 border-b-[0.5px] mb-5'>
                        <h1 className='text-neutral-800'>Colors</h1>
                    </div>
                    <ul className='grid grid-cols-4 px-5 gap-5 mb-4'>
                        {allHexValue.map((hexValue, index) => (
                            <li
                                key={index}
                                className={`w-[40px] h-[40px] rounded-2xl border-[0.5px] border-neutral-300 cursor-pointer ${props.selectedHexValues.includes(`#${hexValue}`) ? "shadow-2xl opacity-25" : ""}`}
                                style={{ backgroundColor: `#${hexValue}` }}
                                onClick={() => toggleColor(`#${hexValue}`)}
                            ></li>
                        ))}
                    </ul>
                </div>
                <div className='sizes'>
                    <div className='flex items-center justify-between px-5 py-4 border-b-[0.5px] mb-5'>
                        <h1 className='text-neutral-800'>Sizes</h1>
                    </div>
                    <ul className='grid grid-cols-4 px-5 gap-5'>
                        {['SM', 'MD', 'XL', '2XL', '3XL', '4XL'].map((size) => (
                            <li
                                key={size}
                                className={`border-[0.5px] rounded-lg text-center text-[14px] py-[2px] cursor-pointer ${props.selectedSize.includes(size) ? 'bg-neutral-900 text-white' : ''}`}
                                onClick={() => toggleSize(size)}
                            >
                                {size}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div onClick={() => setShowFilter(!showFilter)} className='absolute md:hidden top-[20px] right-[-42px] rotate-90 bg-gray-100 px-2 rounded-t-sm cursor-pointer'>
                Filters
            </div>
        </div>
    );
};

export default Filter;
