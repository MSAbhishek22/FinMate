# 🚀 FinMate Deployment Guide

This guide will help you deploy FinMate to production environments.

## Frontend Deployment

### Netlify Deployment

1. **Build the project:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your GitHub repository for automatic deployments

3. **Environment Variables:**
   - Set `VITE_API_URL` to your backend URL
   - Example: `https://your-backend.herokuapp.com`

### Vercel Deployment

1. **Connect Repository:**
   - Import your GitHub repository to Vercel
   - Set the root directory to `frontend`

2. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables:**
   - Add `VITE_API_URL` with your backend URL

## Backend Deployment

### Heroku Deployment

1. **Create Heroku App:**
   ```bash
   heroku create your-finmate-backend
   ```

2. **Set Environment Variables:**
   ```bash
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   heroku config:set SECRET_KEY=your_secret_key
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Render Deployment

1. **Create New Web Service:**
   - Connect your GitHub repository
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `gunicorn app:app`

2. **Environment Variables:**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SECRET_KEY`: A secure secret key

3. **Auto-deploy on push to main branch**

### Railway Deployment

1. **Connect Repository:**
   - Import from GitHub
   - Set root directory to `backend`

2. **Environment Variables:**
   - Add all required environment variables

3. **Deploy automatically**

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com
```

### Backend (.env)
```env
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your-secret-key-here
FLASK_ENV=production
```

## PWA Configuration

### Update Manifest
Update `frontend/public/manifest.json` with your production URLs:

```json
{
  "start_url": "https://your-domain.com",
  "scope": "https://your-domain.com"
}
```

### Generate Icons
1. Create a 512x512 logo for FinMate
2. Use [PWA Builder](https://www.pwabuilder.com/imageGenerator) to generate all required sizes
3. Place icons in `frontend/public/icons/`

## Database Setup

### SQLite (Development)
- Automatically created in `backend/finmate.db`
- No additional setup required

### PostgreSQL (Production)
1. **Update requirements.txt:**
   ```
   psycopg2-binary==2.9.7
   ```

2. **Update database URL:**
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
   ```

3. **Set environment variable:**
   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

## SSL/HTTPS

### Frontend
- Netlify/Vercel provide SSL automatically
- Custom domains supported

### Backend
- Heroku provides SSL automatically
- For custom domains, configure SSL certificates

## Monitoring

### Frontend
- Use Vercel Analytics or Netlify Analytics
- Monitor Core Web Vitals

### Backend
- Use Heroku Logs or Render Logs
- Set up error tracking (Sentry)

## Performance Optimization

### Frontend
1. **Code Splitting:** Already implemented with React Router
2. **Image Optimization:** Use WebP format for icons
3. **Caching:** Service worker handles caching

### Backend
1. **Database Indexing:** Add indexes for frequently queried fields
2. **Caching:** Implement Redis for session storage
3. **Rate Limiting:** Add rate limiting for API endpoints

## Security

### Frontend
1. **Environment Variables:** Never expose sensitive data
2. **CSP Headers:** Add Content Security Policy
3. **HTTPS Only:** Force HTTPS in production

### Backend
1. **CORS:** Configure CORS for your frontend domain
2. **Rate Limiting:** Implement API rate limiting
3. **Input Validation:** Validate all user inputs
4. **SQL Injection:** Use parameterized queries (already implemented)

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Update CORS configuration in backend
   - Check frontend API URL

2. **PWA Not Installing:**
   - Verify manifest.json is accessible
   - Check service worker registration
   - Ensure HTTPS is enabled

3. **Database Connection:**
   - Verify DATABASE_URL environment variable
   - Check database permissions

4. **AI Tips Not Working:**
   - Verify OPENAI_API_KEY is set
   - Check API quota and billing

## Support

For deployment issues:
1. Check the logs in your hosting platform
2. Verify all environment variables are set
3. Test locally before deploying
4. Check the browser console for frontend errors

---

**Happy Deploying! 🚀**
