const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema (same as in server.js)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brain-tree-nutrition');
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@braintree.com' });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@braintree.com',
            password: hashedPassword,
            role: 'admin'
        });

        await adminUser.save();
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@braintree.com');
        console.log('🔑 Password: admin123');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createAdminUser(); 