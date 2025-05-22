# Vercel Deployment Guide for Your Museum Application

This guide will help you deploy your museum application to Vercel with the OpenAI API key properly configured for voice chat functionality.

## Method 1: Direct Deployment Through Vercel Dashboard (Recommended)

### Step 1: Push Your Code to GitHub

Make sure your project is pushed to a GitHub repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Select "Import Git Repository" and connect to your GitHub account if not already connected
4. Find and select your repository 
5. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `cd frontend && npm install --legacy-peer-deps && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables

1. On the project configuration page, click "Environment Variables" section
2. Add the following variable:
   - **Name**: `VITE_OPENAI_API_KEY`
   - **Environment**: Production (and optionally Preview/Development)

3. Click "Deploy"

### Step 4: Verify Your Deployment

1. Once deployment is complete, Vercel will provide a URL to your application
2. Open that URL in your browser
3. Test the voice chat functionality with any 3D artifact

## Method 2: Using Vercel CLI (Alternative)

If you prefer using the command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# From your project directory
cd /path/to/project

# Deploy
vercel

# Add environment variable manually in Vercel dashboard after deployment
```

## Troubleshooting

### Voice Chat Not Working

1. **Check Environment Variables**: Make sure `VITE_OPENAI_API_KEY` is set correctly in the Vercel dashboard
2. **Check Browser Console**: Look for API-related errors
3. **Test API Key**: Verify your OpenAI API key is valid

### Deployment Errors

1. **Build Failures**: Check build logs in Vercel dashboard
2. **Missing Dependencies**: Ensure all dependencies are correctly specified in package.json
3. **Path Issues**: Verify that the paths in your vercel.json are correct

## Additional Configuration

### Custom Domain

1. Go to your project in the Vercel dashboard
2. Navigate to "Domains"
3. Add your custom domain and follow the verification steps

### Automatic Deployments

Vercel automatically deploys when you push to your connected Git repository. You can configure:

1. Production branch (typically `main` or `master`)
2. Preview deployments for pull requests
3. Deployment settings in the "Git" section of your project settings

For more information, refer to the [Vercel documentation](https://vercel.com/docs)
