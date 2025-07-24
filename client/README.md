# 💪 FitNexus 

Welcome to **Fitness Fusion**, a modern fitness tracking platform where technology meets transformation. Whether you're a beginner, a fitness enthusiast, or a professional trainer – Fitness Fusion helps you track progress, book personal sessions, access classes, and engage with a passionate fitness community.

## 🔑 Admin Credentials

- **Email:** admin@example.com  
- **Password:** Admin@123456

## 🌐 Live Site

[Live Website Link](https://fitness-tracker-app-d0923.web.app)

---

## 🚀 Features at a Glance

1. 🔐 **Role-Based Access System**: Three roles - Admin, Trainer, and Member - with distinct dashboards and route restrictions.
2. 💳 **Stripe Payment Integration**: Secure checkout for booking trainers and choosing packages.
3. 📅 **Dynamic Slot Booking System**: Trainers can add time slots; members can book by class and slot.
4. 📊 **Dashboard with Charts**: Admin dashboard includes pie/bar chart comparing newsletter subscribers vs paid members.
5. 🧾 **Activity Logs & Feedback System**: Members can track application status, submit reviews with star ratings.
6. 🧠 **JWT Protected Routes**: Authentication using Firebase + custom JWT token stored in localStorage for API security.
7. 🖼️ **Unique Responsive Design**: Fully mobile/tablet/desktop optimized with custom styling using Tailwind and other component libraries (excluding DaisyUI).
8. 📬 **Newsletter Subscription**: Users can subscribe without logging in – saved in MongoDB.
9. 📚 **Forum with Voting**: Quora-like forum system with pagination, vote system, and admin/trainer badges.
10. 🔍 **Search Classes by Name**: Search functionality on All Classes Page using backend filtering with case-insensitive support.

---

## 🧪 Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, React Helmet, React Select, SweetAlert2, TanStack Query
- **Authentication:** Firebase (email/password + social login)
- **State/Data Management:** Context API, TanStack Query
- **Authorization:** JSON Web Token (JWT)
- **Notifications:** SweetAlert2 & Toasts
- **Payment:** Stripe
- **Form Handling:** React Hook Form
- **Carousel & Pagination:** SwiperJS, Backend pagination for classes and forums

---

## 🛠️ Key Client-Side Functionalities

- ✅ Responsive Navbar & Footer (conditional rendering based on role/login state)
- ✅ Helmet-based dynamic page title per route
- ✅ Protected routes using private routes and token verification
- ✅ All CRUD operations show toast/sweetalert feedback
- ✅ Fetching data (GET) powered by TanStack Query only
- ✅ Environment variables used to hide Firebase keys
- ✅ Classes & Trainers pagination (6 per page)
- ✅ Forum posts with badge icons for Admin/Trainer
- ✅ Star review + comment modal for booked trainers
- ✅ Slot deletion with confirmation modal
- ✅ Newsletter data stored via public form

---

## 🧭 Navigation Structure
```bash

- `/`: Homepage
- `/trainers`: All Trainers Page
- `/classes`: All Classes Page
- `/community`: Forum Page
- `/login`: Login Page
- `/register`: Registration Page
- `/trainer-details/:id`: Trainer Details Page
- `/booking/:slotId`: Book a Slot Page
- `/payment`: Payment Page (Stripe)
- `/dashboard`: Role-based Dashboard (Admin/Trainer/Member)
```
---

## 🔐 Private Routes with JWT

- Custom `PrivateRoute` checks token validity
- Token generated and stored in `localStorage` upon login
- Server routes protected with 401/403 handling
- Both email/password and social login generate valid JWT

---

## 📁 Project Structure
```bash
src/
├── assets/
├── components/
│ └── shared/
├── context/
├── hooks/
├── layout/
├── pages/
│ ├── Home/
│ ├── Auth/
│ ├── Classes/
│ ├── Trainers/
│ ├── Community/
│ ├── Dashboard/
├── routes/
├── utils/
└── App.jsx
```


---


---

## 📌 Environment Variables (.env)
```bash
VITE_API_BASE_URL=https://fitnessfusion-server.vercel.app
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
```
...
🛠️ Installation & Setup
```bash
git clone https://github.com/Hira703/FitNexus
cd client
npm install
npm run dev
```
🧡 Credits
UI Inspiration: Behance, Dribbble, ThemeForest

Icons: HeroIcons, Phosphor Icons

Charting: Recharts

Component Libraries: Flowbite React, Headless UI

Image Hosting: Cloudinary

🤝 Connect
For queries or feedback:
soniahira48@gmail.com

