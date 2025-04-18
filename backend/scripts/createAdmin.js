require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to update a user to admin
const updateUserToAdmin = async (email) => {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }
    
    user.role = 'admin';
    await user.save();
    
    console.log(`User ${email} has been updated to admin role`);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    mongoose.disconnect();
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Please provide an email address as a command line argument');
  process.exit(1);
}

updateUserToAdmin(email);