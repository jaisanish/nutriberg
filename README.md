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

*(Note: The SAM template has already been hardcoded with the required `LabRole` so you won't hit IAM permission errors!)*

Run these commands one by one in your terminal:
```bash
cd backend
sam build
```

Then deploy the backend:
```bash
sam deploy --stack-name nutriberg-backend --resolve-s3 --capabilities CAPABILITY_IAM --region us-east-1
```
Wait for the deployment to finish. The terminal will print out your `ApiUrl`. Copy that URL to your clipboard!

---

## 🌐 Step 3: Connect Frontend to Backend

Run this command to create your `.env` file from the example template:
```bash
cd ..
cp .env.example .env
```
Now, open the `.env` file (you can use the command `nano .env`) and paste your `ApiUrl` on the `VITE_API_URL` line:
```env
VITE_API_URL=https://<your-api-id>.execute-api.us-east-1.amazonaws.com/prod
```
Save and exit.

---

## 📦 Step 4: Build & Deploy Frontend (S3 + CloudFront)

Run these commands to build the React application:
```bash
npm install
npm run build
```

Next, create an S3 bucket and upload the built files. 
*(Be sure to replace `my-unique-nutriberg-bucket` with a random name since bucket names must be globally unique!)*
```bash
aws s3 mb s3://my-unique-nutriberg-bucket
aws s3 sync dist/ s3://my-unique-nutriberg-bucket
```

Finally, set up CloudFront from the AWS Console to serve your bucket:
1. Go to the **CloudFront Console** and click **Create Distribution**.
2. **Origin domain:** Select your new S3 bucket from the dropdown.
3. **Origin access:** Choose **Origin access control settings** and click Create Control Setting.
4. **Default root object:** Type `index.html`.
5. Click **Create Distribution**.
6. **Important:** Click **Copy policy**, go to your S3 Bucket Permissions, and paste that policy into the Bucket Policy editor.

Once the distribution finishes deploying, click the CloudFront Domain Name URL—your project is live! 🎉
