# 🩸 Real-Time Blood Donation Network  
### _Connecting Every Drop, Saving Every Second_  

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)](https://github.com/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)

---

## 🚀 Overview  
The **Real-Time Blood Donation Network** is an innovative web platform built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) and **Firebase**, designed to **connect donors, hospitals, and patients in real time**.  

It bridges the gap between blood availability and emergency need by offering **instant alerts**, **live location tracking**, **transparent hospital inventory**, and **smart donor matching** — ensuring **no life is lost due to delay or lack of coordination**.  

---

## ⚡ Key Features  

### 🧠 Smart Matching System  
- Matches donors to the nearest hospitals/patients based on **real-time geolocation**.  
- Filters donors by **eligibility (90–120 days rule)** and **blood group**.  
- Uses **Firebase Cloud Messaging (FCM)** for **instant notification alerts**.

### 🏥 Hospital Management Dashboard  
- Hospitals can **update blood stock**, **request blood units**, and **share surplus** with nearby centers.  
- Secure hospital verification to prevent misuse or false data.  
- Transparent inventory interface built with **React.js** and **Tailwind CSS**.

### 📍 Real-Time Location Tracking  
- Integrated **Leaflet.js + React-Leaflet** for dynamic and interactive maps.  
- Displays **donor, hospital, and emergency locations** using **OpenStreetMap tiles**.  
- Uses **Leaflet.heat** to visualize density zones (e.g., most active donor regions).  
- Incorporates **browser Geolocation API** to auto-detect user’s position.  

### 🧩 SOS Emergency Mode  
- One-click broadcast to all available donors and hospitals in the region.  
- Priority queue override for critical situations.  
- Designed to respond within **minutes**, not hours.  

### 🔒 Secure & Reliable  
- **Firebase Authentication** for secure user login & verification.  
- Encrypted data communication via HTTPS and Firestore rules.  
- Admin panel to verify hospitals, donors, and manage fake requests.  

---

## 🧠 Tech Stack  

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | React.js + Tailwind CSS + Framer Motion | Dynamic UI, animations, and styling |
| **Backend** | Node.js + Express.js | API endpoints and business logic |
| **Database** | MongoDB (Cloud) | Storing donors, requests, and hospital data |
| **Authentication & Alerts** | Firebase | Secure login, notifications |
| **Maps & Location** | Leaflet.js, React-Leaflet, Leaflet.heat, Geolocation API | Real-time mapping and tracking |
| **Hosting** | Vercel / Firebase Hosting | Frontend deployment |

---

## 🧭 How It Works  

### 🔹 Step 1: Register & Verify  
Users (donors or hospitals) create profiles and verify identity through Firebase Auth.  

### 🔹 Step 2: Dashboard Access  
- Donors: Toggle availability, track donation history.  
- Hospitals: Update inventory, create blood requests.  

### 🔹 Step 3: Smart Matching  
System connects **nearest eligible donors** to requests using geolocation and blood group data.  

### 🔹 Step 4: Real-Time Alerts  
Instant notifications are sent to donors using **Firebase Cloud Messaging**.  

### 🔹 Step 5: Safe Donation & Tracking  
Donation updates are recorded automatically, with reminders for next eligibility.

---

## 📊 Impact & Goals  

| Metric | Description |
|---------|-------------|
| 💉 **Lives Impacted** | 50,000+ (Projected) |
| 🩸 **Registered Donors** | 18,000+ (Target) |
| ⚡ **Response Time** | < 10 Minutes |
| ❤️ **Goal** | Build a unified, real-time blood ecosystem |

---

## 🖥️ Screenshots (Optional)  
> _(Add your project screenshots here for better visual representation)_

| Donor Dashboard | Hospital Panel | Map View |
|------------------|----------------|----------|
| ![Donor Dashboard](path/to/image1.png) | ![Hospital Panel](path/to/image2.png) | ![Map View](path/to/image3.png) |

---

## 🗺️ Location Module (Detailed Breakdown)  

### 📍 Used Libraries:
- **Leaflet.js** – For map rendering and layer management.  
- **React-Leaflet** – For seamless integration with React components.  
- **Leaflet.heat** – To visualize hotspots (high donor density or affected zones).  
- **Geolocation API** – To fetch the current user’s latitude & longitude.  

### ⚙️ Implementation Flow:
1. Fetch user’s location via `navigator.geolocation.getCurrentPosition()`.  
2. Store coordinates in state or Firebase.  
3. Display position on the map with a **Marker** component.  
4. Overlay **heatmap** layer for regional density.  
5. Use **radius filters** (e.g., 10km, 20km) for nearby donor searches.  

---

## 🧩 Folder Structure  


