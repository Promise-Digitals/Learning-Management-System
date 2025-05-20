import { createContext, useEffect, useState } from 'react';
import { dummyCourses } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import humanizeDuration from 'humanize-duration'
import axios from 'axios'
import { toast } from 'react-toastify'


export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [userData, setUserData] = useState(false)

    const navigate = useNavigate()

    const [allCourses, setAllCourses] = useState([])

    const [isEducator, setIsEducator] = useState(true)

    const [enrolledCourses, setEnrolledCourses] = useState([])

    const [showStudentLogin, setShowStudentLogin] = useState(false)

    const [isLoggedIn, setIsLoggedIn] = useState(false)


    // Fetch all courses
    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/course/all', { withCredentials: true })

            if (data.success) {
                setAllCourses(data.courses)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const fetchAuthenticatedUser = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/users/user', { withCredentials: true })
            if (data.success) {
                setUserData(data.user)
                setIsLoggedIn(true)
                setIsEducator(data.user.isEducator)
            }
        } catch (error) {
            console.log(error)
            setIsLoggedIn(false)
        }
    }


    // Function to calculate average rating of course
    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0
        }

        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })

        return Math.floor(totalRating / course.courseRatings.length)
    }


    // Function to calculate course chapter time
    const calculateChapterTime = (chapter) => {
        let time = 0
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }


    // Function to calculate the course duration
    const calculateCourseDuration = (course) => {
        let time = 0

        course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration))

        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }


    // Function to calculate number of lectures in the course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;

        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length
            }
        });
        return totalLectures;
    }


    // Fetch User Enrolled Courses
    const fetchUserEnrolledCourses = async () => {
        try {

            const { data } = await axios.get(backendUrl + "/api/users/enrolled-courses", { withCredentials: true })

            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            // toast.error(error.message)
        }
    }


    useEffect(() => {
        fetchAllCourses()
    }, [])


    useEffect(() => {
        fetchAuthenticatedUser()
        fetchUserEnrolledCourses()
    }, [userData])


    const value = {
        showStudentLogin, setShowStudentLogin,
        isLoggedIn, setIsLoggedIn,
        currency,
        allCourses,
        navigate,
        calculateRating,
        isEducator, setIsEducator,
        calculateChapterTime,
        calculateCourseDuration,
        calculateNoOfLectures,
        enrolledCourses,
        fetchUserEnrolledCourses,
        backendUrl,
        userData, setUserData,
        fetchAuthenticatedUser,
        fetchAllCourses
    }


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}