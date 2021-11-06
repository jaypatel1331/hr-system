/*********************************************************************************
*  WEB322 – Assignment 03
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
            .catch((err) => res.render('employees', { message: err }));

    } else if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department)
            .then((value) => res.render('employees', { employees: value }))
            .catch((err) => res.render('employees', { message: err }));

    } else if (req.query.manager) {
        data.getEmployeesByManager(req.query.manager)
            .then((value) => res.render('employees', { employees: value }))
            .catch((err) => res.render('employees', { message: err }));
    }

    else {
        data.getAllEmployees()
            .then((value) => res.render('employees', { employees: value }))
            .catch((err) => res.render('employees', { message: err }));
    }
});

app.get("/employees/add", function (req, res) {
    res.render('addEmployee');
});

app.post("/employees/add", function (req, res) {
    data.addEmployee(req.body)
        .then(res.redirect('/employees'));
});

app.get("/employees/:employeeNum", function(req,res) {
    if (isNaN(req.params.employeeNum)) {
        res.redirect("/employees");    
    } else {
        data.getEmployeeByNum(req.params.employeeNum)
        .then(function(value) {
            res.render('employee', {employee: value});
        })
        .catch(function(err) {
            res.render('employee', {message: err});
        });
    }
});

app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body).then(res.redirect("/employees"));
});


app.get("/departments", function (req, res) {
    data.getDepartments()
        .then(function (value) {
            res.render('departments', { departments: value });
        })
        .catch(function (err) {
            res.render('departments', { message: err });
        });
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
