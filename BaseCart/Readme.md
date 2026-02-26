# BaseCart

A multi-tenant e-commerce platform that enables businesses to create and manage their own online storefronts. Built with React, Hono, and Cloudflare Workers.

**Live Demo:** [basecart.mocha.app](https://basecart.mocha.app)

---

## Overview

BaseCart provides two main experiences:

1. **Business Portal** (`/admin`) - Where business owners manage their storefront, menu items, and orders
2. **Customer Storefront** (`/store/:slug`) - Where customers browse products and place orders

A demo store, **Golden Hour Coffee Co.**, showcases the platform's capabilities at the root URL.

---

## Features

### For Business Owners
- **Quick Onboarding** - Sign up with Google and create a business in minutes
- **Menu Management** - Add, edit, and organize menu items with categories
- **Order Management** - View and update order statuses in real-time
- **Customizable Storefront** - Set custom shop button links and branding
- **Business Settings** - Manage business details, profile, and account

### For Customers
- **Browse Products** - Filter by category, view descriptions and pricing
- **Shopping Cart** - Add items, adjust quantities, review before checkout
- **Easy Checkout** - Provide pickup details and place orders
- **Order Tracking** - Track order status with order number and phone

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, React Router, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui components |
| **Backend** | Hono (TypeScript API framework) |
| **Database** | Cloudflare D1 (SQLite) |
| **Auth** | Mocha Auth SDK (Google OAuth) |
| **Hosting** | Cloudflare Workers |
| **Icons** | Lucide React |

---

## Project Structure

```
src/
├── react-app/
│   ├── components/
│   │   ├── admin/          # Admin portal components
│   │   ├── order/          # Order flow components
│   │   └── ui/             # Reusable UI components (shadcn)
│   ├── context/            # React context providers
│   │   ├── BusinessContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── SidebarContext.tsx
│   │   ├── StoreCartContext.tsx
│   │   └── ThemeContext.tsx
│   ├── data/
│   │   └── menuData.ts     # Demo store menu data
│   ├── pages/
│   │   ├── admin/          # Business portal pages
│   │   └── system-admin/   # Platform admin pages
│   ├── App.tsx             # Main app with routing
│   └── index.css           # Global styles & theme vars
├── worker/
│   └── index.ts            # Hono API endpoints
└── shared/
    └── types.ts            # Shared TypeScript types
```


---

## Getting Started

1. **Sign in** at `/admin/login` using Google
2. **Create your business** - Enter business name and details
3. **Add menu items** - Build your product catalog
4. **Share your storefront** - Send customers to `/store/your-slug`
5. **Manage orders** - View and fulfill orders from the dashboard

See [docs/getting-started.md](docs/getting-started.md) for detailed setup instructions.

---

## License

APACHE