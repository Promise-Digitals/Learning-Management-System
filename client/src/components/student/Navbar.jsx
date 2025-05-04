import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const Navbar = () => {

    const isCourseListPage = location.pathname.includes('/course-list')

    const { setShowStudentLogin, isLoggedIn, setIsLoggedIn, navigate, isEducator} = useContext(AppContext)

    const handleLogout = async () => {
        setIsLoggedIn(false)
        setShowStudentLogin(false)
        navigate('/')
    }


    return (
        <div className={`flex items-center justify-between px-4 sm:px-10 text-sm md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? "bg-white" : "bg-cyan-100/70"} `}>
            <img src={assets.logo} onClick={() => navigate('/')}  alt="" className='w-24 lg:w-28 cursor-pointer' />

            <div className='hidden md:flex items-center gap-5 text-gray-600'>
                <div className='flex items-center gap-2'>
                    {
                        isLoggedIn &&
                        <>
                            <button onClick={() => {navigate('/educator')}}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
                            |
                            <Link to="/my-enrollments">My Enrollments</Link>
                        </>
                    }

                </div>
                {
                    isLoggedIn ?
                        <div className='relative group'>
                            <div className='w-7 h-7 rounded-full border-2 border-[#1269e2] flex items-center justify-center'>P</div>

                            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
                                <ul className='list-none m-0 p-1 bg-white rounded-md border border-gray-300 text-sm'>
                                    <li className='py-1 px-2 cursor-pointer pr-8' onClick={handleLogout}>Logout</li>
                                </ul>
                            </div>
                        </div>

                        :
                        <button onClick={() => setShowStudentLogin(true)} className='bg-[#1e69e2] text-white px-5 py-2.5 rounded-full'>Create Account</button>
                }
            </div>

            {/* For Phone screens */}
            <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-600'>
                <div>
                    <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
                        {
                            isLoggedIn &&
                            <>
                                <button onClick={() => {navigate('/educator')}}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
                                |
                                <Link to="/my-enrollments">Enrollments</Link>
                            </>
                        }

                        {
                            isLoggedIn ?
                                <div className='relative group'>
                                    <div className='w-8 h-8 rounded-full border-2 border-[#1269e2] flex items-center justify-center'>P</div>

                                    <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
                                        <ul className='list-none m-0 p-1 bg-white rounded-md border border-gray-300 text-sm'>
                                            <li className='py-1 px-2 cursor-pointer pr-8' onClick={handleLogout}>Logout</li>
                                        </ul>
                                    </div>
                                </div>
                                :
                                <button onClick={() => setShowStudentLogin(true)}><img className='w-7' src={assets.user_icon} alt="" /></button>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
