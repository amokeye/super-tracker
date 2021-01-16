// Dependencies
const inquirer = require('inquirer');

// const mysql = require('mysql2');
const dbConnector = require('./index');

// Imports
const { showDepts, addDept, deleteDept } = require('./Queries/departmentQueries');
// const { showRoles } = require('./Queries/roleQueries');

// Prompts to confirm what the user wishes to do
function chooseOpt() {
    inquirer.prompt(
        [
            {
                name: 'selectElement',
                type: 'list',
                message: 'Please choose an element to execute from the options below.',
                choices: [
                    'View all departments',
                    'Add department',
                    'Delete department',
                    // 'View all roles',
                    // 'Add role',
                    // 'Delete role',
                    // 'View all employees',
                    // 'Add employee',
                    // 'Delete employee',
                    // 'Update employee role',
                    // 'Exit'
                ]
            }
        ]
    ).then(opt => {
        switch (opt.selectElement) {
            case 'View all departments':
                showDepts();
                // looper();
                break;
            case 'Add department':
                addDept();
                // looper();
                break;
            case 'Delete department':
                deleteDept();
                break;
            // case 'View all roles':
            //     allRoles();
            //     break;
            // case 'Add role':
            //     addRole();
            //     break;
            // case 'Delete role':
            //     deleteRole();
            //     break;
            // case 'View all employees':
            //     allEmployees();
            //     break;
            // case 'Add employee':
            //     addEmployee();
            //     break;
            // case 'Delete employee':
            //     deleteEmployee();
            //     break;
            // case 'Update employee role':
            //     updateRole();
            //     break;
            // case `Update a Employee manager's name`:
            //     updateEmpManager()
            //     break;
            // case 'Show Employee by department':
            //     showEmployeebyDepto();
            //     break;
            // case 'Exit':
            // dbConnector.end();

            default:
                // dbConnector.end();
                // chooseOpt();
        }
    });
}

// function allRoles() {
//     const rows = showRoles();
//     console.table(rows);
//     chooseOpt();
// }

// Default response for any other request not found
dbConnector.connect(err => {
    if (err) throw err;

    console.log("Connected to mysql server.");
    // mysql query to create db
    // dbConnector.query("USE tracker", function (err, res) {
    //     if (err) throw err;
    //     console.log("Database tracker synced!");

        // Function for inquirer prompt (below)
        chooseOpt();
})


// Function to show all departments
function showDepts() {
    // Connection to request all data from department table
    const sqlShow = `SELECT * FROM department`;
    dbConnector.query(sqlShow, (err, res) => {
        if (err) throw err;
        console.table(res);
        // Return to the choice prompt
        chooseOpt();
    })
};


// Functon to add a deparment
function addDept() {
    inquirer.prompt(
        [{
            type: 'input',
            name: 'newName',
            message: 'Please enter new department to be added',
            // Validate entry
            validate: name => {
                if ((isNaN(name)) && name.length > 0) {
                    return true;
                } else {
                    console.log("Please enter a valid department name!");
                }
            }
        }]
    ).then(toAdd => {
        let newDept = toAdd.newName;
        const sqlInsert = `INSERT INTO department SET name=?`;
        dbConnector.query(sqlInsert, [newDept], (err, res) => {
            if (err) throw err;

            // Confirmed new dept was added
            console.log("New department successfully added!");

            // Return to choice prompt
            chooseOpt();
        })
    })
};


// Function to delete department
function deleteDept() {
    const sqlSelect = `SELECT id, name FROM department`;

    dbConnector.query(sqlSelect, (err, res) => {
        if (err) throw err;

        deptArray = res.map(elem => elem.name);
        inquirer.prompt([
            {
                type: "list",
                name: "deptList",
                message: "Choose a department to delete",
                choices: deptArray
            }
        ]).then(deptToDelete => {
            let deletedDept = deptToDelete.deptList;
            const sqlDelete = `DELETE FROM department WHERE name = ?`;
            dbConnector.query(sqlDelete, [deletedDept], (err, res) => {
                if (err) throw err;
                console.log(`Department: ${deletedDept} successfully deleted!`);
                chooseOpt();
            });
        })
    })
}


// })