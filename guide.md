# 🚀 NutriBerg — AWS Academy Sandbox Deployment Guide

> **Environment:** AWS Academy Cloud Architecting 3 — Sandbox  
> **Where to run commands:** AWS CloudShell (inside the AWS Console)  
> **Time needed:** ~10 minutes

---

## 📋 Pre-requisites

- Your AWS Academy Sandbox lab is **started** (green circle next to AWS).
- You have opened the **AWS Management Console** via the green circle.

---

## Step 1: Open AWS CloudShell

1. In the AWS Console, look at the **top-right corner** of the screen (near the region dropdown).
2. Click the **`>_` icon** to open **CloudShell**.
3. Wait for it to finish loading (you'll see a `$` prompt).

---

## Step 2: Clone the Repository

```bash
git clone https://github.com/jaisanish/nutriberg.git
cd nutriberg/backend
```

---

## Step 3: Build the Backend

```bash
sam build
```

Wait for `Build Succeeded` to appear.

---

## Step 4: Delete Any Previous Failed Stack (if needed)

If you have attempted a deployment before and it failed, run this first:

```bash
aws cloudformation delete-stack --stack-name nutriberg-backend
```

Wait **30 seconds** before proceeding.

---

## Step 5: Deploy the Backend

```bash
sam deploy --stack-name nutriberg-backend --resolve-s3 --capabilities CAPABILITY_IAM --region us-east-1
```

Wait for deployment to finish. At the end you will see an **Outputs** section.  
Copy the **ApiUrl** value — it looks like:
```
https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
```

---

## Step 6: Seed the Database with Sample Recipes

```bash
cd ..
node scripts/seed.js
```

This populates your DynamoDB tables with sample recipe data.

---

## Step 7: Build and Deploy the Frontend to S3

```bash
cd /home/cloudshell-user/nutriberg
```

Create the `.env` file with your API URL (replace the URL below with YOUR ApiUrl from Step 5):

```bash
echo "VITE_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev" > .env
```

Install dependencies and build:

```bash
npm install
npm run build
```

Upload the built site to S3:

```bash
aws s3 sync dist/ s3://$(aws cloudformation describe-stacks --stack-name nutriberg-backend --query "Stacks[0].Outputs[?OutputKey=='StaticSiteBucketName'].OutputValue" --output text) --region us-east-1
```

---

## Step 8: Get Your Live Site URL

Run this to get your **CloudFront URL**:

```bash
aws cloudformation describe-stacks --stack-name nutriberg-backend --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomain'].OutputValue" --output text
```

Open that URL in your browser — your site is live! 🎉

> **Note:** CloudFront can take 5-10 minutes to fully propagate. If you see an error, wait a few minutes and refresh.

---

## 🛠️ Troubleshooting

- **`ROLLBACK_COMPLETE` error on deploy?**  
  Run `aws cloudformation delete-stack --stack-name nutriberg-backend`, wait 30 seconds, then deploy again.

- **`sam: command not found`?**  
  You're not in CloudShell. The lab's built-in terminal doesn't have SAM. Use CloudShell instead (the `>_` icon in the AWS Console).

- **API returning errors?**  
  Check that you seeded the database (Step 6) and that the `.env` file has the correct API URL.

---

## 📊 AWS Services Used

| Service | Purpose |
|---------|---------|
| **AWS Lambda** | Serverless backend functions |
| **API Gateway** | REST API endpoints |
| **DynamoDB** | NoSQL database for recipes, users, meals, ratings |
| **S3** | Static site hosting + media storage |
| **CloudFront** | CDN for the frontend |
| **CloudFormation** | Infrastructure as Code (via SAM) |

---

*Built with ❤️ for Health & Fitness enthusiasts everywhere.*
