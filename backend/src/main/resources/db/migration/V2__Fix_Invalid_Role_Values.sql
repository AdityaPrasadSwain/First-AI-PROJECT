-- Fix invalid role values in the database
-- Convert old role names to the correct enum values

-- Fix USER -> CUSTOMER
UPDATE users SET role = 'CUSTOMER' WHERE role = 'USER';

-- Fix DELIVERY_PARTNER -> DELIVERY_BOY
UPDATE users SET role = 'DELIVERY_BOY' WHERE role = 'DELIVERY_PARTNER';

-- Ensure the constraint only allows valid roles
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('CUSTOMER', 'RESTAURANT_OWNER', 'ADMIN', 'DELIVERY_BOY'));
