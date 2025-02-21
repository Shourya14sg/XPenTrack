import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Appbar from './Appbar.jsx'
import LandingContent from './LandingContent.jsx'

const LandingPage = () => {
    const navigate=useNavigate();
    useEffect(() => {
            const userData = JSON.parse(sessionStorage.getItem('user_data'));
            if (userData?.access && userData?.refresh) {
                navigate('/dashboard', { replace: true }); 
            }
        }, []);
    return (
        <>
            <Appbar/>
            <LandingContent/>
        </>
    )
}

export default LandingPage
