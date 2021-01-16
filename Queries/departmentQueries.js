// Dependency
const cTable = require('console.table');
const inquirer = require('inquirer');

// Imports
const dbConnector = require('../index');
const chooseOpt = require('../app');
console.log(chooseOpt)
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


module.exports = { showDepts, addDept, deleteDept }