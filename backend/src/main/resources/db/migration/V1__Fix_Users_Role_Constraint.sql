-- Fix the users_role_check constraint to accept all valid role values
-- This migration removes the invalid constraint and adds a proper one

-- Step 1: Drop the existing invalid constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Step 2: Add the correct constraint that accepts all valid role values
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('CUSTOMER', 'RESTAURANT_OWNER', 'ADMIN', 'DELIVERY_BOY'));

-- Step 3: Ensure all existing rows comply with the constraint by setting null roles to CUSTOMER
UPDATE users SET role = 'CUSTOMER' WHERE role IS NULL;

-- Step 4: Make role column NOT NULL
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
