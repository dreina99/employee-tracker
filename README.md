# Employee Tracker
  ## Description  
  This project uses MySQL to create an employee tracking app. It allows you to add/view departments, roles and employees as well as update the role of an employee. The application runs through the npm inquirer module and used the console.table module to format the data neatly after each query. Since this app uses inquirer, all functionality is operates through the console.    
   

  ## Table of Contents
  - [Installation](#installation)
  - [Usage](#usage)
  - [License](#license)
  - [Contributing](#contributing)
  - [Tests](#tests)
  - [Questions](#questions)

  ## Installation
  First clone the repository locally on your machine. Then make sure you have the required modules installed including node.js, inquirer, and console.table. You also need to have a MySQL account with a user name and password. This is important to get the databases up and running. In ./db/connection.js replace 'user' with your MySQL username and add you password to the empty string right below the user property. Then navigate to the directory where you cloned the repo in your terminal and run 'mysql -u root -p' and enter your password. Add the three commands 'source db/db.sql', 'source db/schema.sql', and 'source seeds.sql' in that order to create the tables and seed the data. Finally from git bash type the command 'node index.js' to start the application. 

  
  ## Usage
  The UI for inquirer is somewhat straightforward. Simply answer the prompts and validation should ensure correct inputs. When you are finished with the application select the Quit checkbox and enter Ctrl + C to terminate the program.

  
  ## License: None

  
  ## How to Contribute
  If you would like to contribute, fork the repository and attempt to push your changes. I will review them and add to the repo as I see fit.

  
  ## Tests
  At the moment there is no testing software implemented.

  
  ## Questions
  Links below are to my GitHub profile and email.
  Feel free to contact me with any questions you may have about the application  
  GitHub: [dreina99](https://www.github.com/dreina99)  
  Email: [devinreina99@gmail.com](mailto:devinreina99@gmail.com)
