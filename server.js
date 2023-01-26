//Set up layout from module 12 lesson 21
const express = require('express');
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username, Enter Username to run. Will not run without
    user: 'root',
    // MySQL password, Enter Password here to run. Will not run without
    password: '',
    database: ''
  },
  runProgram()
);

//Welcome banner
function runProgram(){
    console.log(`--------------------------------------------------`);
    console.log(`-                                                -`);
    console.log(`-                                                -`);
    console.log(`-                                                -`);
    console.log(`-                                                -`);
    console.log(`-       Welcome to the Employee Tracker          -`);
    console.log(`-                                                -`);
    console.log(`-                                                -`);
    console.log(`-                                                -`);
    console.log(`-                                                -`);
    console.log(`--------------------------------------------------`);
    //Call PromptQuestions to display questions to screen
    promptQuestions();
}

// Use prompt method similar to module 9 lesson 19 &20
function promptQuestions(){
//Prompt questions to get what user would like to do
inquirer.prompt([
    {
        type: `list`,
        message: `What would you like to do?`,
        name: `option`,
        choices: [
            `View All Departments`,
            `View All Roles`,
            `View All Employees`,
            `Add A Department`,
            `Add A Role`,
            `Add An Employee`,
            `Update An Employee Role`,
            `Exit`
        ]
    }
])//Wait for response and call corresponding function based on selection
.then((response) => 
   {
    const choice = response.option;
        if(choice === `View All Departments`)
        {
            get_all_departments();
           
        }
        else if(choice === `View All Roles`)
        {
            get_all_roles();
        }
        else if(choice === `View All Employees`)
        {
            get_all_employees();
        }
        else if(choice === `Add A Department`)
        {
            put_department();
        }
        else if(choice === `Add A Role`)
        {
            put_role();
        }
        else if(choice === `Add An Employee`)
        {
            put_employee();
        }
        else if(choice === `Update An Employee Role`)
        {
            update_employee();
        }
        else
        {
            console.log(`Goodbye!`)
            db.end();
            return;
        }
       
   });


}
// Function to get all departments
function get_all_departments()
{
    // Query database to get department name and id
    db.query(`SELECT a.department_name,
                     a.id as department_id
                    FROM department a;`, function (err, results) {
    console.log(results);
    });
    //Prompt questions again
     promptQuestions();

}

// Function to get all roles
function get_all_roles()
{
    // Query database for title, id, department name, and salary
    db.query(`SELECT a.title,
                     a.id as role_id,
                     b.department_name AS department,
                     a.salary 
                     FROM role_employee a 
                     INNER JOIN department b 
                     ON a.department_id = b.id;`, function (err, results) {
    console.log(results);
    });
    //Prompt questions again
     promptQuestions();

}

// Function to get all employees
function get_all_employees()
{
    // Query database for id, first name, last name, title, department name, salary, and manager
    db.query(`SELECT a.id,
                     a.first_name,
                     a.last_name,
                     b.title as job_title,
                     c.department_name,
                     b.salary,
                     a.manager_id
                     FROM employee a, role_employee b, department c
                     WHERE c.id = b.department_id 
                     AND b.id = a.role_id
                     Order By a.id ASC;`, function (err, results) {
    console.log(results);
    });
    //Prompt questions again
     promptQuestions();

}
//Function to add a new department
function put_department(){
    //Prompt for name of new department
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?',
        },
    ])
    .then((data) => {
        const new_department = data.department;
    // Query database to insert new department
    db.query(`INSERT 
              INTO department (department_name)
              VALUES ("${new_department}");`, function (err, results) {
    console.log(`Department was successfully added`);
    //Prompt get all departments to see added department
    get_all_departments();
    });

    })


    
}

//Function to add a new role
function put_role(){
    //Arrays to hold deparment names and their ids
    let department_array = [];
    let department_id_array = [];
    //Query all from department and push elements into arrays
    db.query(`SELECT *
              FROM department
              ORDER BY id ASC;`, function (err, results) {
    results.forEach((department) => {department_array.push(department.department_name);});
    results.forEach((department) => {department_id_array.push(department.id);});
    });
    //Prompt for information on new role and use department array to show lists of avaialable departments
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the role?',
        },
        {
            type: 'input',
            name: 'pay',
            message: 'What is the salary of the role?',
        },
        {
            type: 'list',
            name: 'department',
            message: 'What department is the role in?',
            choices: department_array,
        },
    ])
    .then((data) => {
        //Convert to make it easier to input
        const new_name = data.name;
        const new_pay = data.pay;
        const department_position = department_array.indexOf(data.department);
        const department_id_position = department_id_array[department_position];
        const new_department = department_id_position;
    // Query database to insert new role
    db.query(`INSERT 
              INTO role_employee (title, salary, department_id)
              VALUES ("${new_name}", ${new_pay}, ${new_department});`, function (err, results) {
    console.log(`Role was successfully added`);
    //Prompt get all roles to see added department
    get_all_roles();
    });

    })
    
}

//Function to add a new employee
function put_employee(){
    //Arrays to hold role names and their ids
    let role_array = [];
    let role_id_array = [];

    db.query(`SELECT *
              FROM role_employee
              ORDER BY id ASC;`, function (err, results) {
    results.forEach((role) => {role_array.push(role.title);});
    results.forEach((role) => {role_id_array.push(role.id);});
    });
    //Arrays to hold manager names and their ids
    let manager_array = [];
    let manager_id_array = [];

    db.query(`SELECT *
              FROM employee
              ORDER BY id ASC;`, function (err, results) {
    results.forEach((manager) => {manager_array.push(manager.first_name);});
    results.forEach((manager) => {manager_id_array.push(manager.id);});
    });
    //Prompt for information on new employee and use arrays to show lists of  roles and managers
    inquirer.prompt([
        {
            type: 'input',
            name: 'fname',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'lname',
            message: 'What is the last name of the employee?',
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is the role of the employee?',
            choices: role_array,
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the manager of the employee?',
            choices: manager_array,
        },
    ])
    //Convert to make it easier to input
    .then((data) => {
        const new_first = data.fname;
        const new_last = data.lname;
        const role_position = role_array.indexOf(data.role);
        const role_id_position = role_id_array[role_position];
        const new_role = role_id_position;
        const manager_position = manager_array.indexOf(data.manager);
        const manager_id_position = manager_id_array[manager_position];
        const new_manager = manager_id_position;
    // Query database to insert new employee
    db.query(`INSERT 
              INTO employee (first_name, last_name, role_id, manager_id)
              VALUES ("${new_first}", "${new_last}", ${new_role}, ${new_manager});`, function (err, results) {
    console.log(`Employee was successfully added`);
    //Prompt get all employees to see added employee
    get_all_employees();
    });

    })
    
}




//function to update employee information
function update_employee(){
    //Arrays to hold employee names and their ids
    let employee_array = [];
    let employee_id_array = [];

    db.query(`SELECT *
              FROM employee
              ORDER BY id ASC;`, function (err, results) {
    results.forEach((employee) => { employee_array.push(employee.first_name);});
    results.forEach((employee) => {employee_id_array.push(employee.id);});
    });
    
  
    //Arrays to hold role names and their ids
    let role_array = [];
    let role_id_array = [];

    db.query(`SELECT *
              FROM role_employee
              ORDER BY id ASC;`, function (err, results) {
    results.forEach((role) => {role_array.push(role.title);});
    results.forEach((role) => {role_id_array.push(role.id);});
    });
    //Arrays to hold manager names and their ids
    let manager_array = [];
    let manager_id_array = [];

    db.query(`SELECT *
              FROM employee
              ORDER BY id ASC;`, function (err, results) {
    results.forEach((manager) => {manager_array.push(manager.first_name);});
    results.forEach((manager) => {manager_id_array.push(manager.id);});
    });
    //Prompt for information to update employee and use arrays to show lists of which employee, what role, and who manager is
    inquirer.prompt([
        {
            type: 'input',
            name: 'random',
            message: 'Press Enter to continue...',
        },
        {
            type: 'list',
            name: 'employee',
            message: 'What employee would you like to update?',
            choices: employee_array,
        },
        {
            type: 'list',
            name: 'role',
            message: 'What role will employee have?',
            choices: role_array,
        },
        {
            type: 'list',
            name: 'manager',
            message: 'What manager will employee have?',
            choices: manager_array,
        },
    ])
    //Convert to make it easier to input
    .then((data) => {
        const employee_position = employee_array.indexOf(data.employee);
        const employee_id_position = employee_id_array[employee_position];
        const new_employee = employee_id_position;
        const role_position = role_array.indexOf(data.role);
        const role_id_position = role_id_array[role_position];
        const new_role = role_id_position;
        const manager_position = manager_array.indexOf(data.manager);
        const manager_id_position = manager_id_array[manager_position];
        const new_manager = manager_id_position;
    // Query database to update employee
    db.query(`UPDATE employee 
              SET role_id = ${new_role}, manager_id = ${new_manager}
              WHERE id = ${new_employee};`, function (err, results) {
    console.log(`Employee was successfully updated`);
    //Prompt get all employees to see updated employee
    get_all_employees();
    });

    })



}



// Default response for any other request (Not Found) skeleton from module
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



