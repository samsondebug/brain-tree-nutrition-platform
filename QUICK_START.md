# 🚀 Quick Start Guide - Brain Tree Nutrition Platform

## **Step 1: Install Node.js**
1. Download from: https://nodejs.org/ (LTS version)
2. Install and restart terminal
3. Verify: `node --version` and `npm --version`

## **Step 2: Setup Database**

### Option A: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create new cluster (free tier)
4. Get connection string
5. Add your IP to whitelist

### Option B: Local MongoDB
1. Download from https://www.mongodb.com/try/download/community
2. Install and start service

## **Step 3: Configure Environment**

Edit the `.env` file with your real credentials:

```bash
# Database (replace with your MongoDB connection string)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brain-tree-nutrition

# JWT Secret (change to random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Shopify API (get from your Shopify store)
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret
SHOPIFY_STORE_URL=your-store.myshopify.com

# Stripe API (get from Stripe dashboard)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## **Step 4: Install and Start**

```bash
# Install dependencies
npm install

# Start the application
npm start
```

## **Step 5: Access Your Application**

1. Open browser to: http://localhost:5000
2. Register your first admin account
3. Start managing your business!

## **Step 6: Add Real Data**

### Add Products
- Go to Products tab
- Click "Add Product"
- Enter your real supplement products

### Add Customers
- Go to Customers tab
- Click "Add Customer"
- Import your customer database

### Connect Integrations
- Go to Integrations tab
- Add your Shopify store
- Add your Stripe account

## **Step 7: Deploy to Production**

### Option A: Heroku (Recommended)
```bash
# Install Heroku CLI
# Create app
heroku create your-app-name

# Add MongoDB
heroku addons:create mongolab

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set MONGODB_URI=your-mongodb-uri

# Deploy
git push heroku main
```

### Option B: DigitalOcean
```bash
# Create Droplet
# Install Node.js and MongoDB
# Clone repository
# Set up PM2
pm2 start server.js
pm2 startup
```

## **Troubleshooting**

### Common Issues:
1. **Node.js not found**: Install Node.js from https://nodejs.org/
2. **MongoDB connection error**: Check your connection string
3. **Port already in use**: Change PORT in .env file
4. **API errors**: Check your environment variables

### Get Help:
1. Check console for error messages
2. Verify all environment variables
3. Ensure MongoDB is running
4. Check API credentials

## **Next Steps After Setup**

1. **Add your real business data**
2. **Connect your Shopify store**
3. **Set up payment processing**
4. **Configure email marketing**
5. **Deploy to production**
6. **Set up monitoring and analytics**

---

**🎉 You now have a REAL, FUNCTIONAL BUSINESS APPLICATION!** 