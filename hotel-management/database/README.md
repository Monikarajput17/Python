# Hotel Management SaaS - Database Setup Guide

## Database Schema

The application uses PostgreSQL with the following tables:

### Tables

1. **users** - User accounts and authentication
2. **rooms** - Hotel room inventory
3. **room_images** - 3D and 2D images for rooms
4. **bookings** - Guest bookings
5. **payments** - Payment records
6. **reviews** - Room reviews and ratings
7. **customer_profiles** - Extended customer information

## Setup Instructions

### Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker-compose up postgres

# Migrations will run automatically
```

### Manual Setup

1. Install PostgreSQL 14+
2. Create database:
   ```sql
   CREATE DATABASE hotel_management;
   ```

3. Connect to database:
   ```bash
   psql -U postgres -d hotel_management
   ```

4. Run schema.sql:
   ```bash
   psql -U postgres -d hotel_management -f database/schema.sql
   ```

5. Seed initial data:
   ```bash
   npm run db:seed
   ```

## Connection String

```
postgresql://user:password@localhost:5432/hotel_management
```

## Backup and Restore

### Backup
```bash
pg_dump -U postgres hotel_management > backup.sql
```

### Restore
```bash
psql -U postgres hotel_management < backup.sql
```

## Performance Optimization

- Indexes created on frequently queried columns
- UUID primary keys for distributed systems
- JSONB for flexible payment details
- Array types for amenities and saved rooms

## Maintenance

### Analyze Query Performance
```sql
EXPLAIN ANALYZE SELECT * FROM bookings WHERE user_id = '...';
```

### Vacuum and Analyze
```sql
VACUUM ANALYZE;
```
