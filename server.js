/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
*  (including 3rd party web sites) or distributed to other students.
*
*  Name: Jay Ashishbhai Patel
*  Student ID: 154925192
*  Date: 24 September 2021
*
*  Online (Heroku) Link: https://stark-harbor-91923.herokuapp.com/ 
*
********************************************************************************/

var data = require('./data-service.js')
var express = require("express");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;



app.get("/", function(request, response)
{
    response.sendFile(path.join(__dirname,"/views/home.html"));
});


app.get("/about", function(request, response)
{
    response.sendFile(path.join(__dirname,"/views/about.html"));
});


app.get("/employees", function(request,response)
 {
    data.getAllEmployees()
    .then(function(data) 
    {
        response.json(data);
    })
    .catch(function(err) 
    {
        response.json({message: err});
    });
    
});

app.get("/managers", function(request,response) 
{
    data.getManagers()
    .then(function(data) 
    {
        response.json(data);
    })
    .catch(function(err) 
    {
        response.json({message: err});
    });
});


app.get("/departments", function(request,response) 
{
    data.getDepartments()
    .then(function(data) 
    {
        response.json(data);
    })
    .catch(function(err) 
    {
        response.json({message: err});
    });
});


app.use(express.static('public'));


app.use(function(request,response,next) 
{
    response.status(404).send('Page not found, yo. 404');
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