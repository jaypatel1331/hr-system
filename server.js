var data = require('./data-service.js')
var express = require("express");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));


app.get("/", function(request, response){
    response.sendFile(path.join(__dirname,"/views/home.html"));
});


app.get("/about", function(request, response){
    response.sendFile(path.join(__dirname,"/views/about.html"));
});


app.get("/employees", function(request,response) {
    data.getEmployees()
    .then(function(value) {
        response.json(value);
    })
    .catch(function(error) {
        response.json({message: error});
    });
    
});


app.get("/managers", function(request,response) {
    data.getManagers()
    .then(function(value) {
        response.json(value);
    })
    .catch(function(error) {
        response.json({message: error});
    });
});


app.get("/departments", function(request,response) {
    data.getDepartments()
    .then(function(value) {
        response.json(value);
    })
    .catch(function(error) {
        response.json({message: error});
    });
});


app.use(function(request,response,next) {
    response.status(404).send('Page not found, yo. 404');
});


data.initialize()
.then(function(message) {
    console.log(message);
    app.listen(HTTP_PORT);
})
.catch(function(error) {
    console.log(error);
});