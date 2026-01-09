

# **Project Plan: DigitalCred**

### *A Low-Friction Digital Credibility System for Small-Scale Entrepreneurs*

---

## 1. Problem Statement

Small-scale entrepreneurs often lack a digital identity and credible online presence due to complex KYC requirements. This limits customer trust in informal and local businesses operating outside traditional platforms.

---

## 2. Project Goal

To build a **low-friction digital trust platform** that enables local businesses to establish credibility using **community verification, activity signals, and transparent trust scoring**, instead of heavy KYC processes.

---

## 3. Proposed Solution

**DigitalCred** is a web-based platform where local businesses can create a digital profile and gain credibility through:

* Community verification
* Customer reviews
* Activity-based trust scoring



---

## 4. Key Features

* OTP-based business onboarding
* Public business profile with shareable link and QR code
* Community verification and customer reviews
* Dynamic trust score based on activity and validations
* Reporting system and admin moderation dashboard

---

## 5. Technologies Used

### Frontend

* **Next.js** (React Framework)
* **Tailwind CSS**

### Backend

* **Node.js**
* **Next.js API Routes** (or Express.js if separated)

### Database & ORM

* **PostgreSQL**
* **Prisma ORM**

### Caching & Performance

* **Redis** (for OTPs, trust score caching, rate limiting)

### Authentication

* **OTP-based Authentication** (Phone / Email)

### DevOps & Deployment

* **Docker** (Containerization)
* **GitHub Actions** (CI/CD)
* **AWS / Azure** (Cloud deployment)


## 6. 4-Week Sprint Plan

**Week 1**

* Requirement analysis
* UI/UX design
* Project setup (Next.js, Prisma, PostgreSQL)

**Week 2**

* OTP authentication
* Business onboarding
* Profile creation

**Week 3**

* Trust score algorithm
* Community verification
* Reviews and ratings system

**Week 4**

* Testing and bug fixes
* Deployment using Docker
* Demo and documentation preparation

---

## 7. Success Criteria

* Business onboarding completed in under **2 minutes**
* Trust score updates dynamically based on activity
* Public and shareable business profile
* Fully deployed and functional application



## Environment Variables Management

This project uses environment variables to manage configuration securely.
The .env.local file stores sensitive values such as database credentials and is ignored by Git, while .env.example is committed as a template for required variables.

Server-side secrets like DATABASE_URL are used only in backend code, and only variables prefixed with NEXT_PUBLIC_ are accessible on the client.
To replicate the setup, copy .env.example to .env.local, fill in the required values, and run the project normally.


## Branching Strategy & Naming Conventions for DigitalCred

**How this helps:**
This workflow ensures consistent code quality through reviews and automated checks.
It improves team collaboration by enforcing clear processes and shared standards.
It increases development velocity by reducing errors, rework, and merge conflicts.

**Consistent pattern for your team’s branches:**

**feature/<feature-name>** - New features or enhancements.

**errorfix/<issue-description>** - Bug fixes.

**task/<task-name>** - Specific tasks or chores.

**guide/<documentation-topic>** - Documentation updates.


Example : 
* feature/user-authentication
* errorfix/login-issue  
* task/setup-docker
* guide/api-documentation

## Pull Request Template

In digital/.github/pull_request_template.md



