-- Test user: email=test@test.com, password=test123
INSERT INTO users (name, email, password, phone, address) VALUES 
('Test User', 'test@test.com', 'test123', '1234567890', '123 Test Street');

INSERT INTO product (name, description, brand, price, category, release_date, product_available, stock_quantity) VALUES 
('MacBook Pro M3 14"', 'Apple M3 Pro chip with 11‑core CPU, 14‑core GPU, 18GB Unified Memory, 512GB SSD Storage', 'Apple', 1999.00, 'Laptop', '2024-01-15', true, 50),
('Dell XPS 15', '15.6" OLED Touch Display, Intel Core i9, 32GB RAM, 1TB SSD, NVIDIA RTX 4070', 'Dell', 2299.99, 'Laptop', '2023-11-20', true, 35),
('Sony WH-1000XM5', 'Wireless Industry Leading Noise Canceling Headphones with Auto Noise Canceling Optimizer', 'Sony', 398.00, 'Audio', '2023-08-05', true, 120),
('iPhone 15 Pro Max', 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.', 'Apple', 1199.00, 'Mobile', '2023-09-22', true, 90),
('Samsung Galaxy S24 Ultra', 'Titanium exterior, 6.8" flat display, Snapdragon 8 Gen 3, and Galaxy AI features.', 'Samsung', 1299.99, 'Mobile', '2024-01-31', true, 80),
('LG C3 65-Inch 4K OLED TV', 'OLED evo 4K Smart TV with webOS, 120Hz Refresh Rate, Dolby Vision & Atmos.', 'LG', 1596.99, 'Electronics', '2023-04-10', true, 25),
('Bose QuietComfort Earbuds II', 'Wireless, Bluetooth, World’s Best Noise Cancelling In-Ear Headphones with Personalized Noise Cancellation.', 'Bose', 279.00, 'Audio', '2023-09-15', true, 150),
('PlayStation 5 Console', 'Sony PlayStation 5 Console (Disc Edition) with DualSense Wireless Controller.', 'Sony', 499.00, 'Gaming', '2021-11-12', true, 10),
('Logitech MX Master 3S', 'Wireless Performance Mouse, Ultra-fast Scrolling, Ergo, 8K DPI, Track on Glass, Quiet Clicks.', 'Logitech', 99.99, 'Accessories', '2022-05-24', true, 200),
('iPad Pro 12.9-inch (M2)', 'Liquid Retina XDR display, M2 chip, Wi‑Fi 6E, Face ID, all-day battery life.', 'Apple', 1099.00, 'Tablet', '2022-10-26', true, 60);
