# Blood Share - React Application

A modern React-based blood donation management system with Node.js/Express backend.

## 🏗️ Project Structure

```
Project-Clean/
├── app.js                       # Backend server
├── controllers/                  # API controllers
├── routes/                      # API routes  
├── models/                      # Database models
├── seed-medium.js               # Test data
└── client/                      # React frontend
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── auth/AuthContext.jsx
        ├── components/Nav.jsx
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Signup.jsx
            ├── DonorDashboard.jsx
            ├── HospitalDashboard.jsx
            ├── Camps.jsx
            └── CampDetail.jsx
```

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd Project-Clean
npm install
```

**Frontend:**
```bash
cd Project-Clean/client
npm install
```

### 2. Setup Database
```bash
# Start MongoDB
# Then seed the database
node seed-medium.js
```

### 3. Start Servers

**Backend (Port 1000):**
```bash
cd Project-Clean
node app.js
```

**Frontend (Port 3001):**
```bash
cd Project-Clean/client
npm run dev
```

## 🎯 Features

### For Donors:
- ✅ Registration with location picker (Leaflet map)
- ✅ Dashboard with blood requests, history, and camps
- ✅ Accept/Reject emergency requests
- ✅ View nearby blood camps with timing and distance

### For Hospitals:
- ✅ Registration with location picker
- ✅ Dashboard with all hospital functions integrated:
  - Blood stock management
  - Emergency request creation
  - Blood camp creation
  - Donation recording
  - Request management (sent/incoming)

### Technical Features:
- ✅ React SPA with React Router
- ✅ Authentication with session persistence
- ✅ Leaflet maps for location picking
- ✅ Real-time notifications
- ✅ Responsive design
- ✅ CORS-enabled API
- ✅ MongoDB with geospatial queries

## 📊 Test Data

The `seed-medium.js` script creates:
- 16 hospitals across 4 major cities
- 150 donors with realistic data
- 81 blood camps
- 32 emergencies with notifications
- 212 donation records

## 🔧 Technology Stack

**Frontend:**
- React 18
- React Router DOM
- React Leaflet
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB
- Passport.js
- CORS

## 📱 Usage

1. **Home Page**: `/` - Landing page with navigation
2. **Registration**: `/signup` or `/register-donor` or `/register-hospital`
3. **Login**: `/login`
4. **Donor Dashboard**: `/donor` (requires donor login)
5. **Hospital Dashboard**: `/hospital` (requires hospital login)
6. **Blood Camps**: `/camps` and `/camps/:id`

## 🎨 Key Components

- **DonorDashboard**: Complete donor interface with requests, history, and camps
- **HospitalDashboard**: Complete hospital interface with all management functions
- **Signup**: Registration with Leaflet map integration
- **AuthContext**: Authentication state management

This is a clean, production-ready React application with all functionality integrated into comprehensive dashboard components.
