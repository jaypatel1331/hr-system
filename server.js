/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Jay Ashishbhai Patel
*  Student ID: 154925192
*  Date: 27 September 2021
*
*  Online (Heroku) Link: https://stark-harbor-91923.herokuapp.com/ 
*
********************************************************************************/

var data = require('./data-service.js');
var express = require("express");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;



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
    data.getAllEmployees()
    .then(function(data) 
    {
        res.json(data);
    })
    .catch(function(err) 
    {
        res.json({message: err});
    });
    
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


app.use(express.static('public'));


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