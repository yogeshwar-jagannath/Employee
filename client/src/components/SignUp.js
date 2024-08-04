import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    hobbies: '',
    role: 'employee'
  });

  const history = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, gender, hobbies } = formData;
    if (!firstName || !lastName || !email || !password || !gender || !hobbies) {
      alert('All fields are required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Invalid email format');
      return false;
    }
    if (password.length < 8 || password.length > 20) {
      alert('Password must be between 8 and 20 characters');
      return false;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password)) {
      alert('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert('Sign up successful');
      history('/');
    } catch (error) {
      console.error('Sign up error:', error.response.data);
      alert('Sign up failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Hobbies</label>
          <input type="text" name="hobbies" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select name="role" onChange={handleChange} required>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <button type="submit" className="btn">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/">Login</Link></p>
    </div>
  );
};

export default SignUp;