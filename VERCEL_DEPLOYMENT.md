# 🚀 Vercel Deployment Guide for PlatePerfect

This guide explains how to deploy PlatePerfect to Vercel with secure API key management.

## 📋 Prerequisites

1. A [Vercel](https://vercel.com) account (free tier works great)
2. An [OpenAI API key](https://platform.openai.com/api-keys) (optional, for AI meal generation)
3. A [USDA FoodData Central API key](https://fdc.nal.usda.gov/api-key-signup.html) (optional, for food search)

## 🔐 Why This Approach is Secure

**BEFORE (Insecure):** API keys were stored in browser localStorage
- ❌ Anyone could inspect the browser and steal your keys
- ❌ Keys visible in DevTools
- ❌ No usage limits or metering
- ❌ Exposed to XSS attacks

**AFTER (Secure):** API keys stored as Vercel environment variables
- ✅ Keys never leave the server
- ✅ Not visible to users
- ✅ Can implement rate limiting
- ✅ Protected from client-side attacks
- ✅ Can be rotated without redeploying code

## 📦 Step 1: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add -A
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your PlatePerfect repository
   - Click "Import"

3. **Configure Build Settings**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Click "Deploy"**
   - Vercel will build and deploy your app
   - You'll get a URL like `your-app.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Project name: `plate-perfect` (or your choice)
   - Directory: `./` (current directory)
   - All other options: accept defaults

## 🔑 Step 2: Set Environment Variables

Environment variables are where you'll store your secret API keys.

### Via Vercel Dashboard (Easiest)

1. **Go to your project** on [vercel.com](https://vercel.com)

2. **Navigate to Settings**
   - Click on your project
   - Click "Settings" tab
   - Click "Environment Variables" in the left sidebar

3. **Add OpenAI API Key** (Optional but recommended)
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key (starts with `sk-proj-...` or `sk-...`)
   - **Environments:** Select all (Production, Preview, Development)
   - Click "Add"

4. **Add USDA FoodData Central API Key** (Optional)
   - **Name:** `FDC_API_KEY`
   - **Value:** Your USDA FDC API key
   - **Environments:** Select all
   - Click "Add"

5. **Redeploy** (Important!)
   - After adding environment variables, you MUST redeploy
   - Go to "Deployments" tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"
   - Select "Use existing Build Cache" for faster redeploy

### Via Vercel CLI

```bash
# Add OpenAI API key
vercel env add OPENAI_API_KEY

# When prompted:
# - Enter your API key value
# - Select all environments (Production, Preview, Development)

# Add FDC API key (optional)
vercel env add FDC_API_KEY

# Redeploy to use new environment variables
vercel --prod
```

## 🧪 Step 3: Test Your Deployment

1. **Visit your Vercel URL**
   - Go to `your-app.vercel.app`

2. **Test the Fuel Generator**
   - Navigate to "Fuel Generator"
   - Enter some ingredients (e.g., "chicken, rice, broccoli")
   - Click "Generate Meal Ideas"
   - If configured correctly, you'll see 6 AI-generated meals!

3. **Check for errors**
   - Open browser DevTools (F12)
   - Look at the Console tab
   - If you see "OpenAI API key not configured", your environment variable isn't set up correctly

## 🔍 Troubleshooting

### "OpenAI API key not configured"

**Problem:** Environment variable not set or not deployed

**Solutions:**
1. Verify the variable name is exactly `OPENAI_API_KEY` (case-sensitive)
2. Check that you selected all environments when adding the variable
3. Make sure you **redeployed** after adding the variable
4. Wait 1-2 minutes after redeploying, then try again

### "Server returned status 500"

**Problem:** Server-side error

**Solutions:**
1. Check Vercel function logs:
   - Go to your project on Vercel
   - Click "Functions" tab
   - Look for `/api/openai` function
   - Check the logs for errors

2. Common issues:
   - Invalid OpenAI API key format
   - API key quota exceeded
   - OpenAI API rate limits

### API calls work locally but not on Vercel

**Problem:** Development vs. production environment

**Solutions:**
1. Make sure you added environment variables to **all** environments
2. Try running `vercel env pull` to sync environment variables locally
3. Check that your `.env.local` file is in `.gitignore` (it should be)

## 💰 Cost Considerations

### OpenAI API Costs

- **GPT-4o:** ~$0.01 - $0.03 per meal generation request
- **Recommended:** Set up billing limits on OpenAI dashboard
- **Free tier:** OpenAI offers $5 in free credits for new accounts

### USDA FoodData Central API

- **Completely FREE** ✅
- No usage limits
- No credit card required

### Vercel Hosting

- **Free tier includes:**
  - Unlimited deployments
  - 100GB bandwidth per month
  - Serverless functions
  - SSL certificates

## 🎯 Best Practices

### Security

1. **Never commit API keys to git**
   - Always use environment variables
   - Keep `.env.local` in `.gitignore`

2. **Rotate keys regularly**
   - Change your OpenAI API key every few months
   - Update in Vercel environment variables

3. **Monitor usage**
   - Set up billing alerts on OpenAI dashboard
   - Check Vercel analytics for unusual traffic

### Performance

1. **Enable caching**
   - Vercel automatically caches static assets
   - API routes have built-in edge caching

2. **Monitor function execution**
   - Check Vercel Functions dashboard
   - Look for slow or failing requests

## 🚀 Custom Domain (Optional)

Want to use `your-domain.com` instead of `your-app.vercel.app`?

1. **Buy a domain** (Vercel, Namecheap, GoDaddy, etc.)

2. **Add to Vercel**
   - Project Settings → Domains
   - Click "Add"
   - Enter your domain
   - Follow DNS configuration instructions

3. **Vercel handles**
   - Automatic SSL certificates
   - CDN distribution
   - DNS configuration

## 📊 Monitoring & Analytics

### Vercel Analytics

Enable on your project for:
- Page views
- Unique visitors
- Performance metrics
- Geographic distribution

### Function Logs

View real-time logs:
1. Go to your project
2. Click "Functions"
3. Select a function (e.g., `/api/openai`)
4. View execution logs and errors

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add -A
git commit -m "Add new feature"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Runs npm run build
# 3. Deploys to production
# 4. Updates your-app.vercel.app
```

## 🎓 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [USDA FDC API Documentation](https://fdc.nal.usda.gov/api-guide.html)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] `OPENAI_API_KEY` environment variable added
- [ ] `FDC_API_KEY` environment variable added (optional)
- [ ] Project redeployed after adding environment variables
- [ ] Fuel Generator tested and working
- [ ] No console errors
- [ ] Custom domain configured (optional)

---

**Need help?** Open an issue on GitHub or contact support at Vercel.

**Remember:** With this setup, your API keys are secure, your costs are under control, and your app is production-ready! 🎉
