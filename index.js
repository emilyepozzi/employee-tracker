//saves passwords and data
require('dotenv').config();

//mysql connection
var mysql = require("mysql2");
// var express = require("express");
const inquirer = require("inquirer");
const cTable = require("console.table");
// const { response } = require("express");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.db_pass,
    database: "employee_tracker_db"
})

connection.connect(function(err){
    if (err) throw err;
    console.log("App is connected")
    init()
});

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
            //make a default to exit application and quit mysql connection
        }
    })
};

//functions for each(8) actions
function displayEmployees() {
    const emQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, 
    CONCAT(manager.first_name,' ', manager.last_name) AS manager, department.name
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id`

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

function viewRoles() {
    const roleQuery = 'SELECT * FROM role'
    connection.query(roleQuery, (err, data) => {
        if (err) throw err;
        console.table(data);
        init();
    })
};

//function to display employees by department 
function displayEmByDep() {
    const depQuery1 = ("SELECT * FROM department");

    connection.query(depQuery1, (err, response) => {
        if (err) throw err;
        const departments = response.map(element => {
            return {name: '${element.name}' }
        });

        inquirer.prompt([{
            type: "list",
            name: "dept",
            message: "Please select a department to view employees",
            choices: departments

        }]).then(answer => {
            const depQuery2 = `SELECT employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name,' ', manager.last_name) AS manager, 
            FROM employee LEFT JOIN role on employee.role_id = role.id
            LEFT JOIN department ON role.department_id =department.id LEFT JOIN employee manager ON employee.manager_id=manager.id
            WHERE ?`
            connection.query(depQuery2, [{ name: answer.dept}], function (err, res) {
                if (err) throw err;
                console.table(res)
                init();
            })
        })
    })
};

//funct to display employees by manager
function displayEmByManager() {
    let query1 = 'SELECT * FROM employee e WHERE e.manager_id IS NULL';

    connection.query(query1, function (err, res) {
        if (err) throw err;
        const managers = res.map(function (element) {
            return {
                name: '${element.first_name} ${element.last_name}',
                value: element.id
            }
        });

        inquirer.prompt([{
            type: "list",
            name: "emByManager",
            message: "Please select manager to view employees",
            choices: managers
        }])
        .then(response => {
            console.log(response.emByManager)
            let query2 = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name, ' ', manager.last_name)
            LEFT JOIN role on employee.role_id = role.id
            LEFT JOIN department on department.id = role.department_id
            LEFT JOIN employee manager on employee.manager_id = manager.id
            WHERE employee.manager_id = ?`
            connection.query(query2, [response.emByManager], (err, data) => {
                if (err) throw err;
                console.table(data);
                init()
            })
        })
    })
};

//function to add a new employee
function addEmployee() {
    let addQuery = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, department.name, role.salary, employee.manager_id
    FROM employee
    INNER JOIN role on role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id`
    connection.query(addQuery, (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "first_name", 
                message: "Please enter employee first name"
            }, { 
                type: "input",
                name: "last_name",
                message: "Please enter employee last name"
            }, {
                type: "list",
                name: "role",
                message: "Please select employee title",
                choices: results.map(role => {
                    return { name: role.title, value: role.role_id }
                })
            }, { 
                type: "input",
                name: "manager",
                message: "Please enter employee manager id"
            }
        ])
        .then(answer => {
            console.log(answer);
            connection.query(
                "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
                [answer.first_name, answer.last_name, answer.role, answer.manager],
                function (err) {
                    if (err) throw err
                    console.log('${answer.first_name} ${answer.last_name} added as a new employee')
                    init();
                } 
            )
        })
    })
};