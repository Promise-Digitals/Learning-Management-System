import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'

const Login = () => {

    const { setShowStudentLogin, setIsLoggedIn, backendUrl, fetchAuthenticatedUser } = useContext(AppContext)

    const [state, setState] = useState('Login')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const [image, setImage] = useState(false)

    const [isTextDataSubmited, setIsTextDataSubmited] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (state === "Sign Up" && !isTextDataSubmited) {
            return setIsTextDataSubmited(true)
        }

        try {

            if (state === "Login") {
                
                const {data} = await axios.post(backendUrl + '/api/auth/login', {email, password}, { withCredentials: true })

                if (data.success) {
                    setShowStudentLogin(false)
                    fetchAuthenticatedUser()
                    toast.success("You're successfully logged in")
                }else{
                    setIsLoggedIn(false)
                    toast.error(data.message)
                }
            }else{
                const formData = new FormData()

                formData.append('name', name)
                formData.append('password', password)
                formData.append('email', email)
                formData.append('image', image)

                const { data } = await axios.post(backendUrl + "/api/auth/register", formData, { withCredentials: true })

                if (data.success) {
                    setShowStudentLogin(false)
                    fetchAuthenticatedUser()
                    toast.success("Registered, login to continue")
                }else{
                    setIsLoggedIn(false)
                    toast.error(data.message)
                }
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(() => {
        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = "unset"
        }
    }, [])


    return (
        <div>
            <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>

                <div className='relative bg-white p-10 rounded-xl text-slate-500'>
                    <h1 className='text-center text-xl text-neutral-700 font-semibold'>Student {state}</h1>
                    <p className='text-sm'>Welcome back! Please <span className='lowercase'>{state}</span> to continue</p>

                    <a href='http://localhost:5000/auth/google' className='w-full border flex items-center justify-center gap-2 py-2 rounded-full text-sm mt-4'><img className='w-4' src={assets.google_icon} alt="" />{state} with Google</a>

                    <p className='text-center mt-2 mb-2'>or</p>

                    <form onSubmit={onSubmitHandler}>
                        {state === "Sign Up" && isTextDataSubmited ?
                            <>
                                <div className='flex items-center gap-4 my-10'>
                                    <label htmlFor="image">
                                        <img className='w-16 rounded-full' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                                        <input onChange={e => setImage(e.target.files[0])} type="file" name="" id="image" hidden />
                                    </label>

                                    <p>Upload Profile image</p>
                                </div>
                            </>
                            :
                            <>
                                {state !== 'Login' &&
                                    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                        <img src={assets.person_icon} alt="" />
                                        <input className='outline-none text-sm' onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Student Name' required />
                                    </div>
                                }

                                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                    <img src={assets.email_icon} alt="" />
                                    <input className='outline-none text-sm' onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='Email Id' required />
                                </div>
                                <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                    <img src={assets.lock_icon} alt="" />
                                    <input className='outline-none text-sm' onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required />
                                </div>
                            </>}

                        {state === "Login" && <p className='text-sm text-[#1e69e2] mt-4 cursor-pointer'>Forgot Password?</p>}

                        <button type='submit' className='bg-[#1e69e2] text-sm w-full py-2 rounded-full text-white mt-4'>
                            {state === 'Login' ? 'Login' : isTextDataSubmited ? 'Create Account' : 'Next'}
                        </button>

                        {
                            state === 'Login' ? <p className='mt-5 text-center text-sm'>Don't have an account <span className='text-[#1e69e2] cursor-pointer' onClick={e => setState('Sign Up')}>Sign Up</span></p>
                                :
                                <p className='mt-5 text-center text-sm'>Already have an account <span className='text-[#1e69e2] cursor-pointer' onClick={e => setState('Login')}>Login</span></p>
                        }

                        <img onClick={e => setShowStudentLogin(false)} className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt="" />

                    </form>

                </div>
            </div>
        </div>
    )
}

export default Login
