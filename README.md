# 📚 Library Hub (Beta)

An enterprise-grade Library Management System built with a **Decoupled Architecture** using **ASP.NET Core 8 Web API** and **React (Vite + Tailwind CSS v4)**.

## 🚀 Project Overview

This system is designed to manage the lifecycle of a modern library, from cataloging assets to handling member subscriptions and book circulation. It features a high-performance **"Beta"** UI focused on speed, clarity, and real-time data synchronization.

---

## 🛠️ Tech Stack

- **Backend:** .NET 8, Entity Framework Core, SQLite (Development).
- **Frontend:** React 18, Vite, Tailwind CSS v4 (Glassmorphic Design).
- **Security:** JWT (JSON Web Tokens).
- **State Management:** React Context API (Auth & Notifications).
- **API Communication:** Axios with a Generic Service Factory pattern.

---

## 🧠 Core Business Logic

The system implements several critical business rules to ensure operational integrity:

1.  **Subscription Validation**: Only users with an **Active Subscription** (handled via `SubscriptionService`) can borrow books.
2.  **Borrowing Limits**: A strict **3-book limit** is enforced per member. The system checks the `BorrowRecord` table before approving new loans.
3.  **Concurrency Control**: Physical copies are tracked. A book marked as "Borrowed" cannot be taken by another user until the `ReturnDate` is processed.
4.  **Role Separation**:
    - **Admins**: Full CRUD on Books, Authors, Categories, and Users. Access to the global Circulation Dashboard.
    - **Members**: Personal Wishlisting, Self-Borrowing, and a private Activity Hub.
    - **Users**: Basic authentication and profile management.

---

## ✨ Key Features

### Admin Dashboard

- **Live Metrics**: Real-time stats on total users, active loans, and trending books.
- **Catalog Management**: Full CRUD for Books and Categories.
- **Author Entity Management**: Dedicated management for literary contributors using `PUT/POST/DELETE`.
- **Loan Management**: A global view to track due dates and process manual returns.

### Member Hub (User Profile)

- **Snapshot View**: Quick view of active loans and wishlist items.
- **Subscription Tracker**: Visual countdown of remaining membership days.
- **Self-Service Returns**: Members can return their own books directly from their profile to free up their borrow limit.
- **Reading History**: A permanent log of all past literary activity.

### Discovery & Wishlist

- **Dynamic Search**: Filter the entire library by title, author, or category.
- **Wishlist System**: Save books for later without taking up a borrow slot.
- **Book Details**: Deep-dive views with metadata, descriptions, and dynamic availability buttons.

---

## ⚙️ Development Setup

### 1. Backend (ASP.NET Core)

1. You need to ready the backend API first.

### 2. Frontend (React + Vite)

1. Navigate to the `Frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root:
   ```env
   VITE_API_BASE_URL=http://localhost:5136/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure (Frontend)

- `/src/services/apiservices.js`: Contains the **Generic API Factory** used to consume all backend routes.
- `/src/context/`: Manages global Auth states and the Toast notification system.
- `/src/components/ui/`: Reusable "Atom" components (Buttons, Modals, Loaders).
- `/src/layouts/`: Shared structures for **Admin** and **User** navigation.

---

**Status:** `BETA - Version 0.9.0`  
**Author:** [Aung Chan Myae]  
**License:** Academic Use Only
