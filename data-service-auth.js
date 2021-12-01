let mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
});

let User;

module.export = {

    initialize: function () {
        let promise = new Promise((resolve, reject) => {
            let db = mongoose.createConnection("mongodb+srv://Jaypatel1331:<J@y24102001>@senecaweb.znwup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

            db.on('error', (err) => {
                reject(err);
            });

            db.once('open', () => {
                User = db.model("users", userSchema);
                resolve("use is created successfully!!");
            });

        });
        return promise;
    },

    registerUser: function (userData) {
        let promise = new Promise((resolve, reject) => {
            if (userData.password == userData.password2) {
                let newUser = new User(userData);
                newUser.save((err) => {
                    if (err) {
                        if (err.code == 11000) {
                            reject("User Name already taken");
                        } else {
                            reject("There was an error creating the user" + err);
                        }
                    } else {
                        resolve();
                    }
                });
            } else {
                reject("Passwords do not match, Try again!");
            }
        });
        return promise;
    },

    checkUser: function (userData) {
        let promise = new Promise((resolve, reject) => {
            User.find({ userName: userData.userName }).exec()
                .then((users) => {
                    if (users.length == 0) {
                        reject("Unable to find user: " + userData.userName);
                    }
                    else {
                        if (users[0].password == userData.password) {
                            reject("Incorrect Password for user: " + userData.userName);
                        }
                        else { 
                            if (users[0].loginHistory == null){
                                users[0].loginHistory = [];

                                users[0].loginHistory.push({ 
                                    dateTime: (new Date()).toString(),
                                    userAgent: userData.userAgent
                                });

                                User.updateOne(
                                    {userName: users[0].userName},
                                    { $set: {loginHistory: users[0].loginHistory} }
                                  ).exec().then(()=>{
                                      resolve(users[0]);
                                  }).catch((err)=>{
                                      reject("There was an error verifying user: "+ err);
                                  });
                            }
                        }
                    }
                })
                .catch(function() {
                    reject("Unable to find user: " + userData.userName);
                });
        });
        return promise;
    }
};