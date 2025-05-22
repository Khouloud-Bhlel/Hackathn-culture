# Deployment Guide for Vercel

This guide explains how to properly deploy the museum application to Vercel with voice chat functionality enabled.

## Prerequisites

- A Vercel account
- An OpenAI API key
- Your project connected to Vercel

## Setting Up Environment Variables

1. **Create a Vercel Secret for your OpenAI API key**

   From your terminal, run:
   ```bash
   vercel secrets add openai_api_key your_actual_api_key_here
   ```
   
   Replace `your_actual_api_key_here` with your actual OpenAI API key.

2. **Alternative: Add Environment Variables via Vercel Dashboard**

   If you prefer using the web interface:
   
   a. Go to your Vercel dashboard
   b. Select your project
   c. Click on "Settings" tab
   d. Select "Environment Variables" from the left menu
   e. Add a new variable:
      - Name: `VITE_OPENAI_API_KEY`
      - Value: Your OpenAI API key
      - Environment: Production (and optionally Preview/Development)
   f. Click "Save"

## Verifying Deployment

After deploying with the environment variable set:

1. Open your deployed application
2. Navigate to any 3D artifact
3. Click on the "محادثة" (Chat) tab
4. Try the voice chat feature

## Troubleshooting

If voice chat is still not working after deployment:

1. Check the browser console for any errors
2. Verify that the environment variable is correctly set in Vercel
3. Ensure your OpenAI API key is valid and has sufficient credits
4. Check that your deployment is using the latest version of your code

## Security Notes

- Never commit your OpenAI API key to your repository
- Always use environment variables or secrets for API keys
- Consider implementing rate limiting to prevent excessive API usage
