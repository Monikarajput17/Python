# Comprehensive Installation Guide

## System Requirements

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **PostgreSQL**: 14.x or higher
- **Docker**: 20.x (optional)
- **Nginx**: Latest (for production)

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone repository
git clone <repo-url>
cd hotel-management

# Setup environment
cp .env.example .env

# Start all services
docker-compose up -d

# Access applications
# Frontend: http://localhost:3000
# Admin: http://localhost:3001
# API: http://localhost:5000
# Database: localhost:5432
```

### Manual Installation

#### 1. Install Dependencies

```bash
# Backend
cd server
npm install
cd ..

# Frontend
cd client
npm install
cd ..

# Admin Panel
cd admin-panel
npm install
cd ..
```

#### 2. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE hotel_management;"

# Run migrations
psql -U postgres -d hotel_management -f database/schema.sql

# Seed data (optional)
cd server
npm run db:seed
```

#### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Key variables to set:
- Database credentials
- JWT secrets
- Payment gateway keys
- Email configuration
- AWS S3 credentials

#### 4. Start Development Servers

**Option A: Individual terminals**

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev

# Terminal 3: Admin Panel
cd admin-panel
npm run dev
```

**Option B: Using npm concurrently**

```bash
npm run dev
```

## Configuration

### Database Connection

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotel_management
DB_USER=postgres
DB_PASSWORD=your_password
```

### Authentication

```env
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=15m
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRE=30d
```

### Email Service

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Payment Gateways

#### Razorpay
```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

#### Stripe
```env
STRIPE_SECRET_KEY=your_secret_key
STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

### AWS S3 (Image Storage)

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name
```

## Verification

### Health Check

```bash
# API Health
curl http://localhost:5000/health

# Frontend
open http://localhost:3000

# Admin Panel
open http://localhost:3001
```

### Database Connection

```bash
psql -U postgres -d hotel_management -c "\dt"
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Test connection
psql postgresql://user:password@localhost:5432/hotel_management
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

```bash
# View logs
docker-compose logs -f

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## Testing

### Backend Tests

```bash
cd server
npm run test
```

### Frontend Tests

```bash
cd client
npm run test
```

## Next Steps

1. Review [API Documentation](./docs/API.md)
2. Check [Deployment Guide](./docs/DEPLOYMENT.md)
3. Review [Sprint Planning](./sprints/SPRINT_PLANNING.md)
4. Read [Contributing Guidelines](./CONTRIBUTING.md)

---

**Need Help?**
- GitHub Issues: Create an issue for bug reports
- Email: support@hotelmanagement.com
- Documentation: See `/docs` folder
