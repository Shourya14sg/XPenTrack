import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const Appbar = () => {
    return (
        <>
            <AppBar className='bg-indigo-600 w-full'>
                <Toolbar className='bg-indigo-600 flex flex-row justify-between'>
                    <Typography variant="h5" component="div">
                        FinMan
                    </Typography>
                    <div className='flex w-2xl justify-evenly'>
                        <h4>Home</h4>
                        <h4>About</h4>
                        <h4>Feedback</h4>
                    </div>
                    <Button component={Link} to="/login" className='w-16' sx={{ color: "blue", backgroundColor: "white" }}>Login</Button>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Appbar
