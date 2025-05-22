# How to Fix Voice Chat in Vercel Deployment

The voice chat functionality in your museum application requires an OpenAI API key to work properly. According to your deployment logs, the key isn't being properly set in your Vercel environment. Here's how to fix it:

## 1. Add your OpenAI API key to Vercel Environment Variables

1. Log into your Vercel dashboard
2. Select your project 
3. Click on the "Settings" tab
4. In the left sidebar, click on "Environment Variables"
5. Add a new variable:
   - **Name:** `VITE_OPENAI_API_KEY`
   - **Value:** Your actual OpenAI API key
   - **Environment:** Select "Production" (and optionally "Preview" if you want it to work in preview deployments)
6. Click "Save"
7. Redeploy your application by clicking on the "Deployments" tab and triggering a new deployment

## 2. Update vercel.json

You should also update your vercel.json file to explicitly reference the environment variable:

```json
{
  "buildCommand": "cd frontend && npm install --legacy-peer-deps && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "VITE_OPENAI_API_KEY": "@openai_api_key"
  },
  "headers": [
    // ... existing headers
  ]
}
```

## 3. Create a Vercel Secret (Alternative Approach)

If you prefer to use Vercel Secrets instead:

1. Install the Vercel CLI: `npm i -g vercel`
2. Log in: `vercel login`
3. Add the secret: `vercel secrets add openai_api_key "your-actual-api-key-here"`

## Testing After Deployment

After setting up the environment variable:

1. Visit your deployed site
2. Navigate to any 3D artifact
3. Click on the "محادثة" (Chat) tab
4. Try the voice chat feature

If it's still not working, check the browser console for any error messages.

## Common Issues

1. **Invalid API Key**: Make sure your OpenAI API key is valid and hasn't expired
2. **Browser Permissions**: Ensure your browser has permission to use the microphone
3. **Credit Limit**: Check if you've reached the limit on your OpenAI API account

For more details, see the VOICE_CHAT_TESTING.md file in your project.
