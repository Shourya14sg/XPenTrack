import { useEffect, useState } from 'react'
import './App.css'
import { Navigate, Route ,Routes } from 'react-router-dom'
import Login from './LoginPage/Login.jsx'
import Signup from './LoginPage/Signup.jsx'
import {Dashboard} from './Pages/Dashboard.jsx'
import LandingPage from './LandingPage/LandingPage.jsx'


function App() {

  const checkauth = () => {
    const user_data = JSON.parse(sessionStorage.getItem('user_data'))
    const refreshToken = user_data?.refresh;
    const accessToken = user_data?.access;
    return refreshToken && accessToken;
  } 

  const ProtectedRoute = ({ element }) => {
    return checkauth() ? element : <Navigate to="/login" replace />;
  };

  return (
    <div className='overflow-hidden'>
      <Routes>
        <Route path='/' element={<LandingPage/>} ></Route>
        <Route path='/login' element={<Login/>} ></Route>
        <Route path='/signup' element={<Signup/>} ></Route>
        <Route path='/dashboard/*' element={<ProtectedRoute element={<Dashboard/>}/>} ></Route>
      
      </Routes>
      </div>
  )
}
const logout=()=>{
  sessionStorage.removeItem("user_data")
  return <Navigate to="/login" replace />
};
export default App
