import React, { useState } from 'react';
import { Button, Card, FormControl, FormLabel, TextField, Typography, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form Validation
  const validateForm = () => {
    const { name, email, phone, password, confirmPassword } = formData;
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError('');
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Failed to create an account. Please try again.');
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
      <Card className='w-full max-w-lg shadow-2xl flex flex-col space-y-4 py-5 px-16'>
        <Typography variant='h6' component="div">👍FinMan</Typography>
        <Typography variant='h4' component="div">Sign Up</Typography>
        
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <FormControl sx={{ marginY: "0.3rem" }} className="w-full">
            <FormLabel htmlFor="name">Full Name</FormLabel>
            <TextField
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <FormControl sx={{ marginY: "0.3rem" }} className="w-full">
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <FormControl sx={{ marginY: "0.3rem" }} className="w-full">
            <FormLabel htmlFor="phone">Phone No.</FormLabel>
            <TextField
              id="phone"
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <FormControl sx={{ marginY: "0.3rem" }} className="w-full">
            <FormLabel htmlFor="password">Create Password</FormLabel>
            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <FormControl sx={{ marginY: "0.3rem" }} className="w-full">
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <TextField
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ color: "white", backgroundColor: "#262424", marginTop: "0.2rem" }}
          >
            Sign Up
          </Button>
        </form>

        <Typography
          component={Link}
          to="/login"
          className='text-gray-600 text-sm text-center'
        >
          Already have an account? <span className='text-black hover:underline'>Login</span>
        </Typography>
      </Card>
    </div>
  );
};

export default Signup;
