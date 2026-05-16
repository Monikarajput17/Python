# Hotel Management SaaS - Deployment Guide

## Production Deployment

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- PM2 (for process management)
- Nginx (for reverse proxy)
- Docker & Docker Compose (optional)

### Environment Setup

1. **Create production .env**
   ```bash
   cp .env.example .env.production
   ```

2. **Update sensitive variables**
   - JWT_SECRET (strong random string)
   - Database credentials
   - Payment gateway keys
   - API keys for AI services

### Database Migration

```bash
# Connect to production database
psql postgresql://user:pass@host:5432/hotel_management

# Run migrations
psql -f database/schema.sql
```

### Backend Deployment

#### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Build
cd server
npm run build

# Start with PM2
pm2 start dist/index.js --name "hotel-api" --env production

# Save ecosystem config
pm2 save
```

#### Using Docker

```bash
# Build image
docker build -t hotel-server:latest ./server

# Push to registry
docker push your-registry/hotel-server:latest

# Run container
docker run -d \
  --name hotel-server \
  -p 5000:5000 \
  --env-file .env.production \
  your-registry/hotel-server:latest
```

### Frontend Deployment

#### Building for Production

```bash
cd client
npm run build
```

#### Deploy Static Files

1. **Using AWS S3 + CloudFront**
   ```bash
   aws s3 sync dist/ s3://your-bucket/
   ```

2. **Using Nginx**
   ```bash
   cp -r dist/* /var/www/hotel-app/
   ```

### Nginx Configuration

```bash
# Copy Nginx config
cp docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Generate SSL certificates (Let's Encrypt)
certbot certonly --standalone -d hotelmanagement.com

# Test and reload
nginx -t
nginx -s reload
```

### SSL/TLS Setup

#### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d hotelmanagement.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

### Monitoring & Logging

#### PM2 Monitoring

```bash
# View logs
pm2 logs hotel-api

# Monitor
pm2 monit

# Set up log rotation
pm2 install pm2-logrotate
```

#### Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

### Backup Strategy

#### Database Backups

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/var/backups/hotel-db"
DB_NAME="hotel_management"
DB_USER="postgres"
DATE=$(date +\%Y\%m\%d_\%H\%M\%S)

pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$DATE.sql s3://backup-bucket/

# Clean old backups
find $BACKUP_DIR -mtime +30 -delete
```

#### Application Backups

```bash
# Backup uploaded files
tar -czf /var/backups/hotel-uploads_$(date +%Y%m%d).tar.gz /var/uploads/
```

### Performance Optimization

#### Caching

1. **Redis Cache**
   ```bash
   docker run -d -p 6379:6379 redis:latest
   ```

2. **HTTP Caching Headers**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

#### Database Optimization

```sql
-- Create indexes for common queries
CREATE INDEX idx_bookings_check_in ON bookings(check_in_date);
CREATE INDEX idx_rooms_price ON rooms(price_per_night);

-- Enable connection pooling
-- Use PgBouncer or similar
```

### Security Checklist

- [ ] Use HTTPS/TLS for all connections
- [ ] Enable CORS properly
- [ ] Set secure headers (Helmet)
- [ ] Rate limiting enabled
- [ ] SQL injection protection (parameterized queries)
- [ ] CSRF protection enabled
- [ ] Regular security updates
- [ ] WAF rules configured
- [ ] DDoS protection enabled
- [ ] Database encryption at rest

### Scaling Considerations

1. **Horizontal Scaling**
   - Load balance multiple API instances
   - Use managed PostgreSQL (RDS, CloudSQL)
   - CDN for static assets

2. **Vertical Scaling**
   - Increase server resources
   - Optimize database queries
   - Enable caching

3. **Database Scaling**
   - Read replicas
   - Connection pooling
   - Sharding for large datasets

### Rollback Procedure

```bash
# Keep previous version
cd /var/www
mv hotel-app hotel-app-new
mv hotel-app-old hotel-app

# Restart
pm2 restart hotel-api

# Verify
curl https://hotelmanagement.com/health
```

### CI/CD Pipeline

See `.github/workflows/` for automated deployment configuration.

---

**Last Updated**: 2026-05-16
