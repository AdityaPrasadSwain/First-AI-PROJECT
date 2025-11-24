-- Test Users for Food Delivery Application
-- Password for all users: password123

-- 1. Regular Customer
-- Email: customer@test.com
-- Password: password123
-- Role: CUSTOMER
INSERT INTO users (name, email, password, phone, role, created_at) 
VALUES (
    'Test Customer',
    'customer@test.com',
    '$2a$10$xQZ9YxZ9YxZ9YxZ9YxZ9YeK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K',
    '+1234567890',
    'CUSTOMER',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. Restaurant Owner
-- Email: owner@test.com
-- Password: password123
-- Role: RESTAURANT_OWNER
INSERT INTO users (name, email, password, phone, role, created_at) 
VALUES (
    'Test Restaurant Owner',
    'owner@test.com',
    '$2a$10$xQZ9YxZ9YxZ9YxZ9YxZ9YeK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K',
    '+1234567891',
    'RESTAURANT_OWNER',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- 3. Delivery Partner
-- Email: delivery@test.com
-- Password: password123
-- Role: DELIVERY_BOY
INSERT INTO users (name, email, password, phone, role, created_at) 
VALUES (
    'Test Delivery Partner',
    'delivery@test.com',
    '$2a$10$xQZ9YxZ9YxZ9YxZ9YxZ9YeK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K',
    '+1234567892',
    'DELIVERY_BOY',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- 4. Admin
-- Email: admin@test.com
-- Password: password123
-- Role: ADMIN
INSERT INTO users (name, email, password, phone, role, created_at) 
VALUES (
    'Test Admin',
    'admin@test.com',
    '$2a$10$xQZ9YxZ9YxZ9YxZ9YxZ9YeK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K',
    '+1234567893',
    'ADMIN',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Note: The password hash above is a placeholder. 
-- You need to generate actual BCrypt hashes for 'password123'
-- Or register users through the application UI
