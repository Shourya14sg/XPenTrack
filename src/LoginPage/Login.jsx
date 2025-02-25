import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Card, FormControl, TextField, Typography, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { domain } from '../Constants/Constants';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('user_data'));
        if (userData?.access && userData?.refresh) {
            navigate('/dashboard', { replace: true });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
            const response = await axios.post(`${domain}/users/login/`, {
                email,
                password
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
    
            sessionStorage.setItem('user_data', JSON.stringify(response.data));
            navigate('/dashboard', { replace: true });
        } catch (error) {
            // Extract error message correctly
            if (error.response && error.response.data) {
                setError(error.response.data.non_field_errors?.[0] || error.response.data.detail);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };
    

    return (
        <div 
            className='min-h-screen w-screen flex justify-center items-center p-4'
            style={{ backgroundColor: "#615fff" }}
        >
            <Card className='w-full max-w-sm sm:max-w-md md:max-w-lg px-12 sm:p-20 shadow-2xl flex flex-col items-center gap-4'>
                <Typography variant='h6' component="div" className="text-center">SplitUp</Typography>
                <Typography variant='h4' component="div" className="text-center">Sign In</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <FormControl sx={{ marginBottom: "0.8rem" }} className="w-full">
                        <TextField
                            label="Email"
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                        />
                    </FormControl>

                    <FormControl sx={{ marginBottom: "0.8rem" }} className="w-full">
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ width: "10rem", alignSelf: "center", color: "#615fff", boxShadow: "none", backgroundColor: "white", border: "1px solid #615fff", ":hover": { backgroundColor: "#615fff", color: "white", border: "1px solid transparent" }, marginTop: "0.2rem" }}
                    >
                        Sign in
                    </Button>
                </Box>

                <Typography
                    component={Link}
                    to="/signup"
                    className='text-gray-600 text-sm text-center'
                >
                    Don't have an account? <span className='text-black hover:underline'>Sign up</span>
                </Typography>
            </Card>
        </div>
    );
};

export default Login;
