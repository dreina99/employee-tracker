const db = require('./db/connection');
const inquirer = require('inquirer');

const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'checkbox',
            name: 'next_step',
            message: 'What would you like to do?',
            choices: ['View departments', 'View roles', 'Quit'],
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

const viewDepartments = () => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        console.log(rows);
        init();
    });
}

const viewRoles = () => {
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
            return;
        }
        console.log(rows);
        init();
    });
}

function init() {
    /*// Start server after DB connection
    db.connect(err => {
        if (err) throw err;
        console.log('Database connected.');  
    });*/
    let answer; 
    promptUser()
    .then(dbCommand => {
        answer = dbCommand;

        if(answer.next_step[0] === 'Quit')
        {
            return;
        }
        else if(answer.next_step[0] === 'View departments')
        {
            viewDepartments();
        }
        else if(answer.next_step[0] === 'View roles')
        {
            viewRoles();
        }
    });
}

init();


