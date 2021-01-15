// Dependencies
const inquirer = require('inquirer');
const cTable = require('console.table');
const dbConnector = require('../index');
const { chooseOpt } = require('../app');

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


module.exports = { allEmps, addEmp, deleteEmp, updateRole }