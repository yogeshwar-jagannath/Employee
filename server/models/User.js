const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  hobbies: { type: String, required: true },
  role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
});

module.exports = mongoose.model('User', userSchema);