var fs = require('fs');
const { resolve } = require('path');
const { addEmployee } = require('../../../../example/WEb/WEB322-assignment3-master/WEB322-assignment3-master/data-service');

var employees = [];
var departments = [];


module.exports = 
{
    initialize: function() 
    {
        let promise = new Promise(function(resolve, reject) 
        {
            fs.readFile('./data/employees.json','utf8',(err,data) => 
            {
                if (err) 
                {
                    reject("Error! unable to load file 'Employees.json'.");
                }
                 else 
                {
                    employees = JSON.parse(data);
                    console.log("Succuss! employees.json loaded!");

                    fs.readFile('./data/departments.json','utf8',(err,data) => 
                    {
                        if (err) 
                        {
                            reject("Error! unable to load file 'Departments.json'.");
                        } 
                        else
                        {
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

    getAllEmployees: function() 
    {
        let promise = new Promise(function(resolve,reject) 
        {
            if (employees.length > 0) 
            {
                resolve(employees);
            } 
            else
            {
                reject('No results returned!');
            }
        });
        
        return promise;
    },
    
    getManagers: function() 
    {
        let managers = []; 
        let promise = new Promise(function(resolve, reject) 
        {
            for (let j = 0; j < employees.length; j++) 
            {
                if (employees[j].isManager == true)
                {
                    managers.push(employees[j]);

                if (managers.length > 0) 
                {
                    resolve(managers);
                }
                 else
                 {
                    reject("No results returned!");
                }
                }
            }
        });

        return promise;
    },
    
    getDepartments: function() 
    {
        let promise = new Promise(function(resolve,reject) 
        {
            if (departments.length > 0) 
            {
                resolve(departments);
            } 
            else 
            {
                reject("No results returned");
            }
        });

        return promise;
    },

    addEmployee: function(employeeData)
    {
        let promise = new Promise(function(resolve,reject)
        {
            if(!employeeData.isManager)
            {
                employeeData.isManager = false;
            }
            employeeData.employeeNum = employees.length +1;
            employees.push(employeeData);
            resolve("Employee data is added.");
        });
        return promise;
    },

    getEmployeesByStatus: function(status)
    {
        let promise = new Promise(function(resovle, reject)
        {
            status = status.toLowerCase();
            if(status == "full time" || status == "part time")
            {
                let empStatus = [];
                let value = "status";
    
                for (let i = 0; i < employees.length; i++) 
                {
                    if (employees[i][value].toLowerCase() == status)
                    {
                        empStatus.push(employees[i]);
                    }
                }

                if(empStatus.length > 0)
                {
                    resolve(empStatus);
                }
                else
                {
                    reject("no results returned");
                }
            }
            else
            {
                reject("Status entered \"" + status + "\"is not available");
            }
        });
        return promise;
    },

    getEmployeesByDepartment: function(department)
    {
        let promise = new Promise(function(resovle, reject)
        {   
            if(department > 0 && department <= 7)
            {

                let empDepartment = [];
                let value = "department";
    
                for (let i = 0; i < employees.length; i++) 
                {
                    if (employees[i][value] == department)
                    {
                        empDepartment.push(employees[i]);
                    }
                }

                if(empDepartment.length > 0)
                {
                    resolve(empDepartment);
                }
                else
                {
                    reject("no results returned");
                }
            }
            else
            {
                reject("Department number " + department + " entered does not exist !");
            }
        });
        return promise;
    },

    getEmployeesByManager: function(manager) 
    {
        let promise = new Promise(function(resolve, reject) 
        {
            if (1 <= manager && manager <= 31) 
            {
                let empManager = [];
                let value = "employeeManagerNum";

                for (let i = 0; i < employees.length; i++) 
                {
                    if (employees[i][value] == manager)
                    {
                        empManager.push(employees[i]);
                    }
                }

                if (empManager.length > 0) 
                {
                    resolve(empManager);
                } else 
                {
                    reject("no results returned");
                }
            } else 
            {
                reject("Manager number " + manager + " entered does not exist!");
            }
        });

        return promise;
    },

    getEmployeesByNum: function(num) 
    {
        let promise = new Promise(function(resolve, reject) 
        {
            for (let i = 0; i < employees.length; i++) 
            {
                if (employees[i].employeeNum == num) 
                {
                    resolve(employees[i]);
                }
            }
            reject("Employee " + num + " was not found!");
        });

        return promise;
    }

};