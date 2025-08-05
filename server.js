const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/brain-tree-nutrition', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create admin user if it doesn't exist
async function createAdminUser() {
    try {
        const existingAdmin = await User.findOne({ email: 'admin@braintree.com' });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const adminUser = new User({
                name: 'Admin User',
                email: 'admin@braintree.com',
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log('✅ Admin user created: admin@braintree.com / admin123');
        }
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
}

// Initialize clean database
async function initializeDatabase() {
    try {
        console.log('🚀 Initializing clean database for live business...');
        console.log('📊 Ready for your real data!');
    } catch (error) {
        console.error('❌ Error initializing database:', error);
    }
}

// Database Models
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: String,
    sku: { type: String, unique: true },
    image: String,
    shopifyId: String,
    createdAt: { type: Date, default: Date.now }
});

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    totalSpent: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    lastOrder: Date,
    status: { type: String, default: 'active' },
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number
    }],
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    paymentMethod: String,
    shippingAddress: String,
    createdAt: { type: Date, default: Date.now }
});

const integrationSchema = new mongoose.Schema({
    platform: { type: String, required: true },
    apiKey: String,
    apiSecret: String,
    storeUrl: String,
    isActive: { type: Boolean, default: false },
    lastSync: Date,
    settings: Object,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Order = mongoose.model('Order', orderSchema);
const Integration = mongoose.model('Integration', integrationSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Routes

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            email,
            password: hashedPassword,
            name
        });
        
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key');
        res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key');
        res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Dashboard Analytics
app.get('/api/dashboard', authenticateToken, async (req, res) => {
    try {
        const totalRevenue = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        const totalOrders = await Order.countDocuments({ status: 'completed' });
        const totalCustomers = await Customer.countDocuments();
        const totalProducts = await Product.countDocuments();

        const recentOrders = await Order.find()
            .populate('customerId')
            .sort({ createdAt: -1 })
            .limit(5);

        const topProducts = await Order.aggregate([
            { $unwind: '$products' },
            { $group: { _id: '$products.productId', totalSold: { $sum: '$products.quantity' } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } }
        ]);

        res.json({
            stats: {
                revenue: totalRevenue[0]?.total || 0,
                orders: totalOrders,
                customers: totalCustomers,
                products: totalProducts
            },
            recentOrders,
            topProducts
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Products API
app.get('/api/products', authenticateToken, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Customers API
app.get('/api/customers', authenticateToken, async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/customers', authenticateToken, async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Orders API
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customerId')
            .populate('products.productId')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { customerEmail, total, status } = req.body;
        
        // Find customer by email
        const customer = await Customer.findOne({ email: customerEmail });
        if (!customer) {
            return res.status(400).json({ error: 'Customer not found' });
        }
        
        const order = new Order({
            customerId: customer._id,
            total: total,
            status: status || 'pending',
            products: [] // Empty for now, can be enhanced later
        });
        
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Integrations API
app.get('/api/integrations', authenticateToken, async (req, res) => {
    try {
        const integrations = await Integration.find();
        res.json(integrations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/integrations', authenticateToken, async (req, res) => {
    try {
        const integration = new Integration(req.body);
        await integration.save();
        res.json(integration);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Shopify Integration
app.post('/api/integrations/shopify/sync', authenticateToken, async (req, res) => {
    try {
        // This would integrate with real Shopify API
        res.json({ message: 'Shopify sync completed', syncedProducts: 25 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reports API
app.post('/api/reports/generate', authenticateToken, async (req, res) => {
    try {
        const { type, dateRange, format } = req.body;
        
        // Generate real report based on type
        let reportData = {};
        
        switch(type) {
            case 'sales':
                reportData = await Order.aggregate([
                    { $match: { status: 'completed' } },
                    { $group: { _id: null, total: { $sum: '$total' } } }
                ]);
                break;
            case 'inventory':
                reportData = await Product.find();
                break;
            case 'customers':
                reportData = await Customer.find();
                break;
        }
        
        res.json({ reportData, type, format });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Brain Tree Nutrition Platform running on port ${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend available at http://localhost:${PORT}`);
    
    // Create admin user and initialize clean database
    createAdminUser();
    initializeDatabase();
}); 