# Holistic Health Assessment Application (H2F)

<img
    src="https://img.shields.io/badge/JavaScript-FCC624?style=for-the-badge&logo=JavaScript&logoColor=black"
    alt="Website Badge" />
<img
    src="https://img.shields.io/badge/Node-339933?style=for-the-badge&logo=Node.JS&logoColor=black"
    alt="Website Badge" />
<img
    src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=nblack"
    alt="Website Badge" />
<img
    src="https://img.shields.io/badge/MySQL-00758f?style=for-the-badge&logo=MySQL&logoColor=black"
    alt="Website Badge" />

---
![H2F HOME PAGE](./public/images/home.png)
---

## Project Members
**Sponsor:** 
-  `CPT Brian Harder`

**Faculty Mentor:**
- `Dr. Subu Kandaswamy`

**H2F Members:**  
- `AbdulAziz Al-Dalaan`
- `Brendan Nelson`
- `Aaron Straka` 

---

## Description and Overview
Our sponsor, CPT Brian Harder of the Virginia Army National Guard, is charged with the administration of the Holistic Health and Fitness (H2F) Screening Assessment across Virginia. This comprehensive assessment is vital in ensuring that all soldiers maintain prime mental and physical health, providing them with tailored feedback to meet their diverse needs.

In our endeavor to aid CPT Harder and his staff, our team has crafted a web application that simplifies the entire process. The app facilitates the efficient assessment and tracking of soldiers' results on the Holistic Health and Fitness Screening Assessment. It enables soldiers to easily complete the assessment online, thus allowing CPT Harder's team to perform in-depth data analytics to pinpoint and assist those in need.

Leveraging the robustness of NodeJS and the reliability of MySQL databases, our technology stack is designed to consolidate assessment data into a single repository. Our goal is to empower our sponsor and his team to analyze the results effectively, gauge the wellness of soldiers in different units, and provide necessary aid wherever it's needed.

This application allows all soldiers to complete the assessment online and by default the application is loaded with the 3 main core assessments which are the Knowledge Check, Cognitive Performance, and Movement Screening. It also has higher privileges user types such as Unit Leaders and Administrators that can view the results of their unit and the entire state respectively. Administrators can also add, edit, and delete assessments. 

## Required Software Installation

### Prerequisites

NodeJS is a JavaScript runtime environment that executes JavaScript code outside of a browser. It is required to run the application. Our application was built with NodeJS version 20.5.1 hence we recommend the same or a newer version. You will also need to utilize the Node Package Manager (npm) to install the application's dependencies, however, this is included with NodeJS.

- [NodeJS](https://nodejs.org/en/)

MySQL is an open-source relational database management system. It is required to store the application's data. Our application was built with MySQL version 8.0.35 hence we recommend the same or a newer version.

- [MySQL](https://www.mysql.com/)

---

### Software Installation Guides

In regards to the installation of NodeJS and MySQL, we highly recommend following the installation guides provided below to start. These guides will walk you through the installation process step-by-step for each respective operating system.

---
### For Windows and Mac OS Users

#### NodeJS

1. Navigate to the [NodeJS Download Page](https://nodejs.org/en/download/) and download the appropriate installer for your operating system.
2. Run the installer and follow the provided installation guide here [NodeJS Installation Guide](https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac).
3. Verify that NodeJS was installed correctly by opening a Windows Powershell instance or the terminal on Mac and run `node -v` or `node --version`. You should see the version number of NodeJS printed to the terminal.

The same guide provided in step 2 also goes through details on how to change to the latest version of NodeJS if you already have it installed using nvm.

#### MySQL and MySQL Workbench

1. Navigate to the [MySQL Download Page](https://dev.mysql.com/downloads/installer/) and download the appropriate installer for your operating system.
2. Run the installer and follow the provided installation guide here [MySQL Installation Guide for Windows](https://www.freecodecamp.org/news/how-to-install-mysql-workbench-on-windows/) or [MySQL Installation Guide for Mac](https://www.youtube.com/watch?v=-wpzS5NcYT8).
3. Verify that MySQL was installed correctly by opening a terminal and running `mysql -V`. You should see the version number of MySQL printed to the terminal.

**IMPORTANT**: Make sure to remember the password you set for the root user during the installation process. You will need it later to setup the database.

---
### For (Ubuntu) Linux Users

#### NodeJS using Node Version Manager (nvm)
1. Open a terminal and run `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash` to install nvm.
2. The installation process from step 1 should also automatically add the nvm configuration to your profile. If you're using zsh, that would be `~/.zshrc`. If you're using bash, that would be `~/.bash_profile` ...or some other profile. If it doesn't automatically add nvm configuration, you can add it yourself to your profile file: 
```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```
3. Verify that nvm was installed correctly by opening a terminal and running `nvm --version`. You should see the version number of nvm printed to the terminal.
4. run `nvm install node` to install the latest version of NodeJS with npm.

#### MySQL and MySQL Workbench
1. Open a terminal and update the package index by running `sudo apt update`.
2. Following the installation guide for Linux here [MySQL Installation Guide for Linux](https://linuxhint.com/installing_mysql_workbench_ubuntu/).
3. Verify that MySQL was installed correctly by opening a terminal and running `mysql -V`. You should see the version number of MySQL printed to the terminal.

**IMPORTANT**: Make sure to remember the password you set for the root user during the installation process. You will need it later to setup the database.

### Troubleshooting

Generally, it is recommend to install NodeJS along with NPM via NVM on all OSs. Hence if you have issues on Windows or Mac OS, you can try to install NodeJS via NVM. This guide will walk you through the process: [NodeJS Installation Guide via NVM on All OSs](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/).


## Database Setup with MySQL CLI with Dump File

## Application Startup

### Startup via Github Clone

1. Clone the repository to your local machine by navigating to the [WSUCapstoneS2023/H2FSAT_APP](https://github.com/WSUCapstoneS2023/H2FSAT_APP) and clicking the green `Code` button. Copy the HTTPS link and run `git clone <HTTPS link>` in your terminal.
2. Open the project folder in VS Code or your preferred IDE make sure you are in the root directory of the project `H2FSAT_APP`
3. Open a terminal in your IDE and run `npm install` to install all dependencies
4. Run `npm start` or `nodemon` to start the server
5. Open your browser and navigate to `localhost:3000`
6. Refer to the [User Guide](path TO USER MANUEL AND INSTRUCTIONS) for instructions on how to use the application

### Startup via Zip Package (Artifact Submission skip step 1)

1. Download the zip package from the [WSUCapstoneS2023/H2FSAT_APP](https://github.com/WSUCapstoneS2023/H2FSAT_APP)
2. Extract the zip package to your local machine
3. Select the project folder and open it in VS Code or your preferred IDE make sure you are in the root directory of the project `H2FSAT_APP`
4. Open a terminal in your IDE and run `npm install` to install all dependencies
5. Run `npm start` or `nodemon` to start the server
6. Open your browser and navigate to `localhost:3000` 
7. Refer to the [User Guide](path TO USER MANUEL AND INSTRUCTIONS) for instructions on how to use the application

## Additional Resources

All project related documentation can be found here:

[WSU H2F Capstone Docs]() 
## Repository

You can find the source code and contribute to our project here:

[WSUCapstoneS2023/H2FSAT_APP](https://github.com/WSUCapstoneS2023/H2FSAT_APP)

---

We are committed to continuous improvement and are open to collaboration. 
