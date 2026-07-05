# AWS Solutions Architect Capstone Project Report: NutriBerg

---

## 📁 1. Introduction

### Project Outline
**NutriBerg** is a serverless, highly-scalable, cloud-native recipe and nutritional information platform. The system is designed to empower health-conscious users by providing an integrated, interactive application for recipe discovery, nutritional value calculation, meal planning, and daily meal tracking. 

Traditional health-tracking platforms rely on provisioned server infrastructure, which suffers from either high idle costs or resource constraints under sudden user traffic surges. NutriBerg addresses this by employing a fully **Serverless Architecture** built on Amazon Web Services (AWS). It leverages a microservices-based model where computation runs on-demand, static assets are delivered globally via a Content Delivery Network (CDN), and data storage is managed through a fully-managed NoSQL database.

### Project Objectives
- **Zero-Infrastructure Management:** Eliminate the need to provision, patch, or maintain physical or virtual servers by hosting the entire backend on AWS Lambda and API Gateway.
- **Cost Efficiency (Pay-per-Value):** Implement a scale-to-zero model where cost is directly proportional to actual platform usage, minimizing operating expenses during low-activity periods.
- **Global Low-Latency Delivery:** Serve the single-page application (SPA) frontend close to users globally using Amazon CloudFront and S3, ensuring fast page load times and optimal user experience.
- **Flexible & Scalable Storage:** Design a schema-flexible database using Amazon DynamoDB to handle recipes, meal plans, reviews, and logs with single-digit millisecond response times.
- **Dynamic Nutrient Aggregation:** Enable client-side and server-side compute logic to analyze recipes and log entries to provide immediate macro- and micro-nutrient tracking.

---

## 🎯 2. Project Objectives

The project is evaluated against the following specific technical goals and expected outcomes:

| Objective | Target Metrics / Features | AWS Services Involved |
| :--- | :--- | :--- |
| **High Availability Backend** | Highly available API endpoints handling parallel incoming traffic. | AWS Lambda, Amazon API Gateway |
| **Database Performance** | Low latency CRUD operations for Recipes, Users, Meal Logs, and Ratings. | Amazon DynamoDB |
| **Static Asset Hosting** | Fast loading frontend (Vite/React) with secure HTTPS transmission. | Amazon S3, Amazon CloudFront |
| **Media Storage** | Secure storage and CORS-enabled upload for user-submitted recipe images. | Amazon S3 |
| **Modular Automation** | Standardized deployment workflow using Infrastructure as Code (IaC). | AWS SAM (Serverless Application Model) / CloudFormation |

---

## 🗺️ 3. Architecture Diagram

Below is the conceptual cloud architecture of the NutriBerg Platform, illustrating how components interact across different layers:

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

### Architectural Component Walkthrough
1. **Frontend Layer:** The client application is built with React and Vite. It is compiled into highly optimized static HTML, CSS, and JS files stored in the **Static Site Amazon S3 Bucket**.
2. **Content Delivery Network (CDN):** **Amazon CloudFront** caches these frontend assets at edge locations globally, reducing load times (latency) and terminating HTTPS connections securely.
3. **API Gateway Layer:** All client interactions with backend microservices route through **Amazon API Gateway**. It acts as the gatekeeper, validating and routing HTTP requests to the respective Lambda handler functions.
4. **Serverless Compute Layer:** Backed by **AWS Lambda**, individual node.js handler scripts run only in response to API requests. Compute resources scale automatically to accommodate concurrent requests and terminate on completion.
5. **NoSQL Database Layer:** **Amazon DynamoDB** serves as the persistent database layer, maintaining high throughput and microsecond latency across six decoupled tables (Recipes, Users, Meal Logs, Meal Plans, Ratings, Comments) using custom keys and GSIs (Global Secondary Indexes).

---

## 🔍 4. Project Scope

The boundaries of the NutriBerg project are divided into what was built, how it operates, and the technical requirements met:

### Included in Scope
1. **Infrastructure as Code (IaC):** Fully declarative SAM template to manage API configurations, Lambda runtime settings, S3 CORS, S3 Website policies, DynamoDB Primary Keys/GSIs, and CloudFront distribution behaviors.
2. **Backend API Endpoints (11 Lambda Handlers):**
   - Recipe operations (Fetch All, Fetch Details, Create New, Submit Star Ratings).
   - Meal Logs (Log specific meals by date/type, track calories and macros over time).
   - Meal Plans (Create weekly meal templates, plan meals by day of week).
   - User Profiles (Store dietary constraints, macro goals, and user preferences).
3. **Frontend Application:** A premium dashboard interface detailing:
   - Dynamic charts showing caloric and macronutrient daily splits.
   - Interactive calendar grids for assigning daily breakfast, lunch, dinner, and snacks.
   - Custom recipe creator page with automated ingredient lists.
   - Onboarding modal for intake calculation based on user weight goals.
4. **Data Seed Operations:** Pre-populating the recipe tables with realistic food database structures.

### Excluded from Scope (Future Enhancements)
- **Active User Authentication (Cognito):** Omitted due to restricted sandbox IAM parameters. Handled via local session contexts.
- **Third-Party API Integration (Spoonacular/USDA Databases):** Backend templates include parameters for third-party keys but fallback onto seeded local nutritional datasets for stability in sandboxed networks.

---

## 👥 5. Individual Contributions

The development, design, and execution of this project were completed by the capstone project members as follows:

### Member 1: Anish Jaiswal (Lead Architect & Full-Stack Developer)
- **Contribution Level:** 100% Core Implementation.
- **Tasks Handled:**
  - Designed the NoSQL data modeling for Amazon DynamoDB (Partition Keys, GSIs).
  - Drafted the infrastructure template (`backend/template.yaml`) for AWS Serverless Application Model (SAM).
  - Developed and optimized the 11 backend AWS Lambda functions in JavaScript (Node.js 20.x runtime).
  - Programmed the frontend React SPA dashboard, routing system, state managers, and interactive charts.
  - Configured AWS S3 hosting and S3 Media cors properties to bypass client uploading issues.
  - Successfully debugged IAM permission limits within the AWS Academy Sandbox by configuring pre-existing execution roles (`lambda-run-role`).

### Member 2: Collaborative Peer
- **Contribution Level:** Conceptualization & Brainstorming.
- **Tasks Handled:**
  - Assisted in design reviews and brainstorming the initial platform schema.
  - Provided feedback on the application UI/UX flows.
  - Aided in drafting documentation, slide materials, and verifying functional project goals.

### Member 3 & Member 4
- **Contribution Level:** N/A.

---

*Report prepared for submission as AWS Solutions Architect Capstone Project.*
