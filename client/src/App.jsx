import React, { useContext } from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CoursesList from './pages/student/CoursesList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Navbar from './components/student/Navbar'
import { AppContext } from './context/AppContext'
import StudentLogin from './components/student/StudentLogin'
import "quill/dist/quill.snow.css";
import { ToastContainer} from 'react-toastify';
import Verify from './pages/student/Verify'

const App = () => {

  const isEducatorRoute = useMatch('/educator/*')

  const { showStudentLogin } = useContext(AppContext)



  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer />

      {
        showStudentLogin && <StudentLogin />
      }

      {!isEducatorRoute && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course-list' element={<CoursesList />} />
        <Route path='/course-list/:input' element={<CoursesList />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/my-enrollments' element={<MyEnrollments />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='/loading/:path' element={<Loading />} />
        <Route path='/educator' element={<Educator />}>
          <Route path='/educator' element={<Dashboard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='student-enrolled' element={<StudentsEnrolled />} />
        </Route>
        <Route path='/verify-stripe' element={<Verify />} />
      </Routes>
    </div>
  )
}

export default App
