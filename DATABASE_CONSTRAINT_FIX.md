# Database Constraint Fix - User Role Issue

## Problem
The database has a check constraint `users_role_check` that's preventing new user registrations with the error:
```
ERROR: new row for relation "users" violates check constraint "users_role_check"
```

## Root Cause
The PostgreSQL constraint on the `users` table is either:
1. Missing or incorrectly defined (not accepting all valid role values)
2. Only accepting certain role values that don't include 'CUSTOMER'

## Solutions Applied

### 1. **Enhanced User Model** 
**File:** `backend/src/main/java/com/food/delivery/model/User.java`

- Added `@Column(nullable = false, columnDefinition = "VARCHAR(50) DEFAULT 'CUSTOMER')` to ensure role column has proper constraints
- Updated `@PrePersist` to always set a default role (CUSTOMER) if none is provided

```java
@Enumerated(EnumType.STRING)
@Column(nullable = false, columnDefinition = "VARCHAR(50) DEFAULT 'CUSTOMER'")
private Role role;

@PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
    if (this.role == null) {
        this.role = Role.CUSTOMER;
    }
}
```

### 2. **Improved AuthService**
**File:** `backend/src/main/java/com/food/delivery/service/AuthService.java`

- Enhanced role validation in the register method
- Ensures role is always explicitly set before saving

```java
public AuthResponse register(RegisterRequest request) {
    // ... existing code ...
    
    // Ensure role is always set - default to CUSTOMER if not provided
    Role roleToSet = request.getRole();
    if (roleToSet == null) {
        roleToSet = Role.CUSTOMER;
    }
    user.setRole(roleToSet);
    
    userRepository.save(user);
    // ...
}
```

### 3. **Database Migration with Flyway**
**File:** `backend/src/main/resources/db/migration/V1__Fix_Users_Role_Constraint.sql`

Created a migration script that:
- Drops the existing invalid constraint
- Adds a proper constraint accepting all valid role values: 'CUSTOMER', 'RESTAURANT_OWNER', 'ADMIN', 'DELIVERY_BOY'
- Sets any NULL roles to 'CUSTOMER'
- Makes the role column NOT NULL

```sql
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('CUSTOMER', 'RESTAURANT_OWNER', 'ADMIN', 'DELIVERY_BOY'));
UPDATE users SET role = 'CUSTOMER' WHERE role IS NULL;
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
```

### 4. **Added Flyway Dependencies**
**File:** `backend/pom.xml`

Added:
- `org.flywaydb:flyway-core`
- `org.flywaydb:flyway-database-postgresql`

### 5. **Configured Flyway**
**File:** `backend/src/main/resources/application.properties`

```properties
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.out-of-order=true
```

## Steps to Apply the Fix

1. **Stop all servers:**
   ```bash
   # In PowerShell
   Get-Process | Where-Object {$_.ProcessName -match 'java|node|npm'} | Stop-Process -Force
   ```

2. **Clean and rebuild the backend:**
   ```bash
   cd backend
   mvn clean
   mvn compile
   ```

3. **Restart the backend:**
   ```bash
   mvn spring-boot:run
   ```
   - Flyway will automatically run the migration on startup
   - Check logs for: `"Successfully validated 1 migration"` and `"Successfully applied 1 migration"`

4. **Restart the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Test registration and login:**
   - Navigate to `http://localhost:5173/register`
   - Create a new account
   - Login with the new credentials
   - The role constraint error should be resolved

## Verification

After applying these fixes, you should see:
- ✅ Successful user registration
- ✅ Proper role assignment (defaults to CUSTOMER)
- ✅ Successful login with new accounts
- ✅ No database constraint violations

## Rollback (if needed)

If you need to rollback:
1. The Flyway migration can be manually undone by connecting to PostgreSQL and running:
   ```sql
   ALTER TABLE users DROP CONSTRAINT users_role_check;
   -- Then recreate the original constraint
   ```

## Notes

- The migration will only run once on first application startup
- Existing users with NULL roles will be automatically set to CUSTOMER
- Future registrations will always have a valid role
- All role values (CUSTOMER, RESTAURANT_OWNER, ADMIN, DELIVERY_BOY) are now properly supported

---

**Last Updated:** November 24, 2025
**Status:** ✅ Ready for deployment
