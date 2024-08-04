import React, { useState } from 'react';
import DepartmentForm from './DepartmentForm';

const DepartmentList = ({ departments, employees, onUpdate, onDelete, onAssign }) => {
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [assigningDepartment, setAssigningDepartment] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const handleEdit = (department) => {
    setEditingDepartment(department);
  };

  const handleUpdate = (updatedData) => {
    onUpdate(editingDepartment._id, updatedData);
    setEditingDepartment(null);
  };

  const handleAssign = (department) => {
    setAssigningDepartment(department);
    setSelectedEmployees([]);
  };

  const handleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleAssignSubmit = () => {
    onAssign(assigningDepartment._id, selectedEmployees);
    setAssigningDepartment(null);
  };

  return (
    <div>
      <h2>Departments</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Department Name</th>
            <th>Category Name</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(department => (
            <tr key={department._id}>
              <td>{department.departmentName}</td>
              <td>{department.categoryName}</td>
              <td>{department.location}</td>
              <td>{department.salary}</td>
              <td>
                <button onClick={() => handleEdit(department)} className="btn">Edit</button>
                <button onClick={() => onDelete(department._id)} className="btn">Delete</button>
                <button onClick={() => handleAssign(department)} className="btn">Assign Employees</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingDepartment && (
        <DepartmentForm
          initialData={editingDepartment}
          onSubmit={handleUpdate}
        />
      )}

      {assigningDepartment && (
        <div className="form-container">
          <h3>Assign Employees to {assigningDepartment.departmentName}</h3>
          {employees.map(employee => (
            <div key={employee._id}>
              <input
                type="checkbox"
                id={employee._id}
                checked={selectedEmployees.includes(employee._id)}
                onChange={() => handleEmployeeSelection(employee._id)}
              />
              <label htmlFor={employee._id}>{employee.firstName} {employee.lastName}</label>
            </div>
          ))}
          <button onClick={handleAssignSubmit} className="btn">Assign Selected Employees</button>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;