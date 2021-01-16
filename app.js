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


// Function to show all employee info
function allEmps() {
    sqlAllEmps = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS emp_title, role.salary AS emp_salary`;
    dbConnector.query(sqlAllEmps, (err, res) => { 
        if (err) throw err;
        console.table(res);
    })
    
    // Return to choice prompt
    chooseOpt();
}

// Function to add an employee
function addEmp() {
    const sqlEmpList = `SELECT role.title FROM role`;
    const empList = dbConnector.query(sqlEmpList, (err, res) => {
        if (err) throw err;
    });
    const sqlNamesList = `SELECT employee.first_name, employee.last_name FROM employee`;
    const namesList = dbConnector.query(sqlNamesList, (err, res) => {
        if (err) throw err;
    });
    const roleName = empList.map(elem => elem.title);

    inquirer.prompt([
        {
            type: 'input',
            name: 'empFirst',
            message: 'Please enter employee first name.',
            // Validate entry
            validate: firstName => {
                if ((isNaN(firstName)) && firstName.length > 0) {
                    return true;
                } else {
                    console.log("Please enter a valid first name!");
                }
            }
        },
        {
            type: 'input',
            name: 'empLast',
            message: 'Please enter employee last name.',
            validate: lastName => {           //validation the entry
                if ((isNaN(lastName)) && lastName.length > 0) {
                    return true;
                } else {
                    console.log("Please enter a valid last name!");
                }
            }
        },
        {
            type: 'list',
            name: 'selectRole',
            message: 'Please select the role for the new employee.',
            choices: roleName
        },
        {
            type: 'confirm',
            name: 'ManagerConf',
            message: 'Does this employee have a manager?',
            default: false,
        },
        {
            type: 'list',
            name: 'chooseManager',
            message: 'Please choose manager from list below:',
            choices: namesList,
            when: ({ ManagerConf }) => ManagerConf
        }
  
    ]).then(newEmp => {
        let newFirst = newEmp.empFirst;
        let newLast = newEmp.empLast;
        let newRole = newEmp.selectRole;
        let manOrNot = newEmp.chooseManager || null;
  
        //sql consult insert  a employee
        connection.query('INSERT INTO employee SET first_name=?,last_name=?,role_id=?,manager_id=? ', [newFirst, newLast, newRole, manOrNot], (err, res) => {
            if (err) throw err;
            console.log("Employee successfully added!");
            chooseOpt();
        })
    })
}


// Function to delete employee
function deleteEmp() {
    const sqlNamesList = `SELECT employee.first_name, employee.last_name FROM employee`;
    const namesList = dbConnector.query(sqlNamesList, (err, res) => {
        if (err) throw err;
    });
    inquirer.prompt([
        {
            type: 'list',
            name: 'empDelete',
            message: 'Select employee you wish to delete.',
            choices: namesList
        }
    ]).then(empToGo => {
        let deleteEmp = empToGo.empDelete;
        dbConnector.query('DELETE FROM employee WHERE id=? ', [deleteEmp], (err, res) => {
            if (err) throw err;
            console.log("Employee successfully deleted!");
            chooseOpt();
        })
    })
}


// Function to update employee role
function updateRole() {
    const sqlEmpList = `SELECT first_name, last_name FROM employee`;
    const nameList = dbConnector.query(sqlEmpList, (err, res) => {
        if (err) throw err;
    });
    const sqlRoleList = `SELECT role.title FROM role`;
    const roleList = dbConnector.query(sqlRoleList, (err, res) => {
        if (err) throw err;
    })
   
    inquirer.prompt([
        {
            type: 'list',
            name: 'fullName',
            message: 'Please select the employee whose role you wish to update.',
            choices: nameList
        },
        {
            type: 'list',
            name: 'selectRole',
            message: 'Please select the new role for the employee',
            choices: roleList
        }
    ]).then(updater => {
        let empUName = updater.fullName;
        let newRole = updater.selectRole;
        //query consult update role for a employee
        dbConnector.query('UPDATE employee SET employee.role_id=? WHERE employee.id=?', [newRole, empUName], (err, res) => {
            if (err) throw err;
            console.log("The employee's role has been updated!");
            
            // Return to choice prompt
            chooseOpt();
        })
    })
};