import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const Appbar = () => {
    return (
        <>
            <AppBar className='bg-[#0000FF] w-full'>
                <Toolbar className='bg-[#0000FF] flex flex-row justify-between'>
                    <Typography variant="h5" component="div">
                        XPenTrack
                    </Typography>
                    <Button component={Link} to="/login" className='w-16' sx={{ color: "blue", backgroundColor: "white" }}>Login</Button>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Appbar
