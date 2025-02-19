import React, { useState } from 'react';
import { Box, Button, Card, FormControl, FormLabel, TextField, Typography, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                sessionStorage.setItem('user_data', JSON.stringify(data));
                
                navigate('/dashboard');
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch (error) {
            setError('Something went wrong. Please try again later.');
        }
    };

    return (
        <div 
            className='min-h-screen w-screen flex justify-center items-center p-4'
            style={{ backgroundImage: "conic-gradient(from 45deg, #C5BAFF, #C4D9FF, #E8F9FF, #C5BAFF)" }}
        >
            <Card className='w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 shadow-2xl flex flex-col gap-4'>
                <Typography variant='h6' component="div" className="text-center">👍FinMan</Typography>
                <Typography variant='h4' component="div" className="text-center">Sign In</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <FormControl sx={{ marginBottom: "0.8rem" }} className="w-full">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                        />
                    </FormControl>

                    <FormControl sx={{ marginBottom: "0.8rem" }} className="w-full">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Your Password"
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
                        sx={{ marginBottom: "0.8rem", color: "white", backgroundColor: "#262424", "&:hover": { backgroundColor: "#1f1f1f" } }}
                    >
                        Sign in
                    </Button>
                </Box>

                <Typography
                    component="button"
                    type="button"
                    className='text-gray-600 hover:underline text-sm text-center'
                >
                    Forgot your password?
                </Typography>

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
}

export default Login;
