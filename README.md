# 💳 Expo Payment Collection App

A **mobile-based Payment Collection Application** built using **React Native (Expo)**.  
The app allows managing loan customers, viewing loan details, and processing EMI payments through a backend REST API.

This project is developed as part of a **technical assessment** to demonstrate frontend development skills, API integration, clean UI, and real-world loan management workflows.

---

## 📌 Key Features

### 📊 Dashboard
- Total outstanding loan amount
- Total EMI due
- Active loan count
- Average interest rate
- Recently added customers overview

### 👥 Customers
- View all customers
- Search by name or account number
- Sort customers by:
  - Name
  - Outstanding balance
  - EMI amount
  - Interest rate
- View detailed customer profile with loan information

### ➕ Add Customer
- Create new loan accounts
- Proper form validation
- Auto-generated account numbers
- Loan details include:
  - Issue date
  - Interest rate
  - Tenure
  - EMI amount
  - Outstanding balance

### 💸 Payments
- Pay EMI using account number
- Real-time outstanding balance update
- Payment success confirmation
- View complete payment history per customer

---

## 🧱 Tech Stack

### Frontend
- React Native
- Expo Router
- TypeScript
- Lucide React Native Icons
- Expo Linear Gradient

### Backend (API)
- Node.js
- Express.js
- REST APIs
- PostgreSQL / MySQL

---

## 📂 Project Structure

```

app/
├── (tabs)/
│   ├── index.tsx              # Dashboard
│   ├── customers.tsx          # Customer list
│   ├── payments.tsx           # Payments
│   ├── add-customer.tsx       # Add customer
│
├── customer-detail/
│   └── [accountNumber].tsx    # Customer details & payment history
│
├── services/
│   └── api.ts                 # API service layer
│
├── types/
│   └── customer.ts            # TypeScript interfaces
│
├── hooks/
│   └── useFrameworkReady.ts
│
├── _layout.tsx                # Root navigation
└── index.tsx                  # Redirect to tabs

````

---

## 🌐 API Integration

The application communicates with the backend using REST APIs.

### API Base URL

```env
EXPO_PUBLIC_API_BASE_URL=https://uncerebric-karma-nonnitric.ngrok-free.dev/api'
````

If not provided, the app uses a default development URL.

---

## 🔌 API Endpoints Used

### Customers

```http
GET    /customers/
POST   /customers/
```

### Payments

```http
POST   /payments/
GET    /payments/:accountNumber
```

---

## 🧪 Sample API Payload

### Create Payment

```json
{
  "account_number": "ACC123456",
  "amount": 5000
}
```

### Sample Response

```json
{
  "payment_id": 15,
  "new_balance": 95000
}
```

---

## ⚙️ Installation & Setup (For Assessment / Interviewer)

### Prerequisites

* Node.js (v16 or above)
* npm or yarn
* Expo CLI
* Expo Go app (for mobile testing)

---

### Step 1️⃣ Clone the Repository

```bash
git clone https://github.com/harshsingh910/expoPaymentApp.git
cd expoPaymentApp
```

---

### Step 2️⃣ Install Dependencies

```bash
npm install
```

---

### Step 3️⃣ Configure API URL (Optional)

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

> This step is required only if running the backend locally.

---

### Step 4️⃣ Run the Application

```bash
npx expo start
```

* Scan the QR code using **Expo Go**
* Or run on Android / iOS emulator

---

## 🛡 Validation & Error Handling

* Empty field validation
* Numeric validation for EMI and payment amounts
* API error handling with alerts
* Loading indicators and empty states

---

## 🚀 Future Enhancements

* Authentication and role-based access
* Multiple payment modes (UPI / Card / Cash)
* PDF receipt generation
* Push notifications for EMI reminders
* Production deployment

---
📱 APK Download 

To make the application easy to review without local setup, the APK file has been uploaded to Google Drive.

🔽 Download APK

👉 Google Drive Link:

https://drive.google.com/drive/folders/1-dTkfHUOAzeVIlY_IFlrcaknsoefUFdu?usp=sharing

## 👨‍💻 Author

**Harsh Singh**
