var express = require("express");
var app = express();

var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;5

// function wil be called after the start of http server for listening for requests
function onHttpStart(){
    console.log("Express http server listening on port" + HTTP_PORT);
}

// setup root to listen on the default url part 
app.get("/", function(request, response){
    response.sendFile(path.join(__dirname,"/views/home.html"));
});

// set up another route for the about page
app.get("/about", function(request, response){
    // response.send("<h3> About </h3>");

    response.sendFile(path.join(__dirname,"/views/about.html"));
});

//set up http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);

// use ctrl +c to stop server