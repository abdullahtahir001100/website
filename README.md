# INKBYHAND — Calligraphy E-Commerce Website

A fully static, responsive e-commerce website for calligraphy art supplies and education. Built with pure HTML, CSS, and vanilla JavaScript, connected to a Vercel-hosted backend API.

---

## 🖋️ About the Project

INKBYHAND is an online store specialising in calligraphy pens, inks, paper, and related tools for both beginners and professionals. The site provides a complete shopping experience including product browsing, a shopping cart, checkout/payment, user authentication, and an admin dashboard.

---

## ✨ Features

- **Product Catalogue** — Browse and filter all available calligraphy products
- **Product Detail Pages** — Full product descriptions, images, and specifications
- **Shopping Cart** — Add, remove, and manage cart items (persisted via `localStorage`)
- **Checkout & Payment** — Complete order flow with a dedicated payment page
- **User Authentication** — Cookie-based login and session management
- **Order History** — View past orders in the user account area
- **Admin Dashboard** — Overview, user management, order management, and contact enquiries
- **Contact Form** — Customer support / enquiry submission
- **Responsive Design** — Works across desktop and mobile viewports
- **Custom Error Pages** — 404, 500, and offline error pages
- **Activity Tracking** — 60-second heartbeat for session analytics

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (modular, per-page stylesheets) |
| Scripting | Vanilla JavaScript (ES6+) |
| Typography | Custom fonts via `@font-face` + Google Fonts + Font Awesome 6 |
| Backend API | REST API hosted on Vercel (`backend-web-1-yb6q.vercel.app`) |
| Storage | Browser `localStorage` and cookies |
| Dev Server | VS Code Live Server (port 5501) |
| Version Control | Git |

No build tools, frameworks, or package managers are required — this is a pure static site.

---

## 📁 Project Structure

```
website/
├── index.html              # Homepage
├── about.html              # About Us page
├── product.html            # Product listing / shop
├── detail.html             # Individual product detail
├── cart.html               # Shopping cart
├── paymant.html            # Checkout / payment
├── login.html              # User login
├── order.html              # Order history
├── contect.html            # Contact / support
├── settings.html           # User account settings
├── 404.html                # Root-level 404 page
│
├── dashboard/              # Admin dashboard pages
│   ├── dashboard.html      # Main dashboard
│   ├── dashboard_user.html # User management
│   ├── overview.html       # Analytics overview
│   ├── contactdash.html    # Contact enquiries
│   └── orer.html           # Order management
│
├── css/                    # Stylesheets
│   ├── global.css          # Global / reset styles
│   ├── header.css          # Navigation header
│   ├── style.css           # Homepage styles
│   ├── produt.css          # Product listing styles
│   ├── details.css         # Product detail styles
│   ├── cart.css            # Cart page styles
│   ├── paymant.css         # Payment page styles
│   ├── contect.css         # Contact page styles
│   ├── about.css           # About page styles
│   ├── form.css            # Form / login styles
│   └── dashboard.css       # Dashboard styles
│
├── js/                     # JavaScript files
│   ├── script.js           # Core script (navigation, burger menu)
│   ├── product.js          # Product listing logic
│   ├── detail.js           # Product detail interactions
│   ├── cart.js             # Cart operations
│   ├── paymant.js          # Payment / checkout logic
│   ├── auth.js             # Authentication
│   ├── contect.js          # Contact form handling
│   ├── animate.js          # Animation utilities
│   ├── cockees.js          # Cookie / session management
│   └── dashboadover.js     # Dashboard overview logic
│
├── fonts/                  # Custom font files
│   ├── Agbalumo/
│   ├── Fjalla_One/
│   ├── Poppins/
│   ├── ADLaM_Display/
│   ├── ArefRuqaa-Regular.ttf
│   └── ArefRuqaa-Bold.ttf
│
├── images/                 # Product and brand images (JPG)
│
└── errors/                 # Error pages
    ├── 404.html
    ├── 500.html
    ├── ofline.html
    └── backtohome.html
```

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- [VS Code](https://code.visualstudio.com/) with the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension (recommended for local development)

### Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdullahtahir001100/website.git
   cd website
   ```

2. **Open with Live Server**
   - Open the project folder in VS Code
   - Right-click `index.html` → **"Open with Live Server"**
   - The site will open at `http://127.0.0.1:5501`

3. **Or open directly in a browser**
   - Open `index.html` directly in any browser
   - Note: some API features may require a running server context

---

## 🌐 Backend API

The frontend communicates with a REST API hosted on Vercel:

```
Base URL: https://backend-web-1-yb6q.vercel.app/api
```

Key API features consumed by the frontend:
- User authentication and session validation
- Product catalogue retrieval
- Order creation and history
- Contact form submission
- Activity / heartbeat tracking

---

## 📄 Pages Overview

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Landing page with promotions and featured products |
| About | `about.html` | Brand story and information |
| Shop | `product.html` | Full product catalogue with filters |
| Product Detail | `detail.html` | Individual product page |
| Cart | `cart.html` | Shopping cart review |
| Checkout | `paymant.html` | Payment and order completion |
| Login | `login.html` | User sign-in |
| Orders | `order.html` | User order history |
| Contact | `contect.html` | Customer support form |
| Settings | `settings.html` | Account settings |
| Dashboard | `dashboard/` | Admin area (overview, users, orders, contacts) |

---

## 🎨 Fonts Used

- **Agbalumo** — Display / decorative headings
- **Fjalla One** — Section headings
- **Poppins** — Body text and UI elements
- **ADLaM Display** — Accent text
- **Aref Ruqaa** — Arabic-style calligraphy accents
- **Inter** (Google Fonts) — General UI text
- **Font Awesome 6** — Icons throughout the site

---

## 📦 Assets

- **Images** — Located in `/images/`. Product photography in JPG format.
- **Fonts** — Located in `/fonts/`. All fonts are self-hosted for offline reliability.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source. See the repository for more details.
