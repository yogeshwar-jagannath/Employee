import React, { useState } from 'react';

const DepartmentForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    departmentName: '',
    categoryName: '',
    location: '',
    salary: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        departmentName: '',
        categoryName: '',
        location: '',
        salary: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>{initialData ? 'Edit Department' : 'Create Department'}</h2>
      <div className="form-group">
        <label>Department Name</label>
        <input
          type="text"
          name="departmentName"
          value={formData.departmentName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Category Name</label>
        <input
          type="text"
          name="categoryName"
          value={formData.categoryName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Salary</label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn">
        {initialData ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default DepartmentForm;