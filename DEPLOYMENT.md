# Deployment Guide for AUDORA

## Production Deployment on Render.com

### Prerequisites
- GitHub repository connected to Render
- MongoDB Atlas cluster
- Clerk account with production application

### Environment Variables (Required)

Set these in your Render dashboard under **Environment** tab:

```bash
# Required
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/audora
PORT=8000

# Clerk Authentication (Required)
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Frontend Origins (Add your Render URL)
FRONTEND_ORIGINS=https://audora-2v17.onrender.com

# Admin Emails (comma-separated)
ADMIN_EMAILS=admin@example.com,admin2@example.com

# Optional - Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional - Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

### Fixed Production Issues

#### 1. ✅ Express Rate Limit - Trust Proxy Error
**Problem:** `ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false`

**Solution:** Added `app.set('trust proxy', 1)` to enable proper header handling behind Render's reverse proxy.

#### 2. ✅ Socket.io CORS Configuration
**Problem:** Socket.io connections failing in production due to CORS

**Solution:** 
- Updated Socket.io to accept same-origin requests in production
- Added support for `RENDER_EXTERNAL_URL` environment variable
- Increased ping timeout for slower connections
- Set `transports: ['websocket', 'polling']` for better compatibility

#### 3. ✅ Environment Variable Validation
**Problem:** Server crashes when critical env vars are missing

**Solution:** 
- Added startup validation for required environment variables
- Logs clear error messages for missing variables
- Exits gracefully with error code 1 in production

#### 4. ✅ Frontend Static File Serving
**Problem:** Frontend dist folder not being served correctly

**Solution:**
- Added existence checks for frontend dist folder
- Improved path resolution for production builds
- Added helpful error messages when dist is missing

#### 5. ✅ Clerk Authentication Error Handling
**Problem:** Uncaught Clerk errors causing 500 responses

**Solution:**
- Added middleware to catch Clerk authentication errors
- Returns proper 401 status with meaningful messages
- Hides sensitive error details in production

#### 6. ✅ Dialog Accessibility Warnings
**Problem:** React warnings about missing `aria-describedby` attributes

**Solution:**
- Added `DialogDescription` components to all dialogs
- Improved accessibility for screen readers

### Health Check Endpoint

Monitor your deployment health at: `https://your-app.onrender.com/api/health`

Response includes:
```json
{
  "status": "ok",
  "environment": "production",
  "timestamp": "2025-01-21T...",
  "uptime": 1234.56,
  "checks": {
    "mongodb": true,
    "clerk": true,
    "frontend": true
  }
}
```

### Deployment Checklist

- [ ] Set all required environment variables in Render
- [ ] Update `FRONTEND_ORIGINS` with your production URL
- [ ] Configure Clerk with production keys
- [ ] Ensure MongoDB Atlas allows connections from Render IPs (0.0.0.0/0 for simplicity)
- [ ] Run `npm run build` locally to verify frontend builds
- [ ] Test `/api/health` endpoint after deployment
- [ ] Verify Socket.io connections work (check browser DevTools)
- [ ] Test authentication flow with Clerk
- [ ] Monitor logs for any warnings or errors

### Common Issues & Solutions

#### Port Binding
Render automatically detects port 8000. No configuration needed if using default PORT env var.

#### Build Failures
If build fails, check:
- All dependencies are in `package.json` (not just devDependencies)
- Frontend builds successfully: `cd frontend && npm run build`
- No TypeScript errors: `cd frontend && npm run build`

#### 502 Bad Gateway
Usually means the app crashed. Check Render logs for:
- Missing environment variables
- MongoDB connection failures
- Clerk configuration issues

#### Socket.io Connection Refused
- Verify `FRONTEND_ORIGINS` includes your production URL
- Check browser console for CORS errors
- Ensure websocket connections are not blocked by firewall

### Monitoring

1. **Render Dashboard**: Check logs, metrics, and deployment status
2. **Health Endpoint**: Automated monitoring via `/api/health`
3. **MongoDB Atlas**: Monitor database performance and connections
4. **Clerk Dashboard**: Track authentication metrics

### Rollback Procedure

If deployment fails:
1. Go to Render dashboard
2. Select your service
3. Click "Manual Deploy" > "Deploy previous version"
4. Or push a git revert to trigger auto-deploy

### Performance Optimization

- Frontend assets are served with `express.static` caching
- Rate limiting prevents abuse (200 requests per 15 minutes)
- Socket.io uses websocket transport for lower latency
- MongoDB indexes on frequently queried fields
- Helmet.js security headers enabled

### Security Considerations

- CSP headers configured for Clerk and Cloudflare
- CORS restricted to specific origins
- Rate limiting on all API routes
- Clerk handles authentication securely
- Sensitive data hidden in production error messages
- Trust proxy enabled for accurate IP logging

### Support

For issues:
1. Check Render logs first
2. Verify environment variables are set correctly
3. Test `/api/health` endpoint
4. Review GitHub issues or create a new one
