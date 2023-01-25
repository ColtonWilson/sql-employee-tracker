-- Drop database if it exists
DROP DATABASE IF EXISTS employee_tracker_db;
-- Create database if not already created
CREATE DATABASE IF NOT EXISTS employee_tracker_db;

-- Use database
USE employee_tracker_db;

-- Department table layout from assignment description and module 12 lesson 19
CREATE TABLE IF NOT EXISTS department(
        id INT NOT NULL AUTO_INCREMENT,
        department_name VARCHAR(30) NOT NULL,
        PRIMARY KEY (id)
);
-- Role table layout from assignment description and module 12 lesson 19
CREATE TABLE IF NOT EXISTS role_employee(
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(30) NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INT,
        PRIMARY KEY (id),
        FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON DELETE SET NULL
);

-- Employee table layout from assignment description and module 12 lesson 19
CREATE TABLE IF NOT EXISTS employee(
        id INT NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INT,
        manager_id INT,
        PRIMARY KEY (id),
        FOREIGN KEY (role_id)
        REFERENCES role_employee(id)
        ON DELETE SET NULL
);