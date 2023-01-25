-- Starting departments for application
INSERT INTO department(department_name)
VALUES ("Sales"),
       ("Enginerring"),
       ("Finance"),
       ("Legal");
-- Starting roles for appliccation
INSERT INTO role_employee (title, salary, department_id)
VALUES ("Lead Sales", 55000, 1),
       ("Lead Engineer", 70000, 2),
       ("Lead Accountant", 65000, 3),
       ("Associate Attorney", 35000, 4); 

-- Starting employees for application
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Colton", "Wilson", 2, NULL),
       ("James", "Grey", 2, 1),
       ("Dirk", "Knwikz", 1, NULL),
       ("Kaitlyn", "Neemor", 1, 1),
       ("Sahsha", "Berikon", 3, NULL),
       ("Manuel", "Guiterez", 3, 1),
       ("Heather", "Madison", 4, NULL);