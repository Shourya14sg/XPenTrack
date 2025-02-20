import { useEffect, useState } from 'react'
import './App.css'
import { Navigate, Route ,Routes } from 'react-router-dom'
import Login from './LoginPage/Login.jsx'
import Signup from './LoginPage/Signup.jsx'
import { Dashboard } from './Pages'
import LandingPage from './LandingPage/LandingPage.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user_data = JSON.parse(sessionStorage.getItem('user_data'))
    const refreshToken = user_data?.refresh;
    const accessToken = user_data?.access;
    if (refreshToken && accessToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); 

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" replace />;
  };

  return (
      <Routes>
        <Route path='/' element={<LandingPage/>} ></Route>
        <Route path='/login' element={<Login/>} ></Route>
        <Route path='/signup' element={<Signup/>} ></Route>
        <Route path='/dashboard' element={<ProtectedRoute element={<Dashboard/>}/>} ></Route>
      </Routes>
  )
}

export default App
