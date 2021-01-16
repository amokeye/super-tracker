// Dependencies
const inquirer = require('inquirer');

// Mysql connection from index.js file
const dbConnector = require('./index');

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
                    'View all roles',
                    'Add role',
                    'Delete role',
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
                allDepts();
                break;
            case 'Add department':
                addDept();
                break;
            case 'Delete department':
                deleteDept();
                break;
            case 'View all roles':
                allRoles();
                break;
            case 'Add role':
                addRole();
                break;
            case 'Delete role':
                deleteRole();
                break;
            // case 'View all employees':
            //     allEmps();
            //     break;
            // case 'Add employee':
            //     addEmp();
            //     break;
            // case 'Delete employee':
            //     deleteEmp();
            //     break;
            // case 'Update employee role':
            //     updateRole();
            //     break;
            // case `Update a Employee manager's name`:
            //     updateEmpManager()
            //     break;
            // case 'Show Employee by department':
            //     showEmpbyDept();
            //     break;
            // case 'Exit':
            // dbConnector.end();

            default:
                // dbConnector.end();
                chooseOpt();

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
    dbConnector.query("USE tracker", function (err, res) {
        if (err) throw err;

        // Return to inquirer prompt
        chooseOpt();
    })
})

// Function to show all roles
function allRoles() {
    sqlRoles = `SELECT * FROM role`;
    dbConnector.query(sqlRoles, (err, res) => {
        if (err) throw err;
        console.table(res);
        //call the menu for show a question again
        chooseOpt();
    });
}

// Function to add role
function addRole() {
    const sqlSelect = `SELECT * FROM department`;
    dbConnector.query(sqlSelect, (err, res) => {
        if (err) throw err;

        const deptListing = res.map(elem => {
            return (
                {
                    name: elem.name,
                    value: elem.id
                }
            )
        });
        inquirer.prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'Please enter name of role you wish to add',
                // Validate entry
                validate: name => {
                    if (name.length > 0) {
                        return true;
                    } else {
                        console.log("Please enter a valid role!");
                    }
                }
            },
            {
                type: 'input',
                name: 'salaryInfo',
                message: 'Please enter the salary information for this role',
                // Validate entry
                validate: salary => {
                    if (salary.length > 0) {
                        return true;
                    } else {
                        console.log("Please enter a valid salary!")
                    }
                }
            },
            {
                type: 'list',
                name: 'deptChoice',
                message: 'Please select the department that the role belongs to',
                choices: deptListing
            }
        ]).then(roleAdded => {
            let roleTitle = roleAdded.roleName;
            let roleSalary = roleAdded.salaryInfo;
            let roleID = roleAdded.deptChoice;
            const sqlNewRole = `INSERT INTO role SET title=?,salary=?,department_id=?`;
            dbConnector.query(sqlNewRole, [roleTitle, roleSalary, roleID], (err, res) => {
                if (err) throw err;
                console.log("New role successfully added!");
                chooseOpt();
            })
        })
    })
}


// Function to delete role
function deleteRole() {
    const sqlRSelect = `SELECT * FROM role`;
    dbConnector.query(sqlRSelect, (err, res) => {
        if (err) throw err;

        const roleArray = res.map(elem => {
            return (
                {
                    name: elem.title,
                    value: elem.id
                }
            )
        });

        //do the name value map that you did in addRole above
        inquirer.prompt([
            {
                type: 'list',
                name: 'roleDelete',
                message: 'Choose role that you wish to delete',
                choices: roleArray
            }
        ]).then(roleToGo => {
            let deletedRole = roleToGo.roleDelete;
            sqlRDelete = `DELETE FROM role WHERE id=?`;
            dbConnector.query(sqlRDelete, [deletedRole], (err, res) => {
                if (err) throw err;
                console.log("Role was successfully deleted!");
                chooseOpt();
            })
        })
    })
}