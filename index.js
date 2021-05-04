//mysql connection

//inquirer to ask questions
//function to initialize application
function init() {
    inquirer.prompt({
        type: "list",
        name: "start",
        message: "What would you like to do?",
        choices: ["View All Employees", "View All Departments", "View All Roles", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Add Employee Role", "Remove Role", "Add New Department", "Remove Department"]
    })
    .then(function (response) {
        switch (response.start) {

            case "View All Employees":
                displayEmployees();
                break;

            case "View All Departments":
                viewDepartments();
                break;

            case "View All Roles":
                viewRoles();
                break;

            case "View All Employees By Department":
            displayEmByDep();
            break;

            case "View All Employees By Manager":
            displayEmByManager();
            break;

            case "Add Employee":
            addEmployee();
            break;

            case "Remove Employee":
            removeEmployee();
            break;

            case "Update Employee Role":
            updateEmpRole();
            break;

            case "Add Employee Role":
            addRole();
            break;

            case "Remove Role":
            removeRole();
            break;

            case "Add New Department":
            addDepartment();
            break;

            case "Remove Department":
            removeDept();
            break;

            case "Update Employee Manager":
            updateEmpManager();
            break;
        }
    })
};

//functions for each(8) actions
function displayEmployees() {
    const emQuery = 'SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, 
    CONCAT(manager.first_name,' ', manager.last_name) AS manager, department.name
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id'

    connection.query(emQuery, (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    })
};

function viewDepartments() {
    const depQuery = 'SELECT * FROM department'
    connection.query(depQuery, (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    })
};

function view