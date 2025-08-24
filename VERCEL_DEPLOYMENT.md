# FinMate Vercel Deployment Guide 🚀

## Overview
This guide will help you deploy FinMate to Vercel with both frontend and backend components.

## Prerequisites
- Vercel account (free at vercel.com)
- GitHub account
- Your FinMate project pushed to GitHub
- Google Gemini AI API key (get from https://makersuite.google.com/app/apikey)

## Step 1: Deploy Backend to Vercel

### 1.1 Prepare Backend for Vercel
The backend is already configured with:
- `vercel.json` configuration
- Gemini AI integration
- CORS settings for Vercel domains
- Environment variables setup

### 1.2 Deploy Backend
1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Select the `backend` folder as the root directory**
5. **Configure environment variables:**
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   SECRET_KEY=your-secret-key-here
   ```
6. **Click "Deploy"**

### 1.3 Backend Deployment Settings
- **Framework Preset:** Other
- **Build Command:** Leave empty (Vercel will auto-detect)
- **Output Directory:** Leave empty
- **Install Command:** `pip install -r requirements.txt`

## Step 2: Deploy Frontend to Vercel

### 2.1 Update Frontend API URL
1. **Create a new Vercel project for frontend**
2. **Set environment variable:**
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```

### 2.2 Deploy Frontend
1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Select the `frontend` folder as the root directory**
5. **Configure environment variables:**
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```
6. **Click "Deploy"**

### 2.3 Frontend Deployment Settings
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Step 3: Configure Custom Domains (Optional)

### 3.1 Backend Domain
1. **In your backend Vercel project**
2. **Go to Settings → Domains**
3. **Add custom domain:** `api.yourdomain.com`

### 3.2 Frontend Domain
1. **In your frontend Vercel project**
2. **Go to Settings → Domains**
3. **Add custom domain:** `yourdomain.com`

## Step 4: Update CORS Settings

### 4.1 Update Backend CORS
If you're using custom domains, update the CORS origins in `backend/app.py`:

```python
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:5173", 
    "https://yourdomain.com",
    "https://www.yourdomain.com",
    "https://finmate.vercel.app",
    "https://finmate-git-main.vercel.app",
    "https://finmate-*.vercel.app"
])
```

## Step 5: Test Your Deployment

### 5.1 Test Backend
Visit your backend URL: `https://your-backend-url.vercel.app`
You should see:
```json
{
  "message": "FinMate API is running!",
  "version": "1.0.0",
  "status": "healthy"
}
```

### 5.2 Test Frontend
Visit your frontend URL and test:
- Landing page loads correctly
- Dashboard functionality
- Expense tracking
- AI tips (should work with Gemini AI)

## Step 6: Environment Variables Summary

### Backend Environment Variables
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
SECRET_KEY=your-secret-key-here
```

### Frontend Environment Variables
```
VITE_API_URL=https://your-backend-url.vercel.app
```

## 🔒 Security Best Practices

### API Key Security
1. **Never commit API keys to Git** - They are now properly excluded
2. **Use environment variables** - All sensitive data is stored in Vercel environment variables
3. **Rotate keys regularly** - Change your API keys periodically
4. **Monitor usage** - Check your Gemini AI usage dashboard

### Environment Variables
- ✅ API keys are removed from code
- ✅ Environment variables are properly configured
- ✅ Fallback tips work when AI is unavailable
- ✅ No sensitive data in GitHub repository

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check that your backend CORS origins include your frontend domain
   - Ensure the frontend is making requests to the correct backend URL

2. **API Not Found**
   - Verify the `VITE_API_URL` environment variable is set correctly
   - Check that your backend is deployed and accessible

3. **Gemini AI Errors**
   - Verify the `GEMINI_API_KEY` is set correctly in Vercel
   - Check the API key has proper permissions
   - App will show fallback tips if AI is unavailable

4. **Build Failures**
   - Check that all dependencies are in `requirements.txt`
   - Verify Python version compatibility

### Debugging Steps

1. **Check Vercel Logs**
   - Go to your Vercel project dashboard
   - Click on "Functions" to see serverless function logs
   - Check "Deployments" for build logs

2. **Test API Endpoints**
   - Use tools like Postman or curl to test your backend endpoints
   - Verify each endpoint returns the expected response

3. **Check Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Verify all variables are set correctly

## Performance Optimization

### Backend Optimization
- Vercel automatically scales your serverless functions
- Database queries are optimized for serverless environment
- Caching is handled automatically

### Frontend Optimization
- Vite build optimizes for production
- PWA features work automatically on Vercel
- CDN distribution is handled by Vercel

## Monitoring and Analytics

### Vercel Analytics
- Enable Vercel Analytics in your project settings
- Monitor performance and user behavior
- Track API usage and errors

### Custom Monitoring
- Add logging to your Flask app for debugging
- Monitor Gemini AI API usage
- Track expense data and user engagement

## Security Considerations

1. **API Key Security**
   - ✅ Never expose API keys in client-side code
   - ✅ Use environment variables for all sensitive data
   - ✅ Rotate API keys regularly

2. **CORS Configuration**
   - Only allow necessary origins
   - Avoid using wildcards in production

3. **Data Validation**
   - Validate all input data on the backend
   - Sanitize user inputs
   - Implement rate limiting if needed

## Support

If you encounter issues:
1. Check Vercel documentation
2. Review the troubleshooting section above
3. Check the project README for additional setup instructions

---

**Happy Deploying! 🎉**

Your FinMate app should now be live and accessible to users worldwide!
