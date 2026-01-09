# Expense Tracker

A full-stack expense tracker that lets users securely manage income and expenses using **JWT authentication**.

---

## 🚀 Live Demo

- **Frontend:** https://expense-tracker-1-bugi.onrender.com/
- **Backend API:** https://expense-tracker-qtte.onrender.com

---

## ✅ Features

- Signup / Login
- JWT-based authentication
- Add, edit, delete income & expense transactions
- Each user can access **only their own data**
- Auto logout on unauthorized/expired sessions
- Dashboard with summaries and charts

---

## 🔐 Authentication (JWT)

- Server issues a signed JWT on login
- Token is stored in `localStorage`
- Token is sent in `Authorization: Bearer <token>` for protected routes
- Backend verifies token on every request (stateless auth)

---

## 🌐 REST API Endpoints

| Method | Endpoint | Description |
|------|---------|------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/transactions` | Fetch user transactions |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

All transaction routes are **JWT-protected**.

---

## 🧰 Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Deployment:** Render (Static Site + Web Service)

---

## 🧠 What I Learned

- REST API design
- JWT authentication & authorization
- Secure frontend–backend integration
- Deploying a MERN app with environment variables
