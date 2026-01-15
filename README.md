# 🖨️ JustzMatbaa - Modern Print Shop E-Commerce Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)

**A modern, user-friendly e-commerce platform designed for professional printing services.**

[Demo]([#demo](https://justz-matbaa-git-master-elbatin8-gmailcoms-projects.vercel.app/)) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Screenshots](#-screenshots)

</div>

---

## 🎯 About The Project

JustzMatbaa is a comprehensive e-commerce solution specifically designed for the printing industry. Users can customize and order business cards, brochures, posters, catalogs, and many other print products with various options.

This project was developed as a **portfolio project** to showcase the power of modern web technologies.

## ✨ Features

### 🛒 Customer Experience
- **Dynamic Product Catalog** - Filter and search by categories
- **Advanced Print Options** - Size, paper type, print side selection
- **Real-Time Price Calculation** - Instant price updates based on selections
- **Smart Cart Management** - Persistent cart with LocalStorage
- **Seamless Checkout** - Step-by-step payment process
- **Responsive Design** - Perfect display on all devices

### 🔐 Admin Panel
- **Dashboard** - Sales statistics and overview
- **Product Management** - Product listing, search, and deletion
- **Order Tracking** - Detailed order viewing
- **Secure Login** - Mock authentication system

### 🎨 UI/UX
- **Framer Motion Animations** - Smooth transitions and micro-interactions
- **shadcn/ui Components** - Consistent and accessible design
- **Skeleton Loading** - Professional loading states
- **Toast Notifications** - User feedback system

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **UI Library** | shadcn/ui |
| **State Management** | Zustand (localStorage persist) |
| **Animations** | Framer Motion |
| **Form Handling** | React Hook Form |
| **Icons** | Lucide React |
| **Testing** | Vitest |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (shop)/            # Customer pages
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Payment
│   │   ├── order-success/ # Order confirmation
│   │   └── products/      # Product list & detail
│   └── admin/             # Admin panel
│       ├── login/         # Login
│       ├── products/      # Product management
│       └── orders/        # Order management
├── components/
│   ├── cart/              # Cart components
│   ├── checkout/          # Payment forms
│   ├── home/              # Homepage sections
│   ├── layout/            # Header, Footer, Navigation
│   ├── products/          # Product cards and galleries
│   └── ui/                # shadcn/ui components
├── stores/                # Zustand state stores
│   ├── cart-store.ts      # Cart management
│   ├── product-store.ts   # Product data
│   ├── order-store.ts     # Order management
│   └── auth-store.ts      # Authentication
├── lib/                   # Utility functions
│   ├── price-calculator.ts
│   ├── validators.ts
│   └── utils.ts
├── types/                 # TypeScript types
└── data/                  # Mock product data
```

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
# Clone the repository
git clone https://github.com/elbatin/JustzMatbaa.git

# Navigate to project directory
cd JustzMatbaa

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@justzmatbaa.com | admin123 |
| Demo | demo@justzmatbaa.com | demo123 |

## 📸 Screenshots

### Homepage
Modern hero section, category cards, and featured products.

### Product Detail
Image gallery, print options, and dynamic pricing.

### Cart & Checkout
Smooth shopping experience and secure payment process.

### Admin Panel
Comprehensive management tools and statistics.

## 📝 Feature Details

### Dynamic Price Calculation
```typescript
// Price = Base Price × Size × Paper × Print Side × Quantity
calculatePrice({
  basePrice: 100,
  sizeMultiplier: 1.5,      // A4
  paperTypeMultiplier: 1.2,  // Coated
  printSideMultiplier: 1.8,  // Double-sided
  quantity: 500
})
```

### State Persistence
Cart data is preserved across page refreshes thanks to Zustand's localStorage integration.

### Type-Safe Development
All data models are defined with TypeScript, providing a safe and predictable development experience.

## 🧪 Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch
```

## 📄 License

This project is licensed under the MIT License.

## 👤 Developer

**elbatin**

- GitHub: [@elbatin](https://github.com/elbatin)

---

<div align="center">

⭐ If you liked this project, don't forget to give it a star!

</div>
