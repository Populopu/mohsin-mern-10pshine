# 📝 MERN Notes Application

A full-stack **MERN (MongoDB, Express, React, Node.js)** Notes Management Application with authentication, profile management, avatar upload, password management, and complete unit testing using **Mocha/Chai (Backend)** and **Jest (Frontend)**.

---

## 🚀 Features

### 🔐 Authentication

* User Signup & Login
* JWT-based authentication
* Protected routes
* Secure password hashing

### 👤 User Profile

* View user profile
* Upload/change avatar image
* Change password with validation
* Default avatar fallback

### 🗒 Notes Management

* Create notes
* View notes
* Update notes
* Delete notes
* User-specific notes access

### 🎨 UI/UX

* Dark mode support
* Profile modal with background blur
* Responsive dashboard interface
* Toast notifications for actions

### ✅ Testing

* Backend unit testing using **Mocha + Chai + Sinon**
* Frontend unit testing using **Jest + React Testing Library**
* Controller, routes, and validation testing
* UI and API interaction testing

---

## 🏗 Tech Stack

### Frontend

* React
* React Router
* Context API
* Fetch API
* Jest
* React Testing Library

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Multer (File Uploads)
* Mocha
* Chai
* Sinon

---

## 📁 Project Structure

```
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── notesController.js
│   └── userController.js
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── upload.js
│
├── models/
│   ├── user.js
│   └── notes.js
│
├── routes/
│   ├── authRoutes.js
│   ├── notesRoutes.js
│   └── userRoutes.js
│
├── utils/
│   ├── logger.js
│   └── validators.js
│
├── tests/
│   ├── auth/
│   ├── notes/
│   └── user/
│
└── index.js


frontend/
│
├── components/
│   ├── profile/
│   ├── profileModal/
│   ├── confirmModal.jsx
│   ├── navbar/
│   ├── notesCard/
│   └── notesEditor/
│
├── pages/
│   ├── dashboard.jsx
│   ├── login/
│   ├── signup/
│   ├── forgotPassword/
│   └── resetPassword/
│
├── utils/
│   ├── auth.js
│   └── date.js
│
├── __tests__/
│   ├── auth/
│   ├── notes/
│   └── user/
│
└── App.jsx
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/mern-notes-app.git
cd mern-notes-app
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🧪 Running Tests

---

### ✅ Backend Tests (Mocha + Chai)

```bash
cd backend
npm test
```

Tests include:

* Authentication (Signup/Login)
* Validation middleware
* Notes CRUD operations
* Avatar upload
* Change password

---

### ✅ Frontend Tests (Jest)

```bash
cd frontend
npm test
```

Tests include:

* Authentication pages
* Profile modal
* Avatar upload UI
* Notes components
* Validation error handling

---

## 🔒 API Endpoints

### Auth Routes

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | `/api/auth/signup` | Register user |
| POST   | `/api/auth/login`  | Login user    |

---

### Notes Routes

| Method | Endpoint         | Description    |
| ------ | ---------------- | -------------- |
| GET    | `/api/notes`     | Get user notes |
| POST   | `/api/notes`     | Create note    |
| PUT    | `/api/notes/:id` | Update note    |
| DELETE | `/api/notes/:id` | Delete note    |

---

### User Routes

| Method | Endpoint                    | Description     |
| ------ | --------------------------- | --------------- |
| GET    | `/api/user/profile`         | Get profile     |
| PUT    | `/api/user/avatar`          | Upload avatar   |
| PUT    | `/api/user/change-password` | Change password |

---

## 🧩 Key Concepts Implemented

* RESTful API architecture
* MVC backend structure
* Middleware-based validation
* Secure authentication using JWT
* File uploads with Multer
* Component-based React architecture
* Protected routing
* Unit testing across frontend & backend

---

## 📊 Testing Coverage

The project includes tests for:

✅ Controllers
✅ Routes
✅ Middleware validations
✅ API responses
✅ UI interactions
✅ Error handling flows

---

## 🧠 Learning Outcomes

This project demonstrates:

* Full-stack MERN development
* Secure authentication systems
* API design best practices
* Real-world testing strategies
* Debugging and state management
* Production-level project structure

---

## 👨‍💻 Author

**Mohsin Shakeel**

Aspiring Software Engineer | MERN Stack Developer

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
