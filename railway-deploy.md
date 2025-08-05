# 🚀 Railway Deployment Guide

## **Step 1: Create Railway Account**
1. Go to https://railway.app/
2. Sign up with GitHub
3. Create new project

## **Step 2: Connect Your Repository**
1. Click "Deploy from GitHub repo"
2. Select your repository
3. Railway will automatically detect Node.js

## **Step 3: Set Environment Variables**
Add these in Railway dashboard:

```
MONGODB_URI=mongodb+srv://DKDEJO:<your-password>@cluster0.6esfi4q.mongodb.net/brain-tree-nutrition?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=brain-tree-nutrition-super-secret-jwt-key-2024
PORT=5000
NODE_ENV=production
```

## **Step 4: Deploy**
1. Railway will automatically deploy
2. Get your live URL
3. Your app is now live!

## **Step 5: Custom Domain (Optional)**
1. Go to your Railway project
2. Click "Settings"
3. Add custom domain 