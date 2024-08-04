import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DepartmentForm from './DepartmentForm';
import DepartmentList from './DepartmentList';

const ManagerDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const history = useNavigate();

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, [currentPage]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/manager/departments?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDepartments(response.data.departments);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching departments:', error);
      alert('Failed to fetch departments');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/manager/employees', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Failed to fetch employees');
    }
  };

  const handleCreateDepartment = async (departmentData) => {
    try {
      await axios.post('http://localhost:5000/api/manager/departments', departmentData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDepartments();
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Failed to create department');
    }
  };

  const handleUpdateDepartment = async (id, departmentData) => {
    try {
      await axios.put(`http://localhost:5000/api/manager/departments/${id}`, departmentData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDepartments();
    } catch (error) {
      console.error('Error updating department:', error);
      alert('Failed to update department');
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/manager/departments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Failed to delete department');
    }
  };

  const handleAssignEmployees = async (departmentId, employeeIds) => {
    try {
      await axios.post(`http://localhost:5000/api/manager/departments/${departmentId}/assign`, { employeeIds }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDepartments();
    } catch (error) {
      console.error('Error assigning employees:', error);
      alert('Failed to assign employees');
    };
}

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      history('/');
    };
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };
  
    return (
      <div className="dashboard">
        <h1>Manager Dashboard</h1>
        <DepartmentForm onSubmit={handleCreateDepartment} />
        <DepartmentList
          departments={departments}
          employees={employees}
          onUpdate={handleUpdateDepartment}
          onDelete={handleDeleteDepartment}
          onAssign={handleAssignEmployees}
        />
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>{currentPage} of {totalPages}</span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
        <button onClick={handleLogout} className="btn">Logout</button>
      </div>
    );
  };
  
  export default ManagerDashboard