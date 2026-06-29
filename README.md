# JJ Financial Services

A modern, responsive, and production-ready **Full Stack Loan Management Platform** built using the **MERN Stack**. The application provides a seamless experience for customers to apply for loans, track loan status, and manage their profiles, while administrators can efficiently manage loan applications, customer records, website content, and business operations through a secure dashboard. The project follows industry-standard architecture, responsive UI design, JWT authentication, RESTful APIs, and scalable backend practices. 

---

## 🚀 Features

### 🌐 Public Website

* Responsive landing page
* Professional fintech-inspired UI
* Loan history showcase
* About Us page
* Contact page with email support
* EMI Calculator
* Customer Testimonials
* FAQ Section
* Animated statistics
* Loan Types
* Responsive navigation and footer

### 👤 Customer Portal

* Secure Registration & Login
* JWT Authentication
* Customer Dashboard
* Apply for Loan
* Upload Documents
* Track Loan Status
* View Loan History
* Profile Management
* Password Update

### 🛠 Admin Portal

* Secure Admin Dashboard
* Manage Loan Applications
* Approve / Reject Loans
* Manage Loan History
* Manage Customers
* Manage Testimonials
* Manage Contact Messages
* Manage Website Content (CMS)
* Website Settings
* Analytics Dashboard

### 📊 Dashboard Features

* Loan Statistics
* Monthly Reports
* Loan Distribution Charts
* Customer Analytics
* Success Rate Visualization

---

# 🛠 Tech Stack

## Frontend

* React.js (Vite)
* Tailwind CSS
* Redux Toolkit
* RTK Query
* React Hook Form
* Zod
* Framer Motion
* Recharts
* Lucide React
* Axios

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt
* Multer
* Cloudinary
* Nodemailer

---

# 📂 Project Structure

```text
jj-financial-services/
│
├── client/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
└── README.md
```

The project follows a clean separation between frontend and backend for better scalability and maintainability. 

---

# ✨ Main Modules

## Public Pages

* Home
* About
* Loan History
* Contact
* Login
* Register

## Customer Dashboard

* Dashboard Overview
* Profile
* Apply Loan
* My Loans
* Loan Status
* Edit Profile
* Logout

## Admin Dashboard

* Dashboard Analytics
* Loan Management
* Customer Management
* Testimonials
* Contact Messages
* Website CMS
* Gallery Management
* Website Settings
* Account Settings



---

# 🔐 Authentication

* JWT Authentication
* Role-Based Access Control
* Admin Authorization
* Customer Authorization
* Password Encryption using bcrypt
* Protected Routes

---

# 📡 REST APIs

### Authentication

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Customer APIs

```
GET    /api/v1/customer/profile
PUT    /api/v1/customer/profile
POST   /api/v1/customer/apply
GET    /api/v1/customer/loans
GET    /api/v1/customer/loans/:id
```

### Admin APIs

```
GET    /api/v1/admin/dashboard
POST   /api/v1/admin/loans
PUT    /api/v1/admin/loans/:id
DELETE /api/v1/admin/loans/:id
```

### Contact API

```
POST /api/v1/contact
```



---

# 💾 Database Models

* User
* Loan Record
* Loan Application
* Contact Message
* Testimonial
* Site Settings



---

# ⚙️ Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
EMAIL_TO=

VITE_API_BASE_URL=http://localhost:5000/api/v1
```



---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/jj-financial-services.git
```

## Install Frontend

```bash
cd client
npm install
```

## Install Backend

```bash
cd ../server
npm install
```

## Start Backend

```bash
npm run dev
```

## Start Frontend

```bash
cd ../client
npm run dev
```

---

# 🔒 Security Features

* JWT Authentication
* Password Hashing (bcrypt)
* HTTP Only Cookies
* Role-Based Authorization
* Express Validator
* Helmet.js
* Rate Limiting
* CORS Protection
* Global Error Handling



---

# 📱 Responsive Design

The application is fully responsive and optimized for:

* 📱 Mobile
* 📱 Tablet
* 💻 Laptop
* 🖥 Desktop

---

# 🎨 UI Highlights

* Premium FinTech Design
* Interactive EMI Calculator
* Smooth Animations
* Professional Dashboard
* Responsive Cards
* Interactive Charts
* Modern Navigation
* Mobile Friendly Layout

---

# 🌟 Future Enhancements

* SMS Notifications
* OTP Verification
* Two-Factor Authentication
* AI Loan Recommendation System
* Multi-language Support
* Dark Mode
* Document OCR Verification

---

## 📄 License

This project is developed for **JJ Financial Services** and is intended for educational and business purposes. All rights reserved.
