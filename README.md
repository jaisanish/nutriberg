# NutriBerg 🥗
**Final Project Documentation & Deployment Guide**

NutriBerg is a state-of-the-art, full-stack nutrition tracking and meal planning application. Built with a modern glassmorphism UI, a React frontend, and a completely serverless AWS backend, NutriBerg empowers users to track their daily calories, discover personalized recipes, plan their week, and connect with a health-conscious community.

---

## 🌟 Key Features

- **Personalized Dashboard:** Track daily calories, macros, and micro-nutrients via dynamic doughnut and bar charts.
- **Smart Meal Planner:** An intuitive weekly grid to schedule breakfasts, lunches, dinners, and snacks.
- **Extensive Recipe Explorer:** Search, filter, and discover hundreds of recipes. 
- **Custom Recipes:** Add your own custom recipes with automatic or manual nutritional calorie estimation.
- **Community Feed:** Share updates, like posts, and interact with other users on their fitness journey.
- **Seamless Authentication:** Secure user sign-up, login, and personalized profile goals.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework:** React 18 + Vite (for ultra-fast HMR and building)
- **Styling:** Custom CSS with Glassmorphism, CSS Variables, and Flexbox/Grid layouts
- **Routing:** React Router DOM (v6)
- **State Management:** React Context API (AuthContext, MealContext, CommunityContext)
- **Icons:** Lucide React

### Backend Infrastructure (AWS Serverless)
- **API Gateway:** Handles all incoming REST API requests with built-in CORS and rate limiting.
- **AWS Lambda:** Serverless Node.js functions for business logic (meal tracking, recipe management).
- **Amazon DynamoDB:** NoSQL database for ultra-low latency data storage (Users, Recipes, Meal Logs).
- **Amazon Cognito:** Manages user authentication, registration, and secure JWT token issuance.
- **Amazon S3 & CloudFront:** Hosts the compiled React frontend globally with sub-millisecond edge caching.
- **AWS SAM (Serverless Application Model):** Infrastructure as Code (IaC) used to provision all cloud resources.

---

## 🚀 Quick Start (Local Development)

The frontend is configured to run out-of-the-box using mock data, meaning you can test the entire UI without needing AWS credentials!

```bash
# 1. Clone the repository and navigate to the folder
cd nutriberg

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
```

Open your browser to `http://localhost:5173`. 
*(Note: Authentication is simulated locally. You can use any email/password to log in and test user-specific features like the Meal Planner!)*

---

## ☁️ Production Deployment (AWS)

To take this project from local development to a live production environment, follow these steps to deploy the backend via AWS SAM and the frontend via S3.

> [!WARNING]
> **AWS Sandbox / Learner Lab Users:** 
> If you are doing this as a final project in an AWS Sandbox or Learner Lab environment, you have restricted permissions:
> 1. **No IAM Role Creation:** You cannot let SAM create new IAM Roles. You must append `Role: !Sub "arn:aws:iam::${AWS::AccountId}:role/LabRole"` to every Lambda function inside `backend/template.yaml`.
> 2. **No CloudFront:** Sandboxes often block CloudFront distributions. Instead of using CloudFront, you must host your frontend using **S3 Static Website Hosting**. 
> 3. **CORS:** Ensure your S3 bucket has CORS enabled and is set to allow public read access.

### 1. Prerequisites
- An active **AWS Account**.
- **AWS CLI** installed and configured (`aws configure` with your Access Keys).
- **AWS SAM CLI** installed.

### 2. Spoonacular API Setup
NutriBerg uses the Spoonacular API to calculate accurate nutritional macros for custom recipes.
1. Create a free account at [Spoonacular API](https://spoonacular.com/food-api).
2. Generate an API Key.

### 3. Deploy the Backend Infrastructure
Navigate to the `backend/` directory (which contains the `template.yaml` for AWS SAM).

```bash
cd backend
sam build
sam deploy --guided
```
**During the guided deployment, provide the following:**
- **Stack Name:** `nutriberg-prod`
- **AWS Region:** `us-east-1`
- **SpoonacularApiKey:** *(Paste your API key here)*
- Allow SAM to create IAM roles and save the configuration.

**Save the Deployment Outputs:**
When SAM finishes, it will print several values to the console. Save these; you will need them for the frontend `.env` file!
- `ApiUrl`
- `UserPoolId`
- `UserPoolClientId`
- `MediaBucketName`
- `CloudFrontDomain` *(Skip this if using an AWS Sandbox, use your S3 Website URL instead!)*

### 4. Connect Frontend to the Real Backend
In the root `nutriberg/` folder, duplicate the `.env.example` file and rename it to `.env`. Fill in the values from your SAM outputs:

```env
VITE_SPOONACULAR_API_KEY=your_spoonacular_api_key
VITE_AWS_REGION=us-east-1
VITE_API_URL=https://<your-api-id>.execute-api.us-east-1.amazonaws.com/prod
VITE_COGNITO_USER_POOL_ID=<your-user-pool-id>
VITE_COGNITO_CLIENT_ID=<your-client-id>
```

Update `src/context/AuthContext.jsx` to import and configure **AWS Amplify** so that Cognito manages authentication instead of the local mock state.

### 5. Deploy Frontend to S3 & CloudFront
Build the optimized React bundle and sync it to the S3 bucket created by SAM.

```bash
# Build the production bundle
npm run build

# Sync the 'dist' folder to your S3 bucket
aws s3 sync dist/ s3://<your-MediaBucketName-from-SAM> --delete
```

> [!TIP]
> **For AWS Sandbox Users:**
> 1. Go to the S3 Console -> Your Bucket -> **Properties**.
> 2. Scroll to the bottom and enable **Static website hosting**.
> 3. Set the Index document to `index.html` and Error document to `index.html`.
> 4. Go to **Permissions** -> Turn off "Block all public access".
> 5. Add a Bucket Policy allowing `s3:GetObject` to `*`.
> 6. Access your site via the provided **Bucket website endpoint** at the bottom of the Properties tab!

*(For standard AWS accounts, use CloudFront):*
```bash
# Invalidate the CloudFront cache to push updates immediately
aws cloudfront create-invalidation --distribution-id <YOUR_DISTRIBUTION_ID> --paths "/*"
```

Your app is now live globally on the internet via your CloudFront domain URL! 🎉

---

## 🗄️ API Endpoints Architecture

If you are expanding the backend, here is the REST architecture:

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/recipes` | No | Fetch or search all recipes |
| `POST` | `/recipes` | Yes (JWT) | Submit a custom recipe |
| `GET` | `/meals` | Yes (JWT) | Get user's logged meals for the day |
| `POST` | `/meals` | Yes (JWT) | Log a consumed recipe/meal |
| `GET` | `/meal-plans/{weekId}` | Yes (JWT) | Get weekly planner data |
| `POST` | `/meal-plans` | Yes (JWT) | Update the weekly planner slots |
| `POST` | `/nutrition/calculate` | Yes (JWT) | Estimate macros via Spoonacular |

---

## 💡 Troubleshooting

- **Page refreshes causing 404s on S3/CloudFront?**
  Ensure your CloudFront distribution is configured to redirect `404 Error` codes back to `/index.html` with a `200 OK` response, as this is required for React Router's client-side routing.
  
- **CORS Errors during API Calls?**
  Verify that the API Gateway in your `template.yaml` has `Cors: "'*'"` enabled for all origins, and that Lambda functions are returning the `Access-Control-Allow-Origin` headers.

- **Images not loading?**
  The sample UI utilizes Unsplash images. Ensure you are connected to the internet. If using custom uploaded images, verify your S3 Bucket Policy allows public read access (`s3:GetObject`).

---
*Built with ❤️ for Health & Fitness enthusiasts everywhere.*
