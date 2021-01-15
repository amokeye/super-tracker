// Dependency
const cTable = require('console.table');
const inquirer = require('inquirer');

// Imports
const dbConnector = require('../index');
const { chooseOpt } = require('../app');

// Function to show all departments
function showDepts() {
    // Connection to request all data from department table
    const sqlShow = `SELECT * FROM department`;
    dbConnector.query(sqlShow, (err, res) => {
        if (err) throw err;
        console.table(res);
    })

    // Return to the choice prompt
    chooseOpt();
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
        //sql consult insert
        dbConnector.query(sqlInsert, [newDept], (err, res) => {
            if (err) throw err;
  
            //print the info tell the user 1 department was inserted
            console.log("New department successfully added!");
  
            //call the menu for show a question again
            chooseOpt();
        })
    })
};


// Function to delete department
function deleteDept() {
    sqlSelect = `SELECT id, name FROM department`;
    dbConnector.query(sqlSelect, []);
    deptArray = sqlSelect.map(elem => elem.name);
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
}


module.exports = { showDepts, addDept, deleteDept }