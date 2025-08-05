const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('🔍 Testing MongoDB connection...');
        console.log('📝 Connection string (masked):', process.env.MONGODB_URI ? 
            process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'NOT SET');
        
        // Test connection
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connection successful!');
        
        // Test database operations
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📊 Available collections:', collections.map(c => c.name));
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        
        if (error.message.includes('bad auth')) {
            console.log('\n🔧 AUTHENTICATION ISSUE DETECTED');
            console.log('Possible solutions:');
            console.log('1. Check if username "DKDEJO" exists in MongoDB Atlas');
            console.log('2. Verify the password is correct');
            console.log('3. Make sure the user has proper permissions');
            console.log('4. Check if the database name is correct');
        }
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n🌐 NETWORK ISSUE DETECTED');
            console.log('Possible solutions:');
            console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
            console.log('2. Verify the connection string format');
        }
        
    } finally {
        await mongoose.disconnect();
    }
}

testConnection(); 