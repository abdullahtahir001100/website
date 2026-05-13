# CHRIS_GOIN

> **Chris Goins Construction Roofing & Gutters** — Professional multi-page business website showcasing construction and roofing services with responsive design and interactive components.

---

## 🏗️ Static Service Website Architecture

<p align="center">
  <img src="https://img.shields.io/badge/PHP-Backend-777BB4?style=for-the-badge&logo=php&logoColor=white" />
  <img src="https://img.shields.io/badge/HTML5-Frontend-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-Frontend-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-ES5+-FFDD00?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/jQuery-DOM-0868AC?style=for-the-badge&logo=jquery&logoColor=white" />
  <img src="https://img.shields.io/badge/Bootstrap-Responsive-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" />
  <img src="https://img.shields.io/badge/Owl%20Carousel-Sliders-111?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Font%20Awesome-Icons-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white" />
</p>

<p align="center">
  <strong>Production-ready PHP website with shared template system and optimized frontend interactions</strong>
</p>

---

## 🛠 Tech Stack

- **Server:** PHP (server-side page rendering)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES5+)
- **DOM Library:** jQuery
- **CSS Framework:** Bootstrap 4/5
- **Carousel:** Owl Carousel 2
- **Icons:** Font Awesome (via CDN)
- **Typography:** Local Poppins font files
- **Layout System:** Shared PHP includes (header, footer, master template)

---

## ✨ Key Features

- **Multi-Page Business Site:** Home, About, Services, Portfolio, Blog, FAQ, Contact
- **Responsive Design:** Mobile-first Bootstrap grid with custom breakpoints
- **Shared Template System:** DRY PHP includes for header, footer, and layout consistency
- **Interactive Components:** Modals, carousels, accordions, dropdown menus
- **SEO-Ready:** Clean semantic HTML, metadata management, structured layout
- **Static Asset Optimization:** Minified CSS/JS, local font hosting, optimized image serving
- **Contact Forms:** Multi-field forms with fieldset navigation

---

## 📂 Project Structure

```
CHRIS_GOIN/
├── 📄 Pages (PHP)
│   ├── index.php                 # Home
│   ├── about.php                 # About section
│   ├── services.php              # Services listing
│   ├── service_detail.php        # Service details
│   ├── portfolio.php             # Work portfolio
│   ├── blog.php                  # Blog listing
│   ├── blog_detail.php           # Blog article
│   ├── faq.php                   # FAQ & Accordion
│   └── contact.php               # Contact form
│
├── 📁 includes/ (Shared Templates)
│   ├── site-master.php           # Master layout wrapper
│   ├── header.php                # Navigation & top bar
│   └── footer.php                # Footer, newsletter, scripts
│
├── 🎨 css/ (Stylesheets)
│   ├── bootstrap.min.css         # Grid & components
│   ├── font-awesome.min.css      # Icon library
│   ├── owl.carousel.min.css      # Carousel styling
│   ├── style.css                 # Custom branding
│   └── responsive.css            # Mobile overrides
│
├── ⚙️ js/ (Scripts)
│   ├── jquery.min.js             # DOM manipulation
│   ├── bootstrap.min.js          # Interactive components
│   ├── owl.carousel.min.js       # Slider functionality
│   └── main.js                   # Custom behavior
│
├── 🔤 fonts/                     # Local Poppins & system fonts
├── 🖼️ images/                    # Logos, banners, service photos
│   └── shape_3_files/            # Template asset bundle
└── README.md                     # This file
```

---

## 📋 Page Overview

| Page | Purpose |
|------|---------|
| `index.php` | Hero section, featured services, testimonials, CTA |
| `about.php` | Company history, mission, team info |
| `services.php` | Full service catalog with filters |
| `service_detail.php` | Deep-dive service page with images & pricing |
| `portfolio.php` | Project gallery with lightbox |
| `blog.php` | Article listing with categories |
| `blog_detail.php` | Full article view with comments section |
| `faq.php` | FAQ accordion & collapsible Q&A |
| `contact.php` | Contact form with validation |

---

## 🎯 Frontend Behavior

- **Mobile Navigation:** Hamburger toggle & responsive menu collapse
- **FAQ Accordion:** Expand/collapse with smooth animations
- **Image Lightbox:** Photo galleries with modal zoom
- **Carousel Sliders:** Owl Carousel for testimonials & featured work
- **Form Navigation:** Multi-step forms with fieldset progression
- **Dropdown Menus:** Hover & click interaction states
- **Scroll Effects:** Smooth transitions and reveal animations

---

## 🚀 Setup & Deployment

1. **Requirements:** PHP 7.0+ web server (Apache/Nginx)
2. **Installation:** Upload all files to hosting server
3. **No Build Step:** Serves directly as static PHP website
4. **No Database:** All content managed via PHP includes
5. **Static Assets:** CSS, JS, fonts, and images served as-is

---

## 📦 Asset Bundle Notes

- `images/shape_3_files/` contains exported template assets (Elementor bundle)
- Includes additional CSS frameworks and plugins from design template
- Core functionality uses Bootstrap, jQuery, and Owl Carousel
- Custom branding applied via `style.css` and theme overrides

---

## ✍️ Notes

- ✅ No package manager or build tools required
- ✅ No backend database or API
- ✅ Fully self-contained static PHP site
- ✅ Ready for production on any PHP hosting
- ✅ SEO-friendly directory structure
