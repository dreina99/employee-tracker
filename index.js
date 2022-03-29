const cTable = require('console.table')
const db = require('./db/connection');
const inquirer = require('inquirer');
const { restoreDefaultPrompts } = require('inquirer');

const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'checkbox',
            name: 'next_step',
            message: 'What would you like to do?',
            choices: ['View departments', 'View roles', 'View employees', 'Add a department', 'Add an employee',
                       'Add a role', 'Quit'],
            validate: list => {
                if(list.length)
                    return true;
                else {
                    console.log("Please pick one of the values");
                    return false;
                }
            }
        }
    ]);
}

// queries all data from departments db
const viewDepartments = () => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        console.table(rows);
        init();
    });
}

// queries all data from roles db
// left joins to show the department 
// each role belongs to
const viewRoles = () => {
    const sql = `SELECT roles.*, departments.name
                AS department_name
                FROM roles
                LEFT JOIN departments
                ON roles.department_id = departments.id`;
    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        console.table(rows);
        init();
    });
}

// queries all data from employee db
// left joins with roles to display
// role and salary of each employee
const viewEmployees = () => {
    const sql = `SELECT employee.*, roles.title as role_title, roles.salary as role_salary FROM employee
                 LEFT JOIN roles
                 ON employee.role_id = roles.id`;
    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        console.table(rows);
        // call init from inside query to prevent async behavior
        init();
    });
}

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of your department:',
            validate: answer => {
                if(!answer) {
                    console.log('Please add a department name');
                    return false;
                }
                return true;
            }
        }
    ])
    .then(answer => {
        //console.log(answer);
        const sql = `INSERT INTO departments(name)
                     VALUES (?)`;
        const params = answer.departmentName.toLowerCase();
        db.query(sql, params, err => {
            if(err) {
                console.log(err);
                return;
            }
            else console.log('Data inputted successfully');
            init();
        });    
    });
}

// adds a role to the role table based on user data
const addRole = () => {
    let depID;
    let dbData;

    // retrieve departments information for foreign 
    // key input and validation
    db.query(`SELECT * FROM departments`, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        dbData = rows;
    });
    inquirer.prompt([
        {
            type: 'input',
            name: 'role_title',
            message: 'Enter the role title:',
            validate: answer => {
                if(!answer) {
                    console.log('Please add a title');
                    return false;
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'role_salary',
            message: "Enter the role's salary:",
            validate: answer => {
                if(!answer) {
                    console.log('Please add a salary');
                    return false;
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'role_department',
            message: "Enter the role's department:",
            // compare user answer to the current names in department table
            validate: answer => {
                answer = answer.toLowerCase();
                for(let i = 0; i < dbData.length; i++) {
                    if(answer === dbData[i].name) return true;
                }
                return '\nPlease make sure the department exists and there are no typos.';
            }
        }
    ])
    .then(answerList => {
        // find department id for the user inputted department name
        for(let i = 0; i < dbData.length; i++) 
        {
            if(dbData[i].name === answerList.role_department)
            {
                depID = i + 1;
            }
        }

        // sql query
        const sql = `INSERT INTO roles(title, salary, department_id)
                     VALUES (?, ?, ?)`;
        const params = [answerList.role_title, answerList.role_salary, depID];

        db.query(sql, params, err => {
            if(err) {
                console.log(err);
                return;
            }
            console.log('Data inputted successfully');
            init();
        })   
    });
}

const addEmployee = () => {
    let dbRoleData;
    let dbEmpData;

    db.query(`SELECT * FROM roles`, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        dbRoleData = rows;
    });

    db.query(`SELECT * FROM employee`, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        dbEmpData = rows;
    });

    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Enter the employee's first name:",
            validate: answer => {
                if(!answer) {
                    console.log('Please add a name');
                    return false;
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Enter the employee's last name:",
            validate: answer => {
                if(!answer) {
                    console.log('Please add a last name');
                    return false;
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'roleName',
            message: "Enter the employee's role:",
            validate: answer => {
                for(let i = 0; i < dbRoleData.length; i++) {
                    if(answer === dbRoleData[i].title) return true;
                }
                return '\nPlease make sure the role exists, there are no typos, and the first letter of each word is capitalized.';
            }
        },
        {
            type: 'input',
            name: 'empManager',
            message: "Enter the first and last name of the employee's manager, if they do not have one type NULL:",
            validate: answer => {
                const nameArr = answer.split(" ");
                //console.log(nameArr);
                for(let i = 0; i < dbEmpData.length; i++) {
                    if(answer === 'NULL' || (nameArr[0] === dbEmpData[i].first_name && nameArr[1] === dbEmpData[i].last_name)) return true;
                }
                return '\nPlease make sure the manager exists, there are no typos, and the first letter of each word is capitalized.';
            }
        }
    ])
    .then(empData => {
        //console.log(empData);

        // find role id for the user inputted role name
        for(let i = 0; i < dbRoleData.length; i++) 
        {
            if(dbRoleData[i].title === empData.roleName)
            {
                roleID = i + 1;
            }
        }
        //console.log(roleID);

        // split name of user inputted manager
        managerNameArr = empData.empManager.split(" ");

        // match first and last name to row in employee table
        for(let i = 0; i < dbEmpData.length; i++) 
        {
            if(managerNameArr[0] === dbEmpData[i].first_name && managerNameArr[1] === dbEmpData[i].last_name)
            {
                managerID = dbEmpData[i].id;
            }
        }

        // special case where input is NULL as a string
        if(empData.empManager === 'NULL')
        {
            managerID = null;
        }
        //console.log(managerID);

        // sql query
        const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                     VALUES (?, ?, ?, ?)`;
        const params = [empData.firstName, empData.lastName, roleID, managerID];

        db.query(sql, params, err => {
            if(err) {
                console.log(err);
                return;
            }
            console.log('Data inputted successfully');
            init();
        });
    });
}

function init() {
    let answer; 

    // initial inquirer prompt
    promptUser()
    .then(dbCommand => {
        answer = dbCommand;

        if(answer.next_step[0] === 'Quit')
        {
            console.log('Bye!');
        }
        else if(answer.next_step[0] === 'View departments')
        {
            viewDepartments();
        }
        else if(answer.next_step[0] === 'View employees')
        {
            viewEmployees();
        }
        else if(answer.next_step[0] === 'View roles')
        {
            viewRoles();
        }
        else if(answer.next_step[0] === 'Add a department')
        {
            addDepartment();
        }
        else if(answer.next_step[0] === 'Add a role')
        {
            addRole();
        }
        else if(answer.next_step[0] === 'Add an employee')
        {
            addEmployee();
        }
    });
}

init();