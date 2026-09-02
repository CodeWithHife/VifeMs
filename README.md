# VIFEMS — Enterprise & Organization Management System

> **Manage. Simplify. Grow.**  
> An all-in-one, modular, multi-tenant SaaS platform engineered to eliminate administrative chaos for modern organizations, educational institutions, training centers, and growing businesses.

---

## 🌟 Overview

**VIFEMS** brings your people, staff, attendance, operations, payments, and reporting into a unified, responsive workspace. It eliminates the friction of juggling disconnected spreadsheets, paper notebooks, and WhatsApp message threads.

By dynamically adapting its modules and UI to the organization's specific profile, VIFEMS delivers tailored workflows without unnecessary bloat.

---

## 🚀 Key Modules & Workspaces

### 1. 🎓 Training & Coaching Centers
* **Batches & Cohorts**: Schedule and manage training cycles with custom dates, enrollment deadlines, and capacities.
* **Participant Tracking**: Centralized directory with automated reference ID (`REF-ID`) generation and photo profiles.
* **Fee Collection & Automated Receipts**: Multi-tier tracking for application fees and tuition balances with instant PDF receipt generation.
* **Certificates**: Track completion statuses and issue downloadable certificates.

### 2. 🏫 Schools & Educational Institutions
* **Students & Classes**: Manage grade levels, classroom sections, and student biodata rosters.
* **Academic Sessions & Semesters**: Maintain academic calendars and terms.
* **Curriculum & Subjects**: Map subjects to classes and assign instructors.
* **Assessments & Results**: Record test scores, compute grades, and generate student report summaries.
* **School Fees & Library**: Schedule tuition payments and track library loan records.

### 3. 🛍️ Retail & Commerce
* **Inventory & Stock**: Real-time asset counts, low-stock notifications, and SKU catalogs.
* **Orders & Sales**: Order fulfillment tracking and customer order histories.

### 4. 💼 Services & Consultancies
* **CRM & Directory**: Client contact histories, accounts, and communications.
* **Tasks & Workflows**: Task assignment with deadlines, statuses, and team progress tracking.
* **Financial Ledger**: Invoices, income, expenses, and cash flow summaries.

### 5. 🔗 Public Self-Registration (`/register/[slug]`)
* Organizations can generate public landing pages with dynamic form fields.
* Allows participants and students to register online directly into batches, submit required documents, and receive confirmation.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (Turbopack, App Router)
* **Library**: [React 19](https://react.dev/)
* **Language**: [TypeScript 5](https://www.typescriptlang.org/)
* **Styling**: Modern CSS & [Tailwind CSS](https://tailwindcss.com/)
* **Motion & Animations**: [GSAP](https://gsap.com/)
* **Document Generation**: [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
* **Icons & Assets**: Custom SVG icon sets & responsive typography

---

## 📁 Project Architecture

```plaintext
vifems-app/
├── public/                # Static assets, SVG illustrations, and icons
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── auth/          # Authentication callbacks
│   │   ├── check-email/   # Email verification notice
│   │   ├── dashboard/     # Main workspace dashboard & school panels
│   │   ├── login/         # Authentication login portal
│   │   ├── onboarding/    # Multi-step workspace onboarding wizard
│   │   ├── register/      # Public [slug] registration pages
│   │   ├── signup/        # Account registration
│   │   ├── verify-email/  # Token verification screen
│   │   ├── globals.css    # Global design system & theme tokens
│   │   └── page.tsx       # Marketing landing page
│   ├── components/        # Reusable UI components (Hero, Navbar, Pricing, etc.)
│   ├── context/           # React context providers (AuthContext)
│   ├── lib/               # API clients, token storage, and module catalogs
│   ├── services/          # RESTful service layers (Auth, School, Training, Workspace)
│   └── types/             # TypeScript type definitions and models
├── eslint.config.mjs      # Flat ESLint configuration
├── next.config.ts         # Next.js build configuration
└── package.json           # Dependencies and scripts
```

---

## 🏁 Getting Started

### Prerequisites

* **Node.js**: v20.x or higher
* **npm**, **pnpm**, or **yarn**

### 1. Clone the repository

```bash
git clone https://github.com/CodeWithHife/VifeMs.git
cd VifeMs/vifems-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://your-api-backend-url.com/api
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🧪 Quality & Validation Scripts

```bash
# Run type check and Next.js production build
npm run build

# Run ESLint validation
npm run lint

# Start production server
npm run start
```

---

## 🚢 Deployment

The project is optimized for deployment on the **[Vercel Platform](https://vercel.com)**:

1. Push your changes to GitHub on the `main` branch.
2. Link the repository in the Vercel Dashboard.
3. Configure your production `NEXT_PUBLIC_API_URL` environment variable.
4. Deploy automatically with Turbopack acceleration.

---

## 📄 License

This project is proprietary and confidential.  
© 2026 **VIFEMS**. All rights reserved.
