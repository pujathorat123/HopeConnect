# HopeConnect ❤️

> **Helping Every Child Smile** — A full-stack community platform connecting NGOs, orphanages, and compassionate individuals who want to support underprivileged children through donations and volunteering.

---

## 🌟 Features

- **❤️ Donation System:** Support children with monetary donations or specific essentials (Food, Clothes, Books, Toys, Medicines, School Bags, Shoes, Hygiene Kits, Healthcare, Education, Child Sponsorship). Connected to MongoDB with live validation and confirmation.
- **🤝 Volunteer Registration:** Join the mission by registering your name, email, and city directly from the landing page or the registration modal.
- **🔐 User Authentication:** Secure account signup and login with hashed passwords (bcrypt), input validation, and user session management.
- **🏢 Featured NGO Showcase:** Explore verified partner NGOs (like Sunshine Orphanage) with full mission details, urgent needs, and direct donation actions.
- **📱 Smooth Navigation:** One-click smooth scrolling across Home, About, NGOs, Volunteer, and Contact sections.
- **🛡️ Resilient Dual-Storage Backend:** Automatically connects to MongoDB Atlas when online, with an automatic resilient local fallback to guarantee zero downtime during local development or network issues.

---

## 🏗️ Architecture & Tech Stack

- **Frontend:**
  - React 19 + Vite
  - Vanilla CSS (custom, responsive styling)
  - Fetch API with configurable environment endpoints (`VITE_API_URL`)
- **Backend:**
  - Node.js & Express 5
  - MongoDB Atlas & Mongoose ODM
  - Password hashing via `bcryptjs`
  - CORS-enabled with credential support
  - Resilient local fallback store

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/pujathorat123/HopeConnect.git
cd HopeConnect
```

### 2. Install Dependencies
You can install dependencies for the root, backend, and frontend with:
```bash
npm run install-all
```
*Or manually:*
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment Variables

**Backend (`backend/.env`):**
```env
MONGO_URI=mongodb+srv://<username>:<password>@hopeconnect.hgypvcn.mongodb.net/hopeconnect?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000
```

> **📌 MongoDB Atlas Whitelist Note:**  
> If using MongoDB Atlas, make sure to add `0.0.0.0/0` (Allow access from anywhere) or your current IP in **MongoDB Atlas → Network Access → IP Access List**. If Atlas is not yet whitelisted or temporarily offline, the backend automatically uses its local storage fallback so all features remain functional.

### 4. Run the Project

**Start Backend (Port 5000):**
```bash
npm run server
# or cd backend && npm start
```

**Start Frontend (Port 5173):**
```bash
npm run client
# or cd frontend && npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status & database connection info |
| `GET` | `/test-db` | MongoDB connectivity check |
| `POST` | `/donations` | Submit a new donation (`name`, `email`, `amount`, `message`) |
| `GET` | `/donations` | Retrieve all donations |
| `POST` | `/volunteers` | Register a new volunteer (`name`, `email`, `city`) |
| `GET` | `/volunteers` | Retrieve registered volunteers |
| `POST` | `/users` | Create a new user account (`name`, `email`, `password`) |
| `POST` | `/login` | User login (`email`, `password`) |
| `GET` | `/ngos` | Retrieve featured NGO information |

---

## 🌐 Deployment Guide

### Deploy Backend (e.g. Render / Railway)
1. Push your repository to GitHub.
2. In Render or Railway, create a new **Web Service**.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. Add Environment Variable:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `NODE_ENV`: `production`
7. Copy your deployed backend URL (e.g. `https://hopeconnect-api.onrender.com`).

### Deploy Frontend (e.g. Vercel / Netlify)
1. In Vercel or Netlify, import the GitHub repository.
2. Set **Root Directory** to `frontend`.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL from the step above.
6. Click **Deploy**!

---

## 📄 License
ISC License © 2026 Puja Thorat
