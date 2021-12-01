let mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

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

module.exports = {

    initialize: function () {
        let promise = new Promise((resolve, reject) => {
            let pass1 = encodeURIComponent("J@y24102001");
            let db = mongoose.createConnection(`mongodb+srv://Jaypatel1331:${pass1}@senecaweb.znwup.mongodb.net/SenecaWeb?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

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
                bcrypt.genSalt(10)
                    .then(salt => bcrypt.hash(userData.password, salt))
                    .then(hash => {
                        userData.password = hash;
                        let newUser = new User(userData);
                        newUser.save(function (err) {
                            if (err) {
                                if (err.code == 11000) {
                                    reject("User Name already taken");
                                } else {
                                    reject("There was an error creating the user: " + err);
                                }
                            } else {
                                resolve();
                            }
                        });
                    }).catch(() => {
                        reject("There was an error encrypting the Password");
                    });
            } else {
                reject("Passwords do not match");
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
                        bcrypt.compare(userData.password, users[0].password).then(res=> {
                            if (res === true) {
                            if (users[0].loginHistory == null) {
                                users[0].loginHistory = [];
                            }
                            users[0].loginHistory.push({
                                dateTime: (new Date()).toString(),
                                userAgent: userData.userAgent
                            });

                            User.updateOne(
                                { userName: users[0].userName },
                                { $set: { loginHistory: users[0].loginHistory } }
                            ).exec().then(function () {
                                resolve(users[0]);
                            }).catch(function (err) {
                                reject("There was an error verifying user: " + err);
                            });

                        }
                        else {
                            reject("Incorrect Password for user: " + userData.userName);
                        }
                    }); 
                }
                })
                .catch(function () {
                    reject("Unable to find user: " + userData.userName);
                });
        });
        return promise;
    }
};