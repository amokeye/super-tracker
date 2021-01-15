// Dependencies
const inquirer = require('inquirer');

// const mysql = require('mysql2');
const dbConnector = require('./index');

// Imports
// const { allDepts, addDept, deleteDept } = require('./Queries/departmentQueries');
// const { allRoles, addRole, deleteRole } = require('./Queries/roleQueries');
const { allEmps, addEmp, deleteEmp, updateRole } = require('./Queries/employeeQueries');

// Prompts to confirm what the user wishes to do
function chooseOpt() {
    inquirer.prompt(
        [
            {
                name: 'selectElement',
                type: 'list',
                message: 'Please choose an element to execute from the options below.',
                choices: [
                    // 'View all departments',
                    // 'Add department',
                    // 'Delete department',
                    // 'View all roles',
                    // 'Add role',
                    // 'Delete role',
                    'View all employees',
                    'Add employee',
                    'Delete employee',
                    'Update employee role',
                    // 'Exit'
                ]
            }
        ]
    ).then(opt => {
        switch (opt.selectElement) {
            case 'View all departments':
                showDepts();
                break;
            case 'Add department':
                addDept();
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
            case 'View all employees':
                allEmps();
                break;
            case 'Add employee':
                addEmp();
                break;
            case 'Delete employee':
                deleteEmp();
                break;
            case 'Update employee role':
                updateRole();
                break;
            // case `Update a Employee manager's name`:
            //     updateEmpManager()
            //     break;
            // case 'Show Employee by department':
            //     showEmployeebyDepto();
            //     break;
            // case 'Exit':
            // dbConnector.end();

            default:
                chooseOpt();

        }
    });
}

// Default response for any other request not found
dbConnector.connect(err => {
    if (err) throw err;

    console.log("Connected to mysql server.");
    // mysql query to create db
    dbConnector.query("USE tracker", function (err, res) {
        if (err) throw err;
        console.log("Database tracker synced!");

        // Function for inquirer prompt (below)
        chooseOpt();
    })

})

module.exports.chooseOpt = chooseOpt;