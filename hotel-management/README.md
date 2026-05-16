# Hotel Management & Booking SaaS Platform

> Production-ready SaaS application built with Modern Full Stack TypeScript architecture

## 🏨 Project Overview

A comprehensive Hotel Management & Booking system featuring:
- Real-time booking management
- Admin dashboard with analytics
- Payment gateway integration (Razorpay, Stripe, UPI)
- AI-powered features (chatbot, recommendations)
- Mobile-responsive design
- Professional SaaS UI

## 📁 Project Structure (Agile-Based)

```
hotel-management/
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   └── ISSUE_TEMPLATE/     # Agile templates
├── client/                 # Frontend (React + TypeScript)
├── server/                 # Backend (Node.js + Express)
├── admin-panel/            # Admin dashboard
├── database/               # PostgreSQL schemas & migrations
├── docs/                   # API & Technical documentation
├── docker/                 # Docker & deployment configs
├── sprints/                # Sprint planning & tracking
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

## 🚀 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Redux Toolkit
- Framer Motion (animations)

### Backend
- Node.js 18+
- Express.js
- TypeScript
- JWT Authentication
- bcryptjs
- PostgreSQL
- TypeORM

### DevOps
- Docker & Docker Compose
- PM2
- Nginx
- GitHub Actions (CI/CD)

## 📋 Agile Methodology

This project follows **Scrum methodology** with:
- **Sprint Duration**: 2 weeks
- **Daily Standups**: Track progress
- **Sprint Planning**: Define stories & tasks
- **Sprint Reviews**: Demo features
- **Retrospectives**: Continuous improvement

### Sprint Phases

**Sprint 1**: Authentication & Project Setup
- User registration & login
- JWT implementation
- Role-based access control

**Sprint 2**: Room Management
- Room CRUD operations
- Image upload (3D images)
- Room categorization

**Sprint 3**: Booking System
- Real-time booking
- Calendar integration
- Booking status tracking

**Sprint 4**: Payment Integration
- Razorpay integration
- Stripe integration
- Invoice generation

**Sprint 5**: Admin Dashboard
- Analytics & reports
- Revenue tracking
- Occupancy management

**Sprint 6**: AI Features & Optimization
- AI chatbot
- Smart recommendations
- Mobile optimization

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker (optional)
- npm or yarn

### Setup Instructions

1. **Clone Repository**
   ```bash
   git clone https://github.com/Monikarajput17/Python.git
   cd hotel-management
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install Dependencies**
   ```bash
   # Backend
   cd server && npm install
   
   # Frontend
   cd ../client && npm install
   ```

4. **Database Setup**
   ```bash
   cd ../database
   npm run migrate
   npm run seed
   ```

5. **Run Application**
   ```bash
   # Terminal 1: Backend
   cd server && npm run dev
   
   # Terminal 2: Frontend
   cd client && npm run dev
   
   # Terminal 3: Admin Panel
   cd admin-panel && npm run dev
   ```

## 📚 API Documentation

See [API Docs](./docs/API.md) for complete endpoint documentation.

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

## 📊 Sprint Tracking

See [Sprints](./sprints/) directory for detailed sprint plans and tracking.

## 🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- API rate limiting
- CORS configuration
- Secure headers (Helmet.js)
- Environment variable protection

## 📝 License

MIT License

## 👤 Author

**Monika Rajput**
- GitHub: [@Monikarajput17](https://github.com/Monikarajput17)

---

**Last Updated**: 2026-05-16
