# 💪 FitNexus 

This is the **backend** for the Fitness Fusion platform – a full-featured fitness tracker and booking system built with the **MERN** stack. It handles everything from authentication and role-based access to Stripe payments, trainer applications, bookings, forum interactions, and more.


## 🌐 Live Server URL

[server site link](https://fitnexus-production.up.railway.app//)

---

## 🛠️ Tech Stack

- **Server Framework:** Node.js + Express.js
- **Database:** MongoDB (native driver)
- **Authentication:** Firebase Admin SDK, JWT
- **Security:** CORS, Helmet, Express Rate Limit
- **Payment:** Stripe
- **Environment Config:** dotenv
- **Validation:** express-validator
- **Pagination & Filtering:** MongoDB Aggregation
- **Deployment:** Vercel

---

## 🔐 Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=your_mongo_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
FIREBASE_SERVICE_ACCOUNT_KEY=your_firebase_admin_sdk_config
```