-- Fictional learning data. Run in an empty SQLite or PostgreSQL database.
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT);
INSERT INTO products VALUES (1,'Notebook','Stationery'),(2,'Pen','Stationery'),(3,'Mug','Home');
CREATE TABLE sales (id INTEGER PRIMARY KEY, product_id INTEGER, sale_date TEXT, amount INTEGER);
INSERT INTO sales VALUES
 (101,1,'2026-11-02',40),(102,2,'2026-11-07',15),(103,3,'2026-11-08',30),
 (104,1,'2026-11-20',20),(105,3,'2026-12-01',25),(106,2,'2026-10-31',10);
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO customers VALUES (1,'Sam Lee'),(2,'Sam Lee'),(3,'Jo Patel');
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, amount INTEGER);
INSERT INTO orders VALUES
 (201,1,'2026-11-03',20),(202,1,'2026-11-15',30),(203,2,'2026-11-05',40),
 (204,3,'2026-12-01',90),(205,2,'2026-10-31',10);
-- A002 is a confirmed duplicate export record; A003's amount is unknown.
CREATE TABLE observations (order_id TEXT, amount INTEGER);
INSERT INTO observations VALUES ('A001',10),('A002',20),('A002',20),('A003',NULL),('A004',50),('A005',20);
CREATE TABLE guided_observations (order_id TEXT, amount INTEGER);
INSERT INTO guided_observations VALUES ('B001',12),('B002',18),('B003',60),('B004',NULL);
