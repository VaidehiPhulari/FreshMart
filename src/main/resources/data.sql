-- Insert sample grocery products if they don't exist
INSERT INTO product (id, name, price, image_url) VALUES (1, 'Fresh Apples (1 kg)', 200.00, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?auto=format&fit=crop&w=400&q=80');
INSERT INTO product (id, name, price, image_url) VALUES (2, 'Bananas (1 bunch)', 60.00, 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80');
INSERT INTO product (id, name, price, image_url) VALUES (3, 'Whole Milk (1 L)', 70.00, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80');
INSERT INTO product (id, name, price, image_url) VALUES (4, 'Farm Fresh Eggs (Dozen)', 90.00, 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=400&q=80');
INSERT INTO product (id, name, price, image_url) VALUES (5, 'Whole Wheat Bread', 50.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80');
INSERT INTO product (id, name, price, image_url) VALUES (6, 'Organic Tomatoes (1 kg)', 100.00, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80');
INSERT INTO product (id, name, price, image_url) VALUES (7, 'Red Onion (1 kg)', 40.00, 'https://images.unsplash.com/photo-1618512496248-a07ce83aa8cb?auto=format&fit=crop&w=400&q=80');
INSERT INTO product (id, name, price, image_url) VALUES (8, 'Potatoes (1 kg)', 30.00, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80');
INSERT INTO product (id, name, price, image_url) VALUES (9, 'Basmati Rice (1 kg)', 150.00, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80');
INSERT INTO product (id, name, price, image_url) VALUES (10, 'Lentils / Dal (1 kg)', 120.00, 'https://images.unsplash.com/photo-1623832103507-62f754700cfa?auto=format&fit=crop&w=400&q=80');

-- Optional: Create a dummy user for testing
INSERT INTO users (id, username, password) VALUES (1, 'testuser', 'password123');
