/*Basic Seeds to get Agora up and running*/

CREATE DATABASE jdr_bamazon;

USE jdr_bamazon;

CREATE TABLE products (
    id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(5, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    net_sales DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity, net_sales) VALUES
    ('Hoplite Helmet', 'War Goods', 26.00, 150, 0.00),
    ('Hoplite Sheild', 'War Goods', 49.75, 50, 0.00),
    ('Amphora', 'Household Goods', 12.50, 500, 0.00),
    ('Papyrus', 'Office Supplies', 12.50, 500, 0.00),
    ('Histories', 'Books', 13.30, 40, 0.00),
    ('The Pelopennesian War', 'Books', 17.55, 30, 0.00),
    ('The Republic', 'Books', 15.90, 25),
    ('Antikythera Device', 'Household Goods', 899.99, 3, 0.00),
    ('Trireme', 'War Goods', 699.99, 40, 0.00),
    ('Quinquireme', 'War Goods', 799.99, 20, 0.00),
    ('Vintage Attican Wine', 'Food and Beverage', 29.99, 100, 0.00),
    ('Vintage Corinthian Red', 'Food and Beverage', 19.99, 100, 0.00),
    ('Lacadaemonian White', 'Food and Beverage', 19.99, 100, 0.00),
    ('Reserve Olymus Mead', 'Food and Beverage', 14.99, 100, 0.00),
    ('Hoplite Spear', 'War Goods', 15.99, 400, 0.00),
    ('Peltast Javelins', 'War Goods', 7.99, 300, 0.00);

/*Generates the customer cart table*/

CREATE TABLE myCart (
    product_name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL, 
    quantity_bought INTEGER NOT NULL
);

/*SEEDS AHEAD FOR RUNNING THE SUPERVISOR METHODS*/

CREATE TABLE departments (
    dept_id INTEGER AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    overhead DECIMAL (10, 2) NOT NULL,   
    sales DECIMAL (10, 2) NOT NULL,
    profit DECIMAL (10, 2) NOT NULL,
    PRIMARY KEY (dept_id)
);

INSERT INTO departments (department_name, overhead, sales, profit) VALUES 
	('War Goods', 1000.00, 00.00, 00.00),
	('Houshold Goods', 1000.00, 00.00, 00.00),
	('Food and Beverage', 1000.00, 00.00, 00.00),
	('Books', 1000.00, 00.00, 00.00),
	('Office Supplies', 1000.00, 00.00, 00.00);