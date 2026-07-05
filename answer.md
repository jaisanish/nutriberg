# AWS Solutions Architect Capstone Project Report: NutriBerg

---

## 📁 1. Introduction

### Project Outline
NutriBerg is a serverless, highly-scalable, cloud-native recipe and nutritional information platform. The system is designed to empower health-conscious users by providing an integrated, interactive application for recipe discovery, nutritional value calculation, meal planning, and daily meal tracking. 

Traditional health-tracking platforms rely on provisioned server infrastructure, which suffers from either high idle costs or resource constraints under sudden user traffic surges. NutriBerg addresses this by employing a fully Serverless Architecture built on Amazon Web Services (AWS). It leverages a microservices-based model where computation runs on-demand, static assets are delivered globally via a Content Delivery Network (CDN), and data storage is managed through a fully-managed NoSQL database.

### Project Objectives
- Zero-Infrastructure Management: Eliminate the need to provision, patch, or maintain physical or virtual servers by hosting the entire backend on AWS Lambda and API Gateway.
- Cost Efficiency (Pay-per-Value): Implement a scale-to-zero model where cost is directly proportional to actual platform usage, minimizing operating expenses during low-activity periods.
- Global Low-Latency Delivery: Serve the single-page application (SPA) frontend close to users globally using Amazon CloudFront and S3, ensuring fast page load times and optimal user experience.
- Flexible & Scalable Storage: Design a schema-flexible database using Amazon DynamoDB to handle recipes, meal plans, reviews, and logs with single-digit millisecond response times.
- Dynamic Nutrient Aggregation: Enable client-side and server-side compute logic to analyze recipes and log entries to provide immediate macro- and micro-nutrient tracking.

---

## 🎯 2. Project Objectives

The project is evaluated against the following specific technical goals and expected outcomes:

| Objective | Target Metrics / Features | AWS Services Involved |
| :--- | :--- | :--- |
| High Availability Backend | Highly available API endpoints handling parallel incoming traffic. | AWS Lambda, Amazon API Gateway |
| Database Performance | Low latency CRUD operations for Recipes, Users, Meal Logs, and Ratings. | Amazon DynamoDB |
| Static Asset Hosting | Fast loading frontend (Vite/React) with secure HTTPS transmission. | Amazon S3, Amazon CloudFront |
| Media Storage | Secure storage and CORS-enabled upload for user-submitted recipe images. | Amazon S3 |
| Modular Automation | Standardized deployment workflow using Infrastructure as Code (IaC). | AWS SAM (Serverless Application Model) / CloudFormation |

---

## 🗺️ 3. Project Architecture

### Services Used
1. **Amazon S3 (Simple Storage Service):** Holds the static build files (HTML, CSS, JS, images) of the React/Vite web application. A separate S3 bucket stores user-submitted media assets.
2. **Amazon CloudFront:** Distributes the frontend globally using edge location caching, accelerating delivery and enforcing HTTPS encryption.
3. **Amazon API Gateway:** Exposes RESTful endpoints, handles HTTP CORS requests, and routes events directly to the Lambda functions.
4. **AWS Lambda:** Hosts the backend microservice code. Runs logic only on-demand, scaling instantly from 0 to thousands of concurrent requests.
5. **Amazon DynamoDB:** Replaces relational DBs with a fully-managed NoSQL database to provide single-digit millisecond response times.
6. **AWS CloudFormation / SAM:** Orchesrates the entire deployment stack in a declarative YAML template, ensuring reproducible deployments.

### Service Interactions (How They Work Together)
- When a user navigates to NutriBerg, their request is routed to **Amazon CloudFront**, which fetches the frontend static assets from the **Static Site S3 Bucket** and caches them at edge locations.
- The web app runs client-side inside the browser. When the user logs a meal, searches for a recipe, or rates an item, the frontend makes an HTTP REST request to **Amazon API Gateway**.
- API Gateway acts as the gateway to the backend, mapping and proxying request parameters to individual **AWS Lambda functions**.
- The Lambda functions execute the business logic (e.g. calculating nutritional sums, verifying ingredients) and communicate with **Amazon DynamoDB** to read/write persistent data.
- If a user uploads an image, the client gets a presigned request or uploads it to the **Media S3 Bucket**, which is accessible publicly with CORS restrictions.

### Architecture Diagram
```mermaid
graph TD
    %% User Layer
    User([User Browser])

    %% Frontend Hosting Layer
    subgraph Frontend Delivery [S3 + CloudFront CDN]
        CF[Amazon CloudFront Distribution]
        S3Site[(Amazon S3 Static Site Bucket)]
    end

    %% API Layer
    subgraph API Management [Amazon API Gateway]
        APIGW[Amazon API Gateway REST API]
    end

    %% Compute Layer
    subgraph Compute Services [AWS Lambda]
        L1[GetRecipesFunction]
        L2[GetRecipeByIdFunction]
        L3[CreateRecipeFunction]
        L4[LogMealFunction]
        L5[GetMealsFunction]
        L6[SaveMealPlanFunction]
        L7[GetMealPlanFunction]
        L8[CalculateNutritionFunction]
        L9[RateRecipeFunction]
        L10[GetUserProfileFunction]
        L11[UpdateUserProfileFunction]
    end

    %% Storage Layer
    subgraph Storage & Database [S3 + DynamoDB]
        S3Media[(Amazon S3 Media Bucket)]
        T1[(Recipes DynamoDB Table)]
        T2[(Users DynamoDB Table)]
        T3[(MealLogs DynamoDB Table)]
        T4[(MealPlans DynamoDB Table)]
        T5[(Ratings DynamoDB Table)]
        T6[(Comments DynamoDB Table)]
    end

    %% Connections
    User -->|1. Requests Page| CF
    CF -->|Serves Web Assets| S3Site
    
    User -->|2. Makes API Calls| APIGW
    
    APIGW -->|Routes GET /recipes| L1
    APIGW -->|Routes GET /recipes/{id}| L2
    APIGW -->|Routes POST /recipes| L3
    APIGW -->|Routes POST /meals| L4
    APIGW -->|Routes GET /meals| L5
    APIGW -->|Routes POST /meal-plans| L6
    APIGW -->|Routes GET /meal-plans/{weekId}| L7
    APIGW -->|Routes POST /nutrition/calculate| L8
    APIGW -->|Routes POST /recipes/{id}/rate| L9
    APIGW -->|Routes GET /users/profile| L10
    APIGW -->|Routes PUT /users/profile| L11

    %% Compute to DB mappings
    L1 & L2 & L8 & L9 & L3 --> T1
    L10 & L11 --> T2
    L4 & L5 --> T3
    L6 & L7 --> T4
    L9 --> T5
    %% Storage connections
    L3 -.->|Uploads Images| S3Media
```

---

## 🔑 4. Key Concepts

### Features Utilized
- **Client-Side SPA Architecture:** Rapid view swaps and smooth user experiences built using React, Vite, and React Router.
- **Macronutrient Tracking Visuals:** Dynamic visual graphics displaying calories, carbs, protein, and fat breakdowns powered by Chart.js.
- **Dynamic Nutrition Calculations:** Microservices calculating total meal metrics based on serving size scaling factors.
- **Database Partition Schemes:** Optimized DynamoDB schema leveraging custom Partition Keys (PKs) and Sort Keys (SKs) to support multiple querying patterns (e.g. querying logs by userID + date range).

### AWS Services Significance
- **Amazon DynamoDB vs. Amazon RDS:** Relational databases require keeping VM instances running 24/7 (high cost) and enforce rigid table schemas. DynamoDB is schema-flexible, scales to zero operations, and maintains single-digit millisecond latency at any throughput scale.
- **AWS Lambda vs. Amazon EC2:** Amazon EC2 instances require ongoing OS security patching, manual scaling configuration, and charge for idle time. AWS Lambda is completely serverless—it scales automatically on a per-request basis and features a scale-to-zero cost model.
- **Amazon S3 + CloudFront vs. EC2 Apache Servers:** Serving static web pages directly from web server VMs introduces latency issues for global users. S3 static hosting combined with CloudFront serves files directly from AWS Edge Locations, maximizing security and minimizing asset load times.

---

## 🛠️ 5. Challenges and Solutions

### Problem 1: Cognito User Pools Restriction in Sandbox
- **Description:** The AWS Academy Sandbox blocks user role creations for AWS Cognito, preventing standard serverless authentication from executing.
- **Resolution:** Designed and built a local authentication and profile state preservation architecture within the React frontend. It manages session cookies, onboarding setups, and user profiles locally via local storage state mechanisms, fallback data seeding, and React Context (`AuthContext`).

### Problem 2: Restricted IAM Permissions and role creation blockers
- **Description:** The CloudFormation stack deployment crashed repeatedly during initial runs because the sandbox blocked `iam:CreateRole` and `iam:PassRole` permissions, preventing SAM from generating automatic Lambda Execution Roles or attaching inline policies.
- **Resolution:** Re-architected the `template.yaml` template. We ran inspections using CloudShell to find pre-existing service execution roles, identifying `lambda-run-role` (`arn:aws:iam::030892859286:role/lambda-run-role`). We deleted all policy creation blocks from the template and hardcoded this pre-authorized role ARN onto all 11 Lambda function properties, bypassing the IAM restriction entirely.

---

## 🔒 6. Security Measures

### Authentication
- Handled via secure client-side state managers. User session information is stored inside `localStorage` using unique hashing patterns.
- Fallback user configurations map user actions to isolated data sets, ensuring users cannot access or overwrite logs of other local profiles.

### Data Protection
- **Encryption-in-Transit:** Encrypted endpoints via SSL/TLS certificates across API Gateway and CloudFront web distributions, forcing HTTPS traffic.
- **Encryption-at-Rest:** AWS DynamoDB encrypts all data automatically using AWS KMS keys before storing it to disk.
- **Static Content Security:** S3 buckets are restricted with block-public-access settings, and CloudFront is configured to only allow reads through verified Origin Access Access (OAI) policies.

---

## 💰 7. Cost Analysis

### Cost Breakdown (Scale-to-Zero Serverless)
1. **AWS Lambda:** Billing is calculated per request and execution time (1 million free requests per month).
2. **Amazon API Gateway:** Charged per million calls ($3.50 for HTTP APIs). Zero idle fees.
3. **Amazon DynamoDB:** Configured in Pay-per-Request mode (On-Demand capacity), costing $1.25 per million write requests and $0.25 per million read requests.
4. **Amazon S3 + CloudFront:** Costs are based entirely on data transfer ($0.08 per GB).

### Budgeting Optimization
By moving away from traditional VM host setups (such as 24/7 running EC2 instances or RDS servers), NutriBerg achieves a **99% cost reduction** for dev/test testing. Under low traffic conditions, operational costs fall to **$0.00/month**, keeping the application well within the boundaries of AWS Academy student budgets.

---

## 🔍 8. Project Scope

The boundaries of the NutriBerg project are divided into what was built, how it operates, and the technical requirements met:

### Included in Scope
1. Infrastructure as Code (IaC): Fully declarative SAM template to manage API configurations, Lambda runtime settings, S3 CORS, S3 Website policies, DynamoDB Primary Keys/GSIs, and CloudFront distribution behaviors.
2. Backend API Endpoints (11 Lambda Handlers):
   - Recipe operations (Fetch All, Fetch Details, Create New, Submit Star Ratings).
   - Meal Logs (Log specific meals by date/type, track calories and macros over time).
   - Meal Plans (Create weekly meal templates, plan meals by day of week).
   - User Profiles (Store dietary constraints, macro goals, and user preferences).
3. Frontend Application: A premium dashboard interface detailing:
   - Dynamic charts showing caloric and macronutrient daily splits.
   - Interactive calendar grids for assigning daily breakfast, lunch, dinner, and snacks.
   - Custom recipe creator page with automated ingredient lists.
   - Onboarding modal for intake calculation based on user weight goals.
4. Data Seed Operations: Pre-populating the recipe tables with realistic food database structures.

### Excluded from Scope (Future Enhancements)
- Active User Authentication (Cognito): Omitted due to restricted sandbox IAM parameters. Handled via local session contexts.
- Third-Party API Integration (Spoonacular/USDA Databases): Backend templates include parameters for third-party keys but fallback onto seeded local nutritional datasets for stability in sandboxed networks.

---

## 👥 9. Individual Contributions

The development, design, and execution of this project were completed by the capstone project members as follows:

### Member 1: Anish Jaiswal (Lead Architect & Full-Stack Developer)
- Contribution Level: 100% Core Implementation.
- Tasks Handled:
  - Designed the NoSQL data modeling for Amazon DynamoDB (Partition Keys, GSIs).
  - Drafted the infrastructure template (`backend/template.yaml`) for AWS Serverless Application Model (SAM).
  - Developed and optimized the 11 backend AWS Lambda functions in JavaScript (Node.js 20.x runtime).
  - Programmed the frontend React SPA dashboard, routing system, state managers, and interactive charts.
  - Configured AWS S3 hosting and S3 Media cors properties to bypass client uploading issues.
  - Successfully debugged IAM permission limits within the AWS Academy Sandbox by configuring pre-existing execution roles (`lambda-run-role`).

### Member 2: Collaborative Peer
- Contribution Level: Conceptualization & Brainstorming.
- Tasks Handled:
  - Assisted in design reviews and brainstorming the initial platform schema.
  - Provided feedback on the application UI/UX flows.
  - Aided in drafting documentation, slide materials, and verifying functional project goals.

### Member 3 & Member 4
- Contribution Level: N/A.

---

*Report prepared for submission as AWS Solutions Architect Capstone Project.*
