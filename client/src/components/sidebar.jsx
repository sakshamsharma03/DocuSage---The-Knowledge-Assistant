import React, { useState, useEffect, useContext } from 'react';
import { FaMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";
import PdfReader from './PdfReader';
import { ThemeContext } from '../context/theme';


const SideBar = () => {
    const {theme, toggleTheme} = useContext(ThemeContext); // 'light' or 'dark'

   

    return (
        <div className={`p-[18px] flex flex-col justify-between h-screen w-[400px] ${theme === 'light' ? 'bg-slate-100 text-black' : 'bg-gray-900 text-white'}`}>
            <div className='flex justify-between items-center tracking-tighter   outline-none '>
                <h1 className='text-[26px]'>DocuSage</h1>
                
                <button onClick={toggleTheme}>
                    {theme === 'light' ? <FaMoon /> : <GoSun />}
                </button>
            </div>
            <div className='my-20 mx-20'>
            <PdfReader />
             </div>
        </div>
    )
}

export default SideBar;
