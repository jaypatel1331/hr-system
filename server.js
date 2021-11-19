/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Jay Ashishbhai Patel
*  Student ID: 154925192
*  Date: 05 November 2021
*
*  Online (Heroku) Link: https://stark-harbor-91923.herokuapp.com/ 
*
********************************************************************************/

var data = require('./data-service.js');
var express = require("express");
var multer = require("multer");
var bodyParser = require("body-parser");
var fs = require('fs');
var app = express();
var path = require("path");
const exphbs = require('express-handlebars');

var HTTP_PORT = process.env.PORT || 8080;


app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.set('view engine', '.hbs');

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

const upload = multer({ storage: storage });

app.get("/", function (req, res) {
    res.render('home');
});

app.get("/about", function (req, res) {
    res.render('about');
});

app.get("/employees", function (req, res) {
    if (req.query.status) {
        data.getEmployeesByStatus(req.query.status)
            .then((value) => res.render('employees', { employees: value }))
            .catch(err => res.status(404).send('no results'));

    } else if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department)
            .then((value) => res.render('employees', { employees: value }))
            .catch(err => res.status(404).send('no results'));

    } else if (req.query.manager) {
        data.getEmployeesByManager(req.query.manager)
            .then((value) => res.render('employees', { employees: value }))
            .catch(err => res.status(404).send('no results'));
    }
    else {
        data.getAllEmployees()
            .then(value => res.render("employees", { employees: value }))
            .catch(err => res.status(404).send('no results'));
    }
});

app.get("/employees/add", function (req, res) {
    data.getDepartments()
        .then(data => res.render("addEmployee", { departments: data }))
        .catch(err => res.render("addEmployee", { departments: [] }));
});


app.post("/employees/add", function (req, res) {
    data.addEmployee(req.body)
        .then(res.redirect('/employees'));
});

app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    data.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(data.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});

app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body).then(res.redirect("/employees"));
});

app.get('/employees/delete/:value', (req, res) => {
    data.deleteEmployeeByNum(req.params.value)
        .then(res.redirect("/employees"))
        .catch(err => res.status(500).send("Unable to Remove Employee / Employee not found"));
});

app.get("/departments", function (req, res) {
    data.getDepartments()
        .then(function (value) {
            res.render('departments', { departments: value });
        })
        .catch(err => res.status(404).send('no results'));
});

app.get("/departments/add", (req, res) => {
    res.render(path.join(__dirname + "/views/addDepartment.hbs"));
});

app.post("/departments/add", (req, res) => {
    data.addDepartment(req.body).then(() => {
        res.redirect("/departments");
    })
});

app.post("/department/update", (req, res) => {
    data.updateDepartment(req.body).then(() => {
        res.redirect("/departments");
    })
});

app.get("/department/:departmentId", (req, res) => {
    data.getDepartmentById(req.params.departmentId)
        .then((data) => { res.render("department", { department: data }) })
        .catch(err => res.status(404).send("department not found"))
});

app.get('/departments/delete/:departmentId', (req, res) => {
    data.deleteDepartmentById(req.params.departmentId)
        .then(res.redirect("/departments"))
        .catch(err => res.status(500).send("Unable to Remove Department / Department not found"))
});

app.get("/images/add", function (req, res) {
    res.render('addImage');
});

app.post("/images/add", upload.single("imageFile"), function (req, res) {
    res.redirect('/images');
});

app.get("/images", function (req, res) {
    fs.readdir(path.join(__dirname, "/public/images/uploaded"),
        function (err, items) {
            res.render('images', { images: items });
        });
});

app.use(function (req, res, next) {
    res.status(404).send('Page not found, Error: 404');
});

data.initialize()
    .then(function (message) {
        console.log(message);
        app.listen(HTTP_PORT);
    })
    .catch(function (err) {
        console.log(err);
    });
