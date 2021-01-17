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
    ('Wilfredo','Umanzor',1,NULL),
    ('Marie','Calendar',1,1),
    ('Yeyby','Meza',2,NULL),
    ('Brandon','Callender',2,3),
    ('Elizabeth','Nguyen',3,NULL),
    ('Fe','Bongolan',3,5),
    ('Joseph','Anderson',4,NULL),
    ('Jeff','Ogar',4,7),
    ('Alyssa','Johnson',5,NULL),
    ('Johaina','Crisostomo',5,9),
    ('Heidi','Guerrero',6,NULL),
    ('Madeline','Lesser',6,11),
    ('Lucious','Lebeaux',7,NULL),
    ('Sachi','Ihara',7,13);