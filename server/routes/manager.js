const express = require('express');
const Department = require('../models/Department');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all departments (paginated)
router.get('/departments', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const departments = await Department.find()
      .skip(skip)
      .limit(limit)
      .populate('employees', 'firstName lastName email');

    const total = await Department.countDocuments();

    res.json({
      departments,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new department
router.post('/departments', auth, async (req, res) => {
  try {
    const { departmentName, categoryName, location, salary } = req.body;
    const department = new Department({
      departmentName,
      categoryName,
      location,
      salary
    });
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a department
router.put('/departments/:id', auth, async (req, res) => {
  try {
    const { departmentName, categoryName, location, salary } = req.body;
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { departmentName, categoryName, location, salary },
      { new: true }
    );
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a department
router.delete('/departments/:id', auth, async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    // Remove department reference from employees
    await User.updateMany(
      { department: req.params.id },
      { $unset: { department: 1 } }
    );
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign employees to a department
router.post('/departments/:id/assign', auth, async (req, res) => {
  try {
    const { employeeIds } = req.body;
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    // Update department's employees
    department.employees = employeeIds;
    await department.save();

    // Update employees' department
    await User.updateMany(
      { _id: { $in: employeeIds } },
      { department: req.params.id }
    );

    res.json({ message: 'Employees assigned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all employees
router.get('/employees', auth, async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('firstName lastName email');
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Query employees in IT department with location starting with 'A'
router.get('/employees/it-location-a', auth, async (req, res) => {
  try {
    const employees = await User.find()
      .populate({
        path: 'department',
        match: { 
          categoryName: 'IT',
          location: /^A/i
        }
      })
      .exec();

    const filteredEmployees = employees.filter(employee => employee.department !== null);

    res.json(filteredEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Query employees in Sales department, sorted by name descending
router.get('/employees/sales-sorted', auth, async (req, res) => {
  try {
    const employees = await User.find()
      .populate({
        path: 'department',
        match: { categoryName: 'Sales' }
      })
      .sort({ firstName: -1, lastName: -1 })
      .exec();

    const filteredEmployees = employees.filter(employee => employee.department !== null);

    res.json(filteredEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;