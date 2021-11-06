var fs = require('fs');

var employees = [];
var departments = [];


module.exports =
{
    initialize: function () {
        let promise = new Promise(function (resolve, reject) {
            fs.readFile('./data/employees.json', 'utf8', (err, data) => {
                if (err) {
                    reject("Error! unable to load file 'Employees.json'.");
                }
                else {
                    employees = JSON.parse(data);
                    console.log("Succuss! employees.json loaded!");

                    fs.readFile('./data/departments.json', 'utf8', (err, data) => {
                        if (err) {
                            reject("Error! unable to load file 'Departments.json'.");
                        }
                        else {
                            departments = JSON.parse(data);
                            console.log("Succuss! departments.json loaded!");
                            resolve('Server initialization successful!');
                        }
                    });
                }
            });
        });

        return promise;
    },

    getAllEmployees: function () {
        let promise = new Promise(function (resolve, reject) {
            if (employees.length > 0) {
                resolve(employees);
            }
            else {
                reject('No results returned!');
            }
        });

        return promise;
    },

    getManagers: function () {
        let managers = [];
        let promise = new Promise(function (resolve, reject) {
            for (let j = 0; j < employees.length; j++) {
                if (employees[j].isManager == true) {
                    managers.push(employees[j]);

                    if (managers.length > 0) {
                        resolve(managers);
                    }
                    else {
                        reject("No results returned!");
                    }
                }
            }
        });

        return promise;
    },

    getDepartments: function () {
        let promise = new Promise(function (resolve, reject) {
            if (departments.length > 0) {
                resolve(departments);
            }
            else {
                reject("No results returned");
            }
        });

        return promise;
    },

    addEmployee: function (employeeData) {
        let promise = new Promise(function (resolve, reject) {
            if (!employeeData.isManager) {
                employeeData.isManager = false;
            }

            employeeData.employeeNum = employees.length + 1;
            employees.push(employeeData);
            resolve("Employee data is added.");
        });
        return promise;
    },

    getEmployeesByStatus: function (status) {
        let promise = new Promise(function (resolve, reject) {
            status = status.toLowerCase();
            if (status == "full time" || status == "part time") {
                let empStatus = [];
                let employeeData = "status";

                for (let i = 0; i < employees.length; i++) {
                    if (employees[i][employeeData].toLowerCase() == status) {
                        empStatus.push(employees[i]);
                    }
                }

                if (empStatus.length > 0) {
                    resolve(empStatus);
                }
                else {
                    reject("no results returned");
                }
            }
            else {
                reject("Status entered \"" + status + "\"is not available");
            }
        });
        return promise;
    },

    getEmployeesByDepartment: function (department) {
        let promise = new Promise(function (resolve, reject) {
            if (0 < department && department <= 7) {
                let empDepartment = [];
                let employeeData = "department";

                for (let i = 0; i < employees.length; i++) {
                    if (employees[i][employeeData] == department) {
                        empDepartment.push(employees[i]);
                    }
                }

                if (empDepartment.length > 0) {
                    resolve(empDepartment);
                }
                else {
                    reject("no results returned");
                }
            }
            else {
                reject("Department number " + department + " entered does not exist !");
            }
        });
        return promise;
    },

    getEmployeesByManager: function (manager) {
        let promise = new Promise(function (resolve, reject) {
            if (1 <= manager && manager <= 31) {
                let empManager = [];
                let employeeData = "employeeManagerNum";

                for (let i = 0; i < employees.length; i++) {
                    if (employees[i][employeeData] == manager) {
                        empManager.push(employees[i]);
                    }
                }

                if (empManager.length > 0) {
                    resolve(empManager);
                } else {
                    reject("no results returned");
                }
            } else {
                reject("Manager number " + manager + " entered does not exist!");
            }
        });

        return promise;
    },

    getEmployeeByNum: function (num) {
        let promise = new Promise(function (resolve, reject) {
            for (let i = 0; i < employees.length; i++) {
                if (employees[i].employeeNum == num) {
                    resolve(employees[i]);
                }
            }
            reject("Employee " + num + " was not found!");
        });

        return promise;
    },

    updateEmployee: function(employeeData) {
        let promise = new Promise(function(resolve, reject) { 
            for (let i = 0; i < employees.length; ++i) {
                if (employees[i].employeeNum == employeeData.employeeNum) 
                {
                    let newArray = Object.keys(employees[i]);
                    for (let j = 0; j < newArray.length; ++j)
                    { 
                        employees[i][newArray[j]] = employeeData[newArray[j]];
                    }
                    resolve();
                }                    
            }
            reject("/unable to update the employee. Please try again!!");
        });

        return promise;
    }

};