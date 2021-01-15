// Dependencies
const inquirer = require('inquirer');
const cTable = require('console.table');
const dbConnector = require('../index');
const { chooseOpt } = require('../app');

// Function to show all roles
function allRoles() {
    sqlRoles = `SELECT * FROM roles`;
    dbConnector.query(sqlRoles, (err, res) => {
        if (err) throw err;
        cTable(res);
        //call the menu for show a question again
        chooseOpt();
    });
}

// Function to add role
function addRole() {
    const sqlSelect = `SELECT * FROM department`;
    const selectDept = dbConnector.query(sqlSelect, (err, res) => {
        if (err) throw err;
    })
    let deptListing = selectDept.map(elem => elem.name);
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Please enter name of role you wish to add',
            // Validate entry
            validate: name => {
                if ((isNaN(name)) && name.length > 0) {
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
                if ((isNan(salary))) {
                    console.log("Please enter a valid salary!")
                } else {
                    return true;
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
        let roleTitle = roleAdded.title;
        let roleSalary = roleAdded.salary;
        let roleID = roleAdded.deptChoice;
        const sqlNewRole = `INSERT INTO role SET title=?,salary=?,department_id=?`;
        dbConnector.query(sqlNewRole, [roleTitle, roleSalary, roleID], (err, res) => {
            if (err) throw err;
            console.log("New role successfully added!");
            chooseOpt();
        })
    })
}


// Function to delete role
async function deleteRole() {
    const sqlRSelect = `SELECT * FROM role`;
    const roleSelector = dbConnector.query(sqlRSelect, (err, res) => {
        if (err) throw err;
    });
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
            sqlRDelete =  `DELETE FROM role WHERE id=?`; 
            dbConnector.query(sqlRDelete, [deletedRole], (err, res) => {
            if (err) throw err;
            console.log("Role was successfully deleted!");
        })
    chooseOpt();
    })
}



module.exports = { allRoles, addRole, deleteRole }