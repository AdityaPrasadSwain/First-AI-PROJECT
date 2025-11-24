# Role Enum Mismatch Fix - "No enum constant com.food.delivery.model.Role.USER"

## Problem
Login failed with error:
```
No enum constant com.food.delivery.model.Role.USER
```

## Root Cause
The database had invalid role values that don't exist in the Java Role enum:
- `USER` (should be `CUSTOMER`)
- `DELIVERY_PARTNER` (should be `DELIVERY_BOY`)

The test data and possibly existing database records were using these incorrect values.

## Solutions Applied

### 1. **Fixed Test Data**
**File:** `TEST_USERS.sql`

Changed invalid role values to match the Java enum:
- ❌ `USER` → ✅ `CUSTOMER`
- ❌ `DELIVERY_PARTNER` → ✅ `DELIVERY_BOY`

### 2. **Added Database Migration**
**File:** `backend/src/main/resources/db/migration/V2__Fix_Invalid_Role_Values.sql`

Created a migration that:
- Converts any existing `USER` records to `CUSTOMER`
- Converts any existing `DELIVERY_PARTNER` records to `DELIVERY_BOY`
- Enforces the constraint to only allow valid enum values

```sql
UPDATE users SET role = 'CUSTOMER' WHERE role = 'USER';
UPDATE users SET role = 'DELIVERY_BOY' WHERE role = 'DELIVERY_PARTNER';
```

### 3. **Valid Role Values**
The Java Role enum only accepts these values:
```java
public enum Role {
    CUSTOMER,
    RESTAURANT_OWNER,
    ADMIN,
    DELIVERY_BOY
}
```

## Steps to Apply the Fix

1. **Stop all servers:**
   ```bash
   Get-Process | Where-Object {$_.ProcessName -match 'java|node|npm'} | Stop-Process -Force
   ```

2. **Clean and rebuild backend:**
   ```bash
   cd backend
   mvn clean compile
   ```

3. **Start backend** (migrations will run automatically):
   ```bash
   mvn spring-boot:run
   ```
   
   Look for these messages in logs:
   ```
   Flyway: Successfully validated 2 migrations
   Flyway: Successfully applied 1 migration (V2)
   ```

4. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Test login with valid credentials:**
   - Try: `customer@test.com` / `password123`
   - Or create a new account
   - Login should now work ✅

## Database Schema Notes

### Valid Roles
| Role | Purpose |
|------|---------|
| `CUSTOMER` | Regular user ordering food |
| `RESTAURANT_OWNER` | Restaurant management |
| `ADMIN` | System administrator |
| `DELIVERY_BOY` | Delivery partner |

### Database Constraint
```sql
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('CUSTOMER', 'RESTAURANT_OWNER', 'ADMIN', 'DELIVERY_BOY'));
```

## Testing Scenarios

### Test Account Credentials
After migration, the following test users will be available:

1. **Customer Account**
   - Email: `customer@test.com`
   - Password: `password123`
   - Role: `CUSTOMER`

2. **Restaurant Owner**
   - Email: `owner@test.com`
   - Password: `password123`
   - Role: `RESTAURANT_OWNER`

3. **Delivery Partner**
   - Email: `delivery@test.com`
   - Password: `password123`
   - Role: `DELIVERY_BOY`

4. **Admin Account**
   - Email: `admin@test.com`
   - Password: `password123`
   - Role: `ADMIN`

## Verification Checklist

- ✅ No more "No enum constant" errors
- ✅ Login works with test accounts
- ✅ New registrations work properly
- ✅ Role assignments are correct
- ✅ Database constraint accepts all valid roles

## If You Get Errors

### Error: "Column 'password' of relation 'users' does not exist"
The test users table structure might be different. Verify the users table has these columns:
- `id` (PRIMARY KEY)
- `name`
- `email` (UNIQUE)
- `password`
- `phone` (NULLABLE)
- `role`
- `created_at`

### Error: "Conflicting or Duplicate Migration"
Delete the migration files and let Flyway re-run them on next startup.

### Still Getting Role Enum Error
1. Check database for records with invalid roles:
   ```sql
   SELECT DISTINCT role FROM users;
   ```
2. Verify migration files exist in `backend/src/main/resources/db/migration/`

---

**Last Updated:** November 24, 2025
**Status:** ✅ All role enum issues fixed
