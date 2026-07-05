# 🚀 AWS Serverless Hosting & Deployment Guide: NutriBerg

This guide outlines how to build, deploy, and host the **NutriBerg** platform on AWS. The application uses a fully serverless architecture designed to deploy cleanly inside standard environments (including restricted environments like the AWS Academy Sandbox).

---

## 📋 Architecture Overview

* **Frontend:** React SPA hosted on **Amazon S3** static hosting and distributed globally via **Amazon CloudFront CDN**.
* **Backend:** REST API built with **Amazon API Gateway** routing to **AWS Lambda** compute functions.
* **Database:** NoSQL storage hosted on **Amazon DynamoDB**.
* **Deployment System:** Automated Infrastructure as Code using **AWS SAM (Serverless Application Model)**.

---

## 🛠️ Step 1: Open AWS CloudShell

1. Log into your **AWS Management Console**.
2. Click the **CloudShell icon (`>_`)** in the top-right toolbar (next to the region dropdown).
3. Wait for the terminal prompt to load completely.

---

## 📂 Step 2: Clone the Project Repository

Clone the updated codebase from GitHub directly into your CloudShell environment:

```bash
git clone https://github.com/jaisanish/nutriberg.git
cd nutriberg
```

---

## 🏗️ Step 3: Build and Deploy the Backend Stack

### 1. Build the SAM template:
```bash
cd backend
sam build
```
*(Wait until you see `Build Succeeded`)*

### 2. (Optional) Delete previous stack if it is stuck in rollback:
```bash
aws cloudformation delete-stack --stack-name nutriberg-backend
```
*(Wait 30 seconds for complete cleanup)*

### 3. Deploy the SAM template:
```bash
sam deploy --stack-name nutriberg-backend --resolve-s3 --capabilities CAPABILITY_IAM --region us-east-1
```

* During the deployment, SAM will output the resources being created.
* Once the deploy finishes, look at the **Outputs** block at the end of the command output.
* **Copy and save the `ApiUrl` value.** It looks like:
  `https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev`

---

## 🗄️ Step 4: Seed the DynamoDB Database

To pre-populate the database with initial recipe items:

1. Return to the project root directory and install dependencies:
   ```bash
   cd /home/cloudshell-user/nutriberg
   npm install
   ```
2. Run the seeding script:
   ```bash
   node scripts/seed.js
   ```
   *(This will create sample recipes directly inside the `NutriBerg-Recipes-dev` table).*

---

## 💻 Step 5: Build and Deploy the React Frontend

### 1. Bind the Frontend to your API Gateway URL:
Create a `.env` file pointing the React build to your live API Gateway URL (replace the URL below with the **`ApiUrl`** you copied in Step 3):

```bash
echo "VITE_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev" > .env
```

### 2. Compile the static web application:
```bash
npm run build
```
*(This outputs a production-ready client bundle to the `dist/` directory).*

### 3. Upload the build files to S3:
Retrieve your deployed static S3 bucket name dynamically and sync the compiled frontend files:

```bash
STATIC_BUCKET=$(aws cloudformation describe-stacks --stack-name nutriberg-backend --query "Stacks[0].Outputs[?OutputKey=='StaticSiteBucketName'].OutputValue" --output text)
aws s3 sync dist/ s3://$STATIC_BUCKET --region us-east-1
```

---

## 🌍 Step 6: Access Your Live Application

Run the following command to retrieve your public CloudFront distribution domain:

```bash
aws cloudformation describe-stacks --stack-name nutriberg-backend --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDomain'].OutputValue" --output text
```

1. Copy the output domain (e.g., `dxxxxxxxxxxxxx.cloudfront.net`).
2. Open it in your web browser. 
3. **Your application is now live on AWS!** 🎉

---

## 🛠️ Sandbox Adaptations & Troubleshooting

* **Cognito Authentication Fallback:** The AWS Academy Sandbox blocks Cognito User Pool creations. The NutriBerg frontend and backend Lambda functions are pre-configured to auto-detect this and fallback seamlessly to secure local session handling and custom user authorization headers (`x-user-id` and `Authorization`).
* **IAM Permissions Fallback:** To bypass sandbox blocking of role creations (`iam:CreateRole`), the SAM template binds your Lambda functions to the pre-authorized Sandbox role (`lambda-run-role`) automatically.
