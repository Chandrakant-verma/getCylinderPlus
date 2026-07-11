# 🔥 getCylinder

> **A Real-Time LPG Cylinder Booking & Delivery Platform**

getCylinder is a full-stack MERN application that connects **customers**, **delivery captains**, and **admins** in a real-time cylinder booking and delivery ecosystem. Customers can book a cylinder, track their delivery captain live on a map, pay securely via Razorpay, and get updates in real time through Socket.IO. Admins get an AI-powered analytics dashboard to monitor business performance.

---

## 📌 Problem Statement

Booking an LPG cylinder traditionally involves phone calls, manual record keeping, and no visibility into delivery status. getCylinder solves this by digitizing the entire flow — from booking to live tracking to payment — while giving the business owner AI-driven insights into orders, revenue, and growth trends.

---

## ✨ Features

### 👤 User
- Register / Login (JWT-based auth)
- Automatic **nearest branch assignment** based on address (via Google Maps Distance Matrix)
- Book a cylinder order
- View current cylinder price
- View & cancel orders
- Get delivery OTP
- Live-track the assigned captain on a map
- Pay via Razorpay after delivery
- Real-time notifications (Socket.IO)

### 🚚 Captain (Delivery Agent)
- Register / Login
- View orders assigned to their branch
- Verify delivery OTP
- Real-time location sharing during delivery
- Get notified instantly once payment is completed

### 🛠 Admin
- Login
- View all users, captains, and orders
- Add new branches
- Set/update cylinder price
- **AI Business Insights** — auto-generated summary of revenue, order trends, and risks
- **Ask Analytics** — ask natural-language questions about business data and get AI answers

### 🗺 Maps
- Address → Coordinates (Geocoding)
- Distance & time between two points
- Autocomplete address suggestions
- Coordinates → Address (Reverse Geocoding)

### 💳 Payments
- Razorpay order creation
- Signature verification
- Automatic order status update on successful payment

### 🔔 Real-Time (Socket.IO)
- Live location updates
- Instant payment confirmation to both user and captain

---

## 🛠 Tech Stack

**Frontend:** React 19, React Router, Axios, Socket.IO Client, GSAP, @react-google-maps/api, React Icons

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, express-validator, Socket.IO, Razorpay SDK

**AI:** HuggingFace Inference API (`Qwen/Qwen2.5-72B-Instruct`)

**Maps:** Google Maps Platform (Geocoding, Distance Matrix, Places Autocomplete)

---

## 📂 Project Structure

```
getCylinder/
│
├── backend/
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── captain.controller.js
│   │   ├── user.controller.js
│   │   ├── map.controller.js
│   │   └── payment.controller.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── captain.routes.js
│   │   ├── user.routes.js
│   │   └── map.routes.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── captain.model.js
│   │   ├── admin.model.js
│   │   ├── branch.model.js
│   │   ├── order.model.js
│   │   └── cylinder.model.js
│   ├── middlewares/
│   │   └── auth.middleware.js
│   ├── services/
│   ├── socket.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── pages/
        ├── components/
        └── App.jsx
```

---

## ⚙️ Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Razorpay account (test keys)
- Google Maps API key
- HuggingFace API key

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

---

## 🔐 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

GOOGLE_MAPS_API=your_google_maps_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## ▶️ Running the Project

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

---

## 🌐 High-Level Flow

```
User Registers
      │
      ▼
Nearest Branch Auto-Assigned
      │
      ▼
Book Cylinder Order (OTP generated)
      │
      ▼
Captain (same branch) sees the order
      │
      ▼
Live Tracking (Socket.IO)
      │
      ▼
Captain Verifies Delivery OTP
      │
      ▼
Razorpay Payment
      │
      ▼
Payment Verified → Order Delivered
      │
      ▼
Real-time notification to User & Captain
```

---

## 🔒 Authentication

All protected routes require a JWT, sent either as a cookie (`token`) or as a Bearer token:

```
Authorization: Bearer <token>
```

There are three separate auth middlewares: `authUser`, `authCaptain`, and `authAdmin`, each validating the token against the respective collection.

---

# 📖 API Documentation

Base URL: `http://localhost:5000`

---

## 🧑 User Routes — `/users`

### `POST /users/register`
Registers a new user and auto-assigns the nearest branch.

**Request Body**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "123456",
  "address": "MG Road, Raipur",
  "contactNumber": "9876543210"
}
```

**Success Response — 201**
```json
{
  "message": "Registration successful!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "66f1...",
    "name": { "firstName": "John", "lastName": "Doe" },
    "email": "john@example.com",
    "address": "MG Road, Raipur",
    "contactNumber": "9876543210",
    "branch": "66f0..."
  }
}
```

**Error — 400 (validation)**
```json
{
  "errors": [
    { "msg": "Valid email is required", "path": "email" }
  ]
}
```

**Error — 400 (already exists)**
```json
{ "message": "User already exist" }
```

---

### `POST /users/login`
**Request Body**
```json
{ "email": "john@example.com", "password": "123456" }
```

**Success — 200**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "_id": "66f1...", "email": "john@example.com" }
}
```

**Error — 401**
```json
{ "message": "Invalid email or password" }
```

---

### `GET /users/profile` 🔒 (authUser)
**Success — 200**
```json
{
  "_id": "66f1...",
  "name": { "firstName": "John", "lastName": "Doe" },
  "email": "john@example.com",
  "branch": "66f0..."
}
```

---

### `POST /users/logout` 🔒
**Success — 200**
```json
{ "message": "Logged out" }
```

---

### `POST /users/orders` 🔒
Creates a new order with an auto-generated 6-digit delivery OTP.

**Request Body**
```json
{
  "totalAmount": 950,
  "shippingAddress": "MG Road, Raipur",
  "branch": "66f0..."
}
```

**Success — 201**
```json
{
  "message": "Order placed successfully",
  "order": {
    "_id": "66f2...",
    "user": "66f1...",
    "totalAmount": 950,
    "shippingAddress": "MG Road, Raipur",
    "paymentStatus": "pending",
    "deliveryStatus": "pending",
    "deliveryOTP": "482913",
    "branch": "66f0..."
  }
}
```

---

### `GET /users/orders` 🔒
**Success — 200**
```json
{
  "orders": [
    {
      "_id": "66f2...",
      "totalAmount": 950,
      "deliveryStatus": "pending",
      "paymentStatus": "pending"
    }
  ]
}
```

---

### `GET /users/orders/cancel` 🔒
**Success — 200**
```json
{
  "message": "Order cancelled successfully",
  "order": { "_id": "66f2...", "deliveryStatus": "cancelled" }
}
```

**Error — 404**
```json
{ "message": "Order not found" }
```

---

### `GET /users/price` 🔒
**Success — 200**
```json
{ "price": 850 }
```

---

### `GET /users/get-otp` 🔒
Returns the OTP for the user's currently pending order.

**Success — 200**
```json
"482913"
```

---

### `POST /users/create-order` 🔒
Creates a Razorpay order once the captain has marked the delivery as **reached**.

**Success — 200**
```json
{
  "orderId": "order_Nc9X...",
  "amount": 95000,
  "currency": "INR",
  "key": "rzp_test_xxxxxxxx"
}
```

**Error — 404**
```json
{ "message": "No pending payment found" }
```

---

### `POST /users/verify` 🔒
Verifies the Razorpay payment signature.

**Request Body**
```json
{
  "razorpay_order_id": "order_Nc9X...",
  "razorpay_payment_id": "pay_Nc9Y...",
  "razorpay_signature": "a1b2c3..."
}
```

**Success — 200**
```json
{ "success": true }
```

**Error — 400**
```json
{ "message": "Invalid payment" }
```

---

### `DELETE /users/delete` 🔒
Deletes the current user account.

---

## 🚚 Captain Routes — `/captains`

### `POST /captains/register`
**Request Body**
```json
{
  "firstName": "Ravi",
  "lastName": "Kumar",
  "email": "ravi@example.com",
  "password": "123456",
  "address": "Shankar Nagar, Raipur",
  "contactNumber": "9998887771",
  "branch": "66f0..."
}
```

**Success — 201**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "captain": {
    "_id": "66f3...",
    "name": { "firstName": "Ravi", "lastName": "Kumar" },
    "email": "ravi@example.com",
    "branch": "66f0..."
  }
}
```

---

### `POST /captains/login`
**Request Body**
```json
{ "email": "ravi@example.com", "password": "123456" }
```

**Success — 200**
```json
{ "token": "eyJhbGciOiJIUzI1NiIs...", "captain": { "_id": "66f3..." } }
```

**Error — 401**
```json
{ "message": "Invalid email or password" }
```

---

### `GET /captains/profile` 🔒 (authCaptain)
**Success — 200**
```json
{ "captain": { "_id": "66f3...", "email": "ravi@example.com" } }
```

---

### `POST /captains/logout` 🔒
**Success — 200**
```json
{ "message": "Logout successfully" }
```

---

### `GET /captains/assigned-orders` 🔒
Returns orders belonging to the captain's branch that are pending, or reached but not yet paid.

**Success — 200**
```json
{
  "orders": [
    {
      "_id": "66f2...",
      "totalAmount": 950,
      "deliveryStatus": "pending",
      "shippingAddress": "MG Road, Raipur"
    }
  ]
}
```

---

### `POST /captains/verifyOtp` 🔒
**Request Body**
```json
{ "orderId": "66f2...", "otp": "482913" }
```

**Success — 200**
```json
{
  "success": true,
  "paymentRequired": true,
  "orderId": "66f2...",
  "amount": 950
}
```

**Error — 400**
```json
{ "message": "Invalid OTP" }
```

**Error — 404**
```json
{ "message": "Order not found" }
```

---

### `GET /captains/get-branches`
No auth required. Used during captain signup to populate the branch dropdown.

**Success — 200**
```json
{
  "branches": [
    { "_id": "66f0...", "branchName": "Raipur Central", "branchAddress": "MG Road, Raipur" }
  ]
}
```

---

## 🛠 Admin Routes — `/admins`

### `POST /admins/login`
**Request Body**
```json
{ "email": "admin@getcylinder.com", "password": "admin123" }
```

**Success — 200**
```json
{ "token": "eyJhbGciOiJIUzI1NiIs...", "admin": { "_id": "66f4..." } }
```

**Error — 404**
```json
{ "message": "No admin found with this email" }
```

---

### `GET /admins/profile` 🔒 (authAdmin)
**Success — 200**
```json
{ "_id": "66f4...", "email": "admin@getcylinder.com" }
```

---

### `GET /admins/users` 🔒
**Success — 200**
```json
[
  {
    "_id": "66f1...",
    "name": { "firstName": "John", "lastName": "Doe" },
    "email": "john@example.com",
    "branch": { "_id": "66f0...", "branchName": "Raipur Central" }
  }
]
```

---

### `GET /admins/captains` 🔒
**Success — 200**
```json
[
  {
    "_id": "66f3...",
    "name": { "firstName": "Ravi", "lastName": "Kumar" },
    "branch": { "_id": "66f0...", "branchName": "Raipur Central" }
  }
]
```

---

### `GET /admins/orders` 🔒
**Success — 200**
```json
[
  {
    "_id": "66f2...",
    "totalAmount": 950,
    "deliveryStatus": "delivered",
    "paymentStatus": "paid",
    "branch": { "branchName": "Raipur Central" },
    "user": { "name": { "firstName": "John" } }
  }
]
```

---

### `POST /admins/branches` 🔒
**Request Body**
```json
{
  "branchName": "Raipur Central",
  "branchAddress": "MG Road, Raipur",
  "contactNumber": "9990001112"
}
```

**Success — 201**
```json
{
  "message": "Branch created successfully",
  "branch": {
    "_id": "66f0...",
    "branchName": "Raipur Central",
    "branchAddress": "MG Road, Raipur",
    "contactNumber": "9990001112"
  }
}
```

---

### `GET /admins/getBusinessInsights` 🔒
Aggregates order data and asks an LLM (via HuggingFace) to summarize business health.

**Success — 200**
```json
{
  "insights": "Orders have grown 12% month-over-month with a healthy delivery rate of 91%. Cancellations remain low at 4%. Based on current trends, expect approximately 240 orders and ₹2,04,000 in revenue next month. Recommend increasing captain staffing in Raipur Central branch to handle peak-hour demand..."
}
```

---

### `POST /admins/askAnalytics` 🔒
Ask a natural-language question about the business; answered using live order/branch data as context.

**Request Body**
```json
{ "question": "Which branch is performing the best this month?" }
```

**Success — 200**
```json
{
  "answer": "Raipur Central is the top-performing branch this month with 87 orders and ₹73,950 in revenue, a 6% cancellation rate — the lowest among all branches..."
}
```

**Error — 400**
```json
{ "message": "Question is required" }
```

---

### `GET /admins/setPrice` 🔒
**Query Params:** `?price=880`

**Success — 200**
```json
{ "_id": "66f5...", "price": 880 }
```

**Error — 400**
```json
{ "message": "Price is required" }
```

---

## 🗺 Maps Routes — `/maps`

### `GET /maps/get-coordinates` 🔒 (authUser)
**Query:** `?address=MG Road, Raipur`

**Success — 200**
```json
{ "ltd": 21.2514, "lng": 81.6296 }
```

**Error — 404**
```json
{ "message": "Coordinates not found" }
```

---

### `GET /maps/get-distance-time` 🔒
**Query:** `?origin=MG Road, Raipur&destination=Shankar Nagar, Raipur`

**Success — 200**
```json
{
  "distance": { "text": "4.2 km", "value": 4200 },
  "duration": { "text": "12 mins", "value": 720 }
}
```

---

### `GET /maps/get-suggestions` 🔒
**Query:** `?input=MG Ro`

**Success — 200**
```json
[
  "MG Road, Raipur, Chhattisgarh, India",
  "MG Road, Bhilai, Chhattisgarh, India"
]
```

---

### `GET /maps/get-address-from-coordinate`
**Query:** `?lat=21.2514&lng=81.6296`

**Success — 200**
```json
{ "address": "MG Road, Raipur, Chhattisgarh 492001, India" }
```

---

## 💳 Payment Flow (Razorpay)

```
Captain verifies delivery OTP
        │
        ▼
deliveryStatus = "reached"
        │
        ▼
User calls POST /users/create-order
        │
        ▼
Razorpay Order Created
        │
        ▼
User completes payment on Razorpay Checkout
        │
        ▼
User calls POST /users/verify
        │
        ▼
Signature Verified (HMAC SHA256)
        │
        ▼
paymentStatus = "paid", deliveryStatus = "delivered"
        │
        ▼
Socket.IO event "payment_completed" → sent to User & Captain
```

---

## 🔔 Socket.IO Events

| Event | Emitted By | Payload | Purpose |
|---|---|---|---|
| `payment_completed` | Server | `{ orderId }` | Notifies captain payment succeeded |
| `payment_completed` | Server | `{ orderId, userId }` | Notifies user payment succeeded |

> Location-sharing events are handled on the frontend via `socket.io-client` for live tracking between User and Captain.

---

## 🗄 Database Models (Overview)

| Model | Key Fields |
|---|---|
| **User** | name, email, password, address, contactNumber, branch |
| **Captain** | name, email, password, address, contactNumber, branch, socketId |
| **Admin** | email, password |
| **Branch** | branchName, branchAddress, contactNumber |
| **Order** | user, branch, totalAmount, shippingAddress, deliveryOTP, deliveryStatus, paymentStatus, razorpayOrderId, razorpayPaymentId |
| **Cylinder** | price |

---

## 🚀 Future Improvements

- OTP delivery via SMS/WhatsApp instead of in-app display
- Captain live-location persistence in DB for delivery analytics
- Admin ability to reassign orders between branches
- Refund handling for cancelled/paid orders
- Rating & review system for captains
- Push notifications (Web Push / FCM)

---

