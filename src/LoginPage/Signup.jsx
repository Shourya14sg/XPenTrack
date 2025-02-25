import React, { useState } from 'react';
import axios from 'axios';
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from 'react-router-dom';
import { domain } from '../Constants/Constants';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
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
      const response = await axios.post(`${domain}/users/register/`, {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Failed to create an account. Please try again.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <div 
      className='min-h-screen w-screen flex justify-center items-center p-4'
      style={{ backgroundColor: "#615fff" }}
    >
      <Card className='w-full max-w-lg shadow-2xl flex flex-col space-y-4 py-5 px-16'>
        <Typography variant='h6' component="div">SplitUp</Typography>
        <Typography variant='h4' component="div">Sign Up</Typography>
        
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <FormControl sx={{ marginY: "0.3rem" }} className="w-full">
            <TextField
              id="name"
              type="text"
              label="username"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <FormControl sx={{ marginY: "0.3rem" }} className="w-full">
            <TextField
              id="email"
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>

          <FormControl sx={{ marginY: "0.3rem" }} className="w-full">
            <TextField
              id="password"
              label="Create Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              slotProps={{ htmlInput: { minLength: 8 } }}
            />
          </FormControl>

          <FormControl sx={{ marginY: "0.3rem" }} className="w-full">
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              slotProps={{ htmlInput: { minLength: 8 } }}
            />
          </FormControl>
          <div className='flex justify-center pt-2'>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ width:"10rem", color: "#615fff", boxShadow:"none", backgroundColor:"white", border:"1px solid #615fff", ":hover":{backgroundColor:"#615fff", color:"white", border:"1px solid transparent"}, marginTop: "0.2rem" }}
          >
            Sign Up
          </Button>
          </div>
        </form>

        <Typography
          component={Link}
          to="/login"
          className='text-gray-600 text-sm text-center'
        >
          Already have an account? <span className='font-black hover:underline text-blue-500'>Login</span>
        </Typography>
      </Card>
    </div>
  );
};

export default Signup;
