// Dependencies
const inquirer = require('inquirer');
require('console.table');


const dbConnector = require('../index');

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
    const roleSelector = dbConnector.query(sqlRSelect, (err, res) => {
        if (err) throw err;
    });
    //do the name value map that you did in addRole above
    roleArray = roleSelector.map(elem => elem.title);
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
}