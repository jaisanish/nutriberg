# NutriBerg 🥗
**AWS Academy Sandbox Deployment Guide**

Welcome to the NutriBerg project! Since you are deploying this within the **AWS Academy Cloud Architecting Sandbox**, this guide has been specifically tailored to match the strict permissions and allowed services of your lab environment.

---

## 🛑 Sandbox Constraints & Architecture

Based on the AWS Academy Lab Overview, here is how we will deploy:
1. **Compute (AWS Lambda):** We will use serverless Lambda functions for our backend logic. 
2. **Database (DynamoDB):** Allowed! We will use DynamoDB to store user data and meal logs.
3. **Storage (Amazon S3):** Allowed! We will host our React frontend static files here.
4. **CDN (Amazon CloudFront):** Allowed! We will use CloudFront to serve our S3 frontend globally.
5. **Security (IAM Read-Only):** You **cannot** create new IAM roles. We MUST use the pre-existing `LabRole` for all compute execution permissions.

---

## 🚀 Step 1: Clone the Repository in your Sandbox Terminal

Start your AWS Lab and wait for the green circle (🟢) indicating it's ready. 

1. Open the **AWS Management Console**.
2. Open the **Terminal** provided in your browser (or use AWS CloudShell).
3. Clone your GitHub repository:
```bash
git clone https://github.com/jaisanish/nutriberg.git
cd nutriberg
```

---

## ⚙️ Step 2: Deploy the Backend via AWS SAM

Because your IAM permissions are **Read-Only**, AWS SAM will crash if it tries to create new roles. 

### Modify the SAM Template
If you haven't already, ensure that every `AWS::Serverless::Function` inside `backend/template.yaml` has the `LabRole` explicitly attached to it. It should look like this:
```yaml
Type: AWS::Serverless::Function
Properties:
  Role: !Sub "arn:aws:iam::${AWS::AccountId}:role/LabRole"
  # ... other properties ...
```

### Build and Deploy
```bash
cd backend
sam build
sam deploy --guided
```
**During the guided deployment, provide:**
- **Stack Name:** `nutriberg-backend`
- **AWS Region:** `us-east-1`
- **Allow SAM to create IAM roles:** **NO** (Very important!)

Once finished, SAM will output an `ApiUrl`. Copy this value!

*(Note: If AWS Academy blocks API Gateway completely in this specific lab, you will need to change your Lambda functions to use `FunctionUrl` in the SAM template instead of `Api` events).*

---

## 🌐 Step 3: Connect Frontend to Backend

In the terminal, go back to the root `nutriberg` directory:
```bash
cd ..
cp .env.example .env
```
Open `.env` (you can use `nano .env`) and update the `VITE_API_URL` with the URL you got from SAM:
```env
VITE_API_URL=https://<your-api-id>.execute-api.us-east-1.amazonaws.com/prod
```

---

## 📦 Step 4: Build & Deploy Frontend (S3 + CloudFront)

The AWS Academy sandbox explicitly allows **Amazon S3** and **Amazon CloudFront**. 

### 1. Build the React App
Ensure you have Node.js installed in your terminal, then run:
```bash
npm install
npm run build
```
This generates a `dist/` folder containing the optimized frontend.

### 2. Create an S3 Bucket & Upload
We will create a bucket to hold the files. Replace `<your-unique-bucket-name>` with something unique (e.g., `nutriberg-frontend-anish-123`).

```bash
aws s3 mb s3://<your-unique-bucket-name>
aws s3 sync dist/ s3://<your-unique-bucket-name>
```

### 3. Setup Amazon CloudFront
Since you cannot register a custom domain in Route53, we will use the default CloudFront URL.
1. Go to the **CloudFront Console**.
2. Click **Create Distribution**.
3. **Origin domain:** Select your S3 bucket from the dropdown.
4. **Origin access:** Choose "Origin access control settings (recommended)" and let it create a policy for your S3 bucket.
5. **Default root object:** Type `index.html`.
6. Click **Create Distribution**.

*(Note: CloudFront will provide a bucket policy after creation. You must go to your S3 bucket permissions and paste that policy so CloudFront can read the files!)*

### 4. Wait for Deployment
Your CloudFront distribution will say "Deploying". Once it finishes, copy the **Distribution Domain Name** (e.g., `d12345.cloudfront.net`). 

Paste that URL into your browser, and your Final Project is live! 🎉
