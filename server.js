/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Jay Ashishbhai Patel
*  Student ID: 154925192
*  Date: 15 October 2021
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
var HTTP_PORT = process.env.PORT || 8080;


app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb)
    {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.get("/", function(req, res)
{
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.get("/about", function(req, res)
{
    res.sendFile(path.join(__dirname,"/views/about.html"));
});

app.get("/employees", function(req,res)
 {
    if(req.query.status)
    {
        data.getEmployeesByStatus(req.query.status)
        .then(function(value) 
        {
            res.json(value);
        })
        .catch(function(err) 
        {
            res.json({message : err});
        });
    }
    else if(req.query.department)
    {
        data.getEmployeesByDepartment(req.query.department)
        .then(function(value)
        {
            res.json(value);
        })
        .catch(function(err)
        {
            res.json({message : err});
        });
    }
    else if(req.query.manager)
    {
        data.getEmployeesByManager(req.query.manager)
        .then(function(value)
        {
            res.json(value);
        })
        .catch(function(err)
        {
            res.json({message : err});
        });
    }
    else
    {
    data.getAllEmployees()
    .then(function(data) 
    {
        res.json(data);
    })
    .catch(function(err) 
    {
        res.json({message: err});
    });
}
});

app.get("/employees/add", function(req, res)
{
    res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

app.post("/employees/add", function(req,res)
{
    data.addEmployee(req.body)
    .then(res.redirect('/employees'));
});

app.get('/employees/:employeeNum',function(req, res){
    if(isNaN(req.params.employeeNum))
    {
        res.redirect("/employees");
    }
    else
    {
        data.getEmployeeByNum(req.params.employeeNum)
        .then(function(value)
        {
            res.json(value);
        })
        .catch(function(err) 
        {
            res.json({message : err});            
        });
    }
});

app.get("/managers", function(req,res) 
{
    data.getManagers()
    .then(function(data) 
    {
        res.json(data);
    })
    .catch(function(err) 
    {
        res.json({message: err});
    });
});

app.get("/departments", function(req,res) 
{
    data.getDepartments()
    .then(function(data) 
    {
        res.json(data);
    })
    .catch(function(err) 
    {
        res.json({message: err});
    });
});

app.get("/images/add", function(req,res) 
{
    res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), function(req, res) 
{
    res.redirect('/images');
});

app.get("/images", function(req,res) 
{
    fs.readdir(path.join(__dirname,"/public/images/uploaded"), 
    function(err, items) 
    {
        if (items.length > 0) 
        {
            res.json({images : items});
        } 
        else 
        {
            res.json({message : "There is currently no images"});
        }
    });
});

app.use(function(req,res,next) 
{
    res.status(404).send('Page not found, Error: 404');
});

data.initialize()
.then(function(message)
{
    console.log(message);
    app.listen(HTTP_PORT);
})
.catch(function(err) 
{
    console.log(err);
});
