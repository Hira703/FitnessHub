# 🏋️‍♀️ FitNexus - Fitness Tracker Platform

FitNexus is a role-based fitness coaching platform designed to connect members with certified trainers. It provides a dynamic, feature-rich experience for Admins, Trainers, and Members to manage fitness activities, book personalized sessions, join classes, and engage in a supportive fitness community.

## 🚀 Live Links

- **Client (React + Tailwind CSS + DaisyUI):** [Client Site Link](https://fitness-tracker-app-d0923.web.app)
- **Server (Node.js + Express + MongoDB):** [Server Site Link](https://server-murex-rho-32.vercel.app/)

---

## 📦 Tech Stack

- **Frontend:** React, Tailwind CSS, DaisyUI, TanStack Query, React Router DOM, Framer Motion
- **Backend:** Node.js, Express.js, MongoDB (Aggregation Pipeline)
- **Authentication:** Firebase, JWT
- **Payments:** Stripe
- **Image Upload:** Cloudinary
- **Deployment:** Firebase (Client), Vercel (Server)

---

## 👥 User Roles

- **Admin** 🛠️
- **Trainer** 🧑‍🏫
- **Member** 🧘‍♀️

---

## 🔐 Authentication & Authorization

- Firebase Authentication (Email/Password & Social Login)
- JWT-based secure routes
- Protected Role-Based Dashboards
- Conditional Navbar UI

---

## 🧭 Navbar Features

- Home
- All Trainers
- All Classes
- Community/Forum
- Conditional: Dashboard, Profile, Login/Logout (based on login state)

---

## 📝 Registration & Login

- Register with Name, Email, Password, and Photo URL
- Auto assigns role: `member`
- Login with Email/Password or Social Auth
- Error handling for invalid credentials
- User info stored in MongoDB

---

## 🏠 Homepage Sections

- **Banner:** Hero section with CTA button linking to Classes
- **Featured Features:** Cards highlighting site features
- **About Us:** Info about the platform and goals
- **Featured Classes:** Top 6 most-booked classes (MongoDB aggregation)
- **Testimonials:** 3-card carousel slider, dynamically pulled from user-submitted reviews
- **Latest Forum Posts:** 6 recent community posts with links
- **Newsletter:** Subscription form storing data in MongoDB
- **Trainer Team:** Display of 3 trainers with image and expertise

---

## 📚 All Classes Page

- Paginated list (6 per page)
- Search by class name (case-insensitive, backend-filtered)
- Class details with trainer images (clickable to Trainer Details)

---

## 👥 All Trainers Page

- Display all trainer profiles
- Show name, image, experience, social links, and available slots
- "Know More" → Redirects to Trainer Details Page

---

## 📄 Trainer Details Page

- Trainer Info: Image, bio, expertise
- Available Slots: Clickable slot buttons → redirects to booking
- **Be a Trainer CTA:** Button leading to trainer application form

---

## 🗓️ Trainer Booking Page

- Show Trainer Info, Selected Slot, Classes, Membership Packages
- Packages: Basic ($10), Standard ($50), Premium ($100)
- "Join Now" → Redirects to Stripe Payment Page

---

## 💳 Stripe Payment Page

- Show:
  - Trainer Name
  - Slot
  - Package
  - User Name/Email
- Stripe Integration:
  - On success → Save booking in DB
  - Increase booking count
  - Redirect to dashboard

---

## 📥 Be a Trainer Page

- Form with:
  - Name, Email (read-only), Age, Profile Image
  - Skills (checkbox)
  - Available Days (React Select)
  - Available Time
- Status set to "Pending" on submission

---

## 📃 Forum Page

- Paginated posts (6 per page)
- Voting System (Upvote/Downvote like Quora)
- Admin/Trainer Badge Display on posts

---

## 🧠 Dashboard (Private)

> Layout is role-specific. Navbar & Footer are hidden inside the dashboard.

---

### 👨‍💼 Admin Dashboard Features

- **All Newsletter Subscribers**
- **All Trainers**: Demote trainer to member
- **Applied Trainers**: View, Accept/Reject with feedback modal
- **Balance Overview**: Show Total Balance, Last 6 Transactions, Chart of Subscribers vs Members
- **Add New Class**: Form to add class (saved to DB)
- **Add New Forum**

---

### 🧑‍🏫 Trainer Dashboard Features

- **Manage Slots**: View/Delete slots
- **Add New Slot**: Pre-filled form with available days and trainer info
- **Add Forum Post**

---

### 👩‍🎓 Member Dashboard Features

- **Activity Log**: Shows application status if applied as trainer (Pending/Rejected), with modal for rejection reason
- **Profile Page**: Edit name, photo; view last login (read-only email)
- **Booked Trainer Page**:
  - View Trainer/Slot/Class Info
  - **Leave Review** (Modal with star rating, text)
- Reviews appear dynamically on the homepage

---

## 🎯 Challenging Features

- 🔎 **Backend Search** on Classes page
- 🏷️ **Admin/Trainer Badge** on Forum posts
- ❌ **Reject Trainer Modal** with editable feedback and user removal

---

## ⚙️ ENV Configuration

```bash
VITE_API_BASE_URL=your_server_url
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_CLOUDINARY_CLOUD_NAME=your_name
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_uri
# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123456
```
📦 Installation & Run Locally

# Clone the repository
```bash
git clone https://github.com/Hira703/FitNexus
cd FitNexus


# Install client dependencies
cd client
npm install
npm run dev

# Install server dependencies
cd ../server
npm install
nodemon server.js
```
🤝 Contributing
Pull requests are welcome. For significant changes, open an issue first to discuss what you would like to change.

📄 License
MIT License © 2025 FitNexus