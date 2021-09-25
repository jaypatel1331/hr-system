var fs = require('fs');

var employees = [];
var departments = [];


module.exports = {

    initialize: function() 
    {
        let promise = new Promise(function(resolve, reject) 
        {
            fs.readFile('./data/employees.json','utf8',(err,data) => 
            {
                if (err) 
                {
                    reject("Error! employees.json could not be loaded!");
                }
                 else 
                {
                    employees = JSON.parse(data);
                    console.log("Succuss! employees.json loaded!");

                    fs.readFile('./data/departments.json','utf8',(err,data) => 
                    {
                        if (err) 
                        {
                            reject("Error! departments.json could not be loaded!");
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
};
