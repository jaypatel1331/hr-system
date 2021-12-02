const Sequelize = require('sequelize');

var sequelize = new Sequelize('d85e30o5q13tsf', 'xodxiqfsnytfrx', '43db4ce3b0f3fc9306de4b97f4c170d8c7e632d2fa085dd1c7db30fbbc5cacaf', {
    host: 'ec2-34-237-46-61.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

const Employee = sequelize.define('employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

const Department = sequelize.define('department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

Department.hasMany(Employee, { foreignKey: 'department' });

module.exports =
{
    initialize: function () {
        let promise = new Promise(function (resolve, reject) {
            sequelize.sync()
                .then(resolve('database synced'))
                .catch(reject('unable to sync the database'));
        });

        return promise;
    },

    getAllEmployees: function () {
        let promise = new Promise(function (resolve, reject) {
            sequelize.sync()
                .then(resolve(Employee.findAll()))
                .catch(reject('no results returned'));
        });

        return promise;
    },

    getDepartments: function () {
        let promise = new Promise(function (resolve, reject) {
            Department.findAll()
                .then(data => { resolve(data); })
                .catch(err => { reject(err); });
        });

        return promise;
    },

    addEmployee: function (employeeData) {
        let promise = new Promise(function (resolve, reject) {
            employeeData.isManager = employeeData.isManager ? true : false;
            for (var i in employeeData) {
                if (employeeData[i] == "") { employeeData[i] = null; }
            }

            Employee.create(employeeData)
                .then(resolve(Employee.findAll()))
                .catch(reject('unable to create employee'));
        });
        return promise;
    },

    getEmployeesByStatus: function (status) {
        let promise = new Promise(function (resolve, reject) {
            Employee.findAll({
                where: {
                    status: status
                }
            })
                .then(resolve(Employee.findAll({ where: { status: status } })))
                .catch(reject('no results returned'));
        });
        return promise;
    },

    getEmployeesByDepartment: function (department) {
        let promise = new Promise(function (resolve, reject) {
            Employee.findAll({
                where: {
                    department: department
                }
            })
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
        return promise;
    },

    getEmployeesByManager: function (manager) {
        let promise = new Promise(function (resolve, reject) {
            Employee.findAll({
                where: {
                    employeeManagerNum: manager
                }
            })
                .then(resolve(Employee.findAll({ where: { employeeManagerNum: manager } })))
                .catch(reject('no results returned'));
        });

        return promise;
    },

    getEmployeeByNum: function (num) {
        let promise = new Promise(function (resolve, reject) {
            Employee.findAll({
                where: {
                    employeeNum: num
                }
            })
                .then(data => resolve(data))
                .catch(reject('no results returned'));
        });

        return promise;
    },

    updateEmployee: function (employeeData) {
        let promise = new Promise(function (resolve, reject) {
            employeeData.isManager = (employeeData.isManager) ? true : false;

            for (var i in employeeData) {
                if (employeeData[i] == "") { employeeData[i] = null; }
            }

            sequelize.sync()
                .then(Employee.update(employeeData, {
                    where: {
                        employeeNum: employeeData.employeeNum
                    }
                }))
                .then(resolve(Employee.update(employeeData, { where: { employeeNum: employeeData.employeeNum } })))
                .catch(reject('unable to update employee'));
        });
        return promise;
    },

    addDepartment : function (departmentData) {
        let promise = new Promise(function (resolve,reject){
            for (var i in departmentData) {
                if (departmentData[i] == "") { departmentData[i] = null; }
            }
    
            Department.create(departmentData)
            .then(resolve(Department.findAll()))
            .catch(reject('unable to add department'));
        });
        return promise;

    },

    updateDepartment : function (departmentData){
        let promise = new Promise(function (resolve,reject){
            for (var i in departmentData) {
                if (departmentData[i] == "") { departmentData[i] = null; }
            }
    
            sequelize.sync()
            .then(Department.update(departmentData, {where: { 
                departmentId: departmentData.departmentId
            }}))
            .then(resolve(Department.update(departmentData, {where: { departmentId:departmentData.departmentId }})))
            .catch(reject('unable to update department'));
        });
        return promise;

    },

    getDepartmentById : function(id){
        let promise = new Promise(function(resolve,reject){
            Department.findAll({ 
                where: {
                    departmentId: id
                }
            })
            .then(resolve(Department.findAll({ where: { departmentId: id }})))
            .catch(reject('no results returned'));
        });
        return promise;
    },

    deleteDepartmentById : function(id){
        let promise = new Promise(function(resolve,reject){
            Department.destroy({ 
                where: {
                    departmentId: id
                }
            })
            .then(resolve(Department.destroy({ where: { departmentId: id }})))
            .catch(reject('no results returned'));
        });
        return promise;
    },

    deleteEmployeeByNum : function(num){
        let promise = new Promise((resolve,reject) => {
            Employee.destroy({
                where: {
                    employeeNum: num
                }
            })
            .then(resolve())
            .catch(reject('unable to delete employee'));
        });
        return promise;
    }
};