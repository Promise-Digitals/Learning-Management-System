import React, { useContext } from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

    const educatorData = dummyEducatorData;

    const { isLoggedIn, setIsLoggedIn, backendUrl, navigate, userData, setUserData } = useContext(AppContext)

    const handleLogout = async () => {
        try {
            await axios.get(backendUrl + "/api/auth/logout", { withCredentials: true })

            setUserData(false)
            setIsLoggedIn(false)
            navigate('/')
            toast.success("Successfully logged out")

        } catch (error) {
            toast.error("Something went wrong")
        }
    }


    return (
        <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3' >
            <Link to='/'>
                <img src={assets.logo} className='w-22 lg:w-26 cursor-pointer'  alt="" />
            </Link>
            <div className='flex items-center gap-5 text-gray-600'>
                {/* promise to be changed to user.fullname after backend */}
                <p>Hi {isLoggedIn ? userData.name : 'Developers'}</p>
                <div>
                {
                    isLoggedIn ?
                        <div className='relative group'>
                            <img src={userData.image} className='w-8 h-8 rounded-full  border-3 border-[#1269e2] object-cover object-center' alt="" />

                            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
                                <ul className='list-none m-0 p-1 bg-white rounded-md border border-gray-300 text-sm'>
                                    <li className='py-1 px-2 cursor-pointer pr-8' onClick={handleLogout}>Logout</li>
                                </ul>
                            </div>
                        </div>

                        :       
                        <img className='max-w-8' src={assets.profile_img} />
                }
                </div>
            </div>
        </div>
    )
}

export default Navbar
