// Dependencies
const inquirer = require('inquirer');
require('console.table');

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
                    'View all employees',
                    'Add employee',
                    'Delete employee',
                    'Update employee role',
                    'Exit'
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
            case 'Exit':
                dbConnector.end();

            default:
                chooseOpt();
        }
    });
}


// Confirm connection to mysql2 server and begin prompt
dbConnector.connect(err => {
    if (err) throw err;

    console.log("Connected to mysql server.");
    // mysql query to create db
    dbConnector.query(`USE tracker`, function (err, res) {
        if (err) throw err;

        // Return to choice prompt
        chooseOpt();
    })
})


// Function to show all departments
function allDepts() {
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
            console.log("New department successfully added! View all departments to see newly added department.");

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
                console.log("Department successfully deleted!");
                chooseOpt();
            });
        })
    })
}


// Function to show all roles
function allRoles() {
    sqlRoles = `SELECT * FROM role`;
    dbConnector.query(sqlRoles, (err, res) => {
        if (err) throw err;
        console.table(res);

        // Return to choice prompt
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
                console.log("New role successfully added! View all roles to see newly added role.");
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
    sqlAllEmps = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS emp_title, role.salary AS emp_salary,
        CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN employee manager ON manager.id=employee.manager_id`;
    dbConnector.query(sqlAllEmps, (err, res) => {
        if (err) throw err;
        console.table(res);

        // Return to choice prompt
        chooseOpt();
    })
}

// Function to add an employee
function addEmp() {
    const sqlEmpList = `SELECT role.title, role.id FROM role`;
    dbConnector.query(sqlEmpList, (err, res) => {
        if (err) throw err;
        
        const roleNameArray = res.map(elem => {
            return (
                {
                    name: elem.title,
                    value: elem.id
                }
            )
        });


        const sqlNamesList = `SELECT CONCAT(employee.first_name, " ", employee.last_name) AS fullName, role_id FROM employee`;
        dbConnector.query(sqlNamesList, (err, res) => {
            if (err) throw err;
            const managerList = res.map(elem => {
                return (
                    {
                        name: elem.fullName,
                        value: elem.role_id
                    }
                )
            })

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
                    choices: roleNameArray
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
                    choices: managerList,
                    when: ({ ManagerConf }) => ManagerConf
                }

            ]).then(newEmp => {
                // Variables to show
                let newFirst = newEmp.empFirst;
                let newLast = newEmp.empLast;
                let newRole = newEmp.selectRole;
                let manOrNot = newEmp.chooseManager || null;

                dbConnector.query('INSERT INTO employee SET first_name=?,last_name=?,role_id=?,manager_id=? ', [newFirst, newLast, newRole, manOrNot], (err, res) => {
                    if (err) throw err;
                    console.log("Employee successfully added! View all employees to see newly added employee.");
                    chooseOpt();
                })
            })
        })
    })
}


// Function to delete employee
function deleteEmp() {
    const sqlNamesList = `SELECT CONCAT(employee.first_name, " ", employee.last_name) AS fullName, employee.id AS empID FROM employee`;
    dbConnector.query(sqlNamesList, (err, res) => {
        if (err) throw err;
        const delList = res.map(elem => {
            return (
                {
                    name: elem.fullName,
                    value: elem.empID
                }
            )
        })

        inquirer.prompt([
            {
                type: 'list',
                name: 'empDelete',
                message: 'Select employee you wish to delete.',
                choices: delList
            }
        ]).then(empToGo => {
            let deleteEmp = empToGo.empDelete;
            dbConnector.query(`DELETE FROM employee WHERE employee.id=?`, [deleteEmp], (err, res) => {
                if (err) throw err;
                console.log("Employee successfully deleted!");
                chooseOpt();
            })
        })
    })
}


// Function to update employee role
function updateRole() {
    const sqlEmpList = `SELECT CONCAT(employee.first_name, " ", employee.last_name) AS fullName, employee.id AS empID, employee.role_id, role.title AS titleList FROM employee LEFT JOIN role ON employee.role_id = role.id`;
    dbConnector.query(sqlEmpList, (err, res) => {
        if (err) throw err;
        const empArray = res.map(elem => {
            return (
                {
                    name: elem.fullName,
                    value: elem.empID
                }
            )
        });

        const titleArray = res.map(elem => {
            if (err) throw err;
            return (
                {
                    name: elem.titleList,
                    value: elem.role_id
                }
            )
        });

        inquirer.prompt([
            {
                type: 'list',
                name: 'fullName',
                message: 'Please select the employee whose role you wish to update.',
                choices: empArray
            },
            {
                type: 'list',
                name: 'selectRole',
                message: 'Please select the new role for the employee',
                choices: titleArray
            }
        ]).then(updater => {
            let newRole = updater.selectRole;
            let updatedEmp = updater.fullName;

            dbConnector.query(`UPDATE employee SET role_id=? WHERE id=?`, [newRole, updatedEmp], (err, res) => {
                if (err) throw err;
                console.log("The employee's role has been updated! View all employees to see employee with new role.");

                // Return to choice prompt
                chooseOpt();
            })
        })
    })
};