# Quick Fix Guide - User Registration Role Constraint Issue

## Problem
Login/Registration failing with: `ERROR: new row for relation "users" violates check constraint "users_role_check"`

## Quick Steps to Fix

### Step 1: Stop All Servers
```powershell
Get-Process | Where-Object {$_.ProcessName -match 'java|node|npm'} | Stop-Process -Force -ErrorAction SilentlyContinue
```

### Step 2: Clean and Rebuild Backend
```bash
cd backend
mvn clean compile
```

### Step 3: Start Backend (This will apply the database migration)
```bash
mvn spring-boot:run
```
**Wait for this message in logs:**
```
Flyway: Successfully validated 1 migration
Flyway: Successfully applied 1 migration
```

### Step 4: Start Frontend
```bash
cd frontend
npm run dev
```

### Step 5: Test
1. Go to `http://localhost:5173/register`
2. Create a new account
3. Try to login
4. ✅ Should work now!

## What Was Fixed

| Issue | Solution |
|-------|----------|
| Database constraint rejecting valid roles | Added proper Flyway migration to fix constraint |
| Role column allowing NULL values | Set column to NOT NULL with DEFAULT 'CUSTOMER' |
| No default role in registration | Updated User model to default to CUSTOMER role |
| AuthService not validating role | Enhanced role validation in register method |

## Files Changed
- ✅ `backend/src/main/java/com/food/delivery/model/User.java`
- ✅ `backend/src/main/java/com/food/delivery/service/AuthService.java`
- ✅ `backend/pom.xml` (added Flyway dependencies)
- ✅ `backend/src/main/resources/application.properties`
- ✅ `backend/src/main/resources/db/migration/V1__Fix_Users_Role_Constraint.sql` (new)

## Troubleshooting

### Still getting constraint error?
1. Make sure PostgreSQL is running
2. Database name is `fooddb`
3. Check logs for Flyway migration errors
4. Manually verify constraint with:
   ```sql
   SELECT constraint_name FROM information_schema.table_constraints 
   WHERE table_name = 'users';
   ```

### Can't connect to database?
- Verify PostgreSQL connection in `application.properties`
- Default: `jdbc:postgresql://localhost:5432/fooddb`
- User: `postgres`
- Password: `Aditya`

### Migration not running?
- Check if `db/migration` folder exists in `resources`
- Ensure Flyway dependencies are added to `pom.xml`
- Check application logs for Flyway messages

---

**All fixes are ready to deploy!** 🚀
