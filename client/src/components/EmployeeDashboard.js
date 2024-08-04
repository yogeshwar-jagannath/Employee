import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const history = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employee/data', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setEmployeeData(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        alert('Failed to fetch employee data');
      }
    };

    fetchEmployeeData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    history('/');
  };

  if (!employeeData) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Employee Dashboard</h1>
      <div>
        <h2>Your Information</h2>
        <p>Name: {employeeData.firstName} {employeeData.lastName}</p>
        <p>Email: {employeeData.email}</p>
        <p>Department: {employeeData.department ? employeeData.department.departmentName : 'Not assigned'}</p>
        <p>Category: {employeeData.department ? employeeData.department.categoryName : 'Not assigned'}</p>
      </div>
      <button onClick={handleLogout} className="btn">Logout</button>
    </div>
  );
};

export default EmployeeDashboard;