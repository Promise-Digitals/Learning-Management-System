import React, { useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const verify = () => {

    const {backendUrl, navigate} = useContext(AppContext)

    const [searchParams, setSearchParams] = useSearchParams()

    const success = searchParams.get('success')
    const purchaseId = searchParams.get('purchaseId')

    const verifyPayment = async () => {
        try {

            const {data} = await axios.post(backendUrl + "/api/users/verifyStripe", {success, purchaseId}, { withCredentials: true })

            if (data.success) {
                navigate('/my-enrollments')
                toast.success("Payment Successful")
            }else{
                navigate('/my-enrollments')
                toast.warn("Payment not successful")
            }
            
        } catch (error) {
            console.log(error)
            toast.error("Operation Failed")
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [])

    return (
        <div>
            
            <div className='min-h-screen flex flex-col items-center justify-center gap-5'>
                <h1 className='w-full text-center text-xl font-bold'>Payment Verification...</h1>
            <div className='w-12 sm:w-16 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin'></div>
        </div>
        </div>
    )
}

export default verify
