USE tracker;

INSERT INTO department (name)
VALUES
    ('Human Resorces'),
    ('Legal'),
    ('Customer Services'),
    ('Finance'),
    ('Supply Chain Management'),
    ('IT'),
    ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Human Resources Administrator',3600,1),
    ('LegalShield Lawyer',4500,2),
    ('Customer Service Agent',3100,3),
    ('Financial Analyst',3200,4),
    ('Director of Risk Mgmt',3000,5),
    ('IT Leadership',3500,6),
    ('Sales Representative',2900,7);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES
    ('Wilfredo','Umanzor',1,1),
    ('Yeyby','Meza',2,NULL),
    ('Elizabeth','Nguyen',3,NULL),
    ('Joseph','Anderson',4,NULL),
    ('Alyssa','Johnson',5,NULL),
    ('Heidi','Guerrero',6,NULL),
    ('Lucious','Lebeaux',7,NULL);