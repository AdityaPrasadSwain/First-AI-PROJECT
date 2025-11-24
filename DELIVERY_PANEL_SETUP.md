# Delivery Panel Setup Guide

## Problem
You're getting "login failed" when trying to access the delivery panel because the user account doesn't have the DELIVERY_PARTNER role.

## Solution Options

### Option 1: Register a New Delivery Partner Account

1. **Go to Register Page**: http://localhost:5173/register

2. **Open Browser Console** (F12)

3. **Before clicking "Create Account", run this in console**:
   ```javascript
   // Intercept the registration to add DELIVERY_PARTNER role
   const originalFetch = window.fetch;
   window.fetch = function(...args) {
       if (args[0].includes('/auth/register')) {
           const body = JSON.parse(args[1].body);
           body.role = 'DELIVERY_PARTNER';
           args[1].body = JSON.stringify(body);
       }
       return originalFetch.apply(this, args);
   };
   ```

4. **Fill the registration form** and click "Create Account"

5. **You'll be logged in as a Delivery Partner**

### Option 2: Update Existing User in Database

1. **Connect to your PostgreSQL database**:
   ```bash
   psql -U your_username -d food_delivery
   ```

2. **Update user role**:
   ```sql
   UPDATE users 
   SET role = 'DELIVERY_PARTNER' 
   WHERE email = 'your.email@example.com';
   ```

3. **Verify the update**:
   ```sql
   SELECT id, name, email, role FROM users WHERE email = 'your.email@example.com';
   ```

4. **Logout and login again** to refresh the token

### Option 3: Use pgAdmin or Database GUI

1. Open pgAdmin or your database management tool
2. Connect to the `food_delivery` database
3. Navigate to: `Schemas` → `public` → `Tables` → `users`
4. Find your user record
5. Edit the `role` column to `DELIVERY_PARTNER`
6. Save changes
7. Logout and login again

## Available Roles

- **USER**: Regular customer (default)
- **RESTAURANT_OWNER**: Can manage restaurant and menu
- **DELIVERY_PARTNER**: Can access delivery dashboard
- **ADMIN**: Full system access

## Testing Different Roles

### Create Test Accounts

**Customer Account**:
- Register normally (default role is USER)

**Restaurant Owner**:
1. Register an account
2. Update role in database to `RESTAURANT_OWNER`
3. Create a restaurant via API or database

**Delivery Partner**:
1. Register an account
2. Update role in database to `DELIVERY_PARTNER`
3. Access delivery dashboard

## Verify Your Role

After logging in, check the browser console:
```javascript
// Check stored user data
console.log(JSON.parse(localStorage.getItem('user')));
```

You should see:
```json
{
  "name": "Your Name",
  "email": "your.email@example.com",
  "role": "DELIVERY_PARTNER"
}
```

## Access Delivery Dashboard

Once you have DELIVERY_PARTNER role:

1. **Login** with your credentials
2. **Click on your name** in the navbar
3. **Select "Delivery Dashboard"** from dropdown
4. **Or navigate directly** to: http://localhost:5173/delivery/dashboard

## Troubleshooting

### "Access Denied" or "403 Forbidden"
- Your role is not DELIVERY_PARTNER
- Token might be old - logout and login again
- Check browser console for errors

### "No orders available"
- Create some orders first as a customer
- Orders must be in PREPARING or OUT_FOR_DELIVERY status
- Restaurant owner needs to update order status

### Dashboard not showing in navbar
- Clear browser cache
- Logout and login again
- Verify role in localStorage

## Quick Test Flow

1. **Create Customer Account** → Place an order
2. **Create Restaurant Owner Account** → Update order to PREPARING
3. **Create Delivery Partner Account** → Pick up and deliver order

This simulates the complete order flow!
