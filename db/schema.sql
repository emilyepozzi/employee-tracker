USE employee_tracker_db;

INSERT INTO 
    department(name) 
VALUES 
    ("Sales"), 
    ("Engineering");

INSERT INTO 
    role(title, department_id) 
VALUES 
    ("Manager", 1), 
    ("Salesperson", 2);

INSERT INTO 
    employee(first_name, last_name, role_id, manager_id)
VALUES 
    ("Emily", "Pozzi", 1, NULL), 
    ("Michael",  "Cera", 2, NULL);