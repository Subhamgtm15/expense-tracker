# Expense Tracker

A simple full-stack expense tracker that allows users to securely manage their income and expenses using JWT-based authentication.

---

## ✅ Features

- User **Signup & Login**
- **JWT Authentication** for secure access
- Add, edit, and delete **Income / Expense** transactions
- Each user can access **only their own data**
- Auto logout when the session expires or becomes unauthorized
- Dashboard view with summaries and charts

---

## 🔐 Authentication Flow (JWT)

1. User signs up or logs in with username and password  
2. Server verifies credentials and generates a **JWT token**
3. Token is stored in the browser (localStorage)
4. Token is sent with every protected API request
5. Backend verifies the token before allowing access
6. If the token is invalid or expired, the user is logged out automatically

This keeps the application **stateless and secure**.

---

## 🌐 REST API Design

The backend follows REST principles:

| Method | Endpoint | Description |
|------|---------|------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/transactions` | Get user transactions |
| POST | `/api/transactions` | Add a transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

All transaction routes are **protected** using JWT middleware.

---

## 🧰 Tech Stack

**Frontend:** React, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Authentication:** JSON Web Tokens (JWT)

---

## 📌 Why this project

This project was built to practice:
- REST API design
- Authentication & authorization
- Secure backend development
- Frontend–backend integration
- Real-world application structure
