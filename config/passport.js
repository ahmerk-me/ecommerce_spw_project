// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// Generate Hash
var bcrypt = require('bcrypt-nodejs');

// database module
var database = require('../config/database');
var RunQuery = database.RunQuery;

// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.UserID);
    });

    // used to deserialize the user
    passport.deserializeUser(function (userId, done) {
        var sqlStr = '\
            SELECT *\
            FROM users\
            where UserID = \'' + userId + '\'';
        RunQuery(sqlStr, function (rows) {
            done(null, rows[0]);
        });
    });


    passport.use('sign-in', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows to pass back the entire request to the callback
        },
        function (req, username, password, done) { // callback with username and password from form
        
            console.log("12345 =======================================", username.length)

            // input validation
            var error = false
            const list = ['!', '#', '$', '%', '&', '*', '(', ')', ']', '[', '>', '<', '=', '÷', '×', '+', ':', ';'];
           
                for(let y=0; y<list.length; y++) {
                    if(username.includes(list[y])) {
                        error = true
                        console.log("12345 == found special character ===========")
                    }
                }

                if (error) {
                    return done(null, false, req.flash('signInError', 'Special characters are not allowed'));
                }
                
                // if no user is found, return the message
                if(username.length > 20) {
                    console.log("222222222 ==================")
                    return done(null, false, req.flash('signInError', 'Username cannot be more than 20 characters'));
                }

                // if no user is found, return the message
                if(password.length > 20) {
                    console.log("222222222 ==================")
                    return done(null, false, req.flash('signInError', 'Password cannot be more than 20 characters'));
                }

            // check to see if the user exists or not
            var sqlStr = 'SELECT * FROM users WHERE Username = \'' + username + '\'';
            RunQuery(sqlStr, function (rows) {
            
                if (rows.length < 1)
                    return done(null, false, req.flash('signInError', 'Incorrect Credentials'));

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].Password))
                    return done(null, false, req.flash('signInError', 'Incorrect Credentials'));
                    
                // all is well, return successful user
                return done(null, rows[0]);
            });

        })
    );


    passport.use('sign-up', new LocalStrategy({
            // by default, local strategy uses username and password
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            var email = req.body.email;

            if (password != req.body.rePassword) {
                return done(null, false, req.flash('signUpError', 'Passwords do not match.'));
            }
            else {

                var selectQuery = 'SELECT *\
                    FROM users\
                    WHERE email = \'' + email + '\'';
                RunQuery(selectQuery, function (emailRows) {
                    if (emailRows.length > 0) {
                        return done(null, false, req.flash('signUpError', 'Email address has already been used.'));
                    }
                    else {
                        selectQuery = '\
                        SELECT *\
                        FROM users\
                        WHERE username = \'' + username + '\'';
                        RunQuery(selectQuery, function (usernameRows) {
                            if (usernameRows.length > 0) {
                                return done(null, false, req.flash('signUpError', 'Username has already been used.'));
                            }
                            else {
                                // if there is no user with that user and email
                                var fullName = req.body.fullName;
                                var phone = req.body.phone;
                                var address = req.body.streetAddress;
                                var postcode = req.body.postcode;
                                var city = req.body.city;
                                var country = req.body.country;
                                var passwordHash = bcrypt.hashSync(password, null, null);

                                var insertQuery = 'INSERT INTO Users\
                                    VALUES(null,\
                                    \'' + fullName + '\', \
                                    \'' + address + '\', \
                                    \'' + postcode + '\', \
                                    \'' + city + '\', \
                                    \'' + country + '\', \
                                    \'' + phone + '\', \
                                    \'' + email + '\', \
                                    \'' + username + '\', \
                                    \'' + passwordHash + '\', 0)';

                                RunQuery(insertQuery, function (insertResult) {
                                    //user
                                    var user = {
                                        UserID: insertResult.insertId
                                    };
                                    insertQuery = 'INSERT INTO Addresses\
                                    VALUES(null, ' +
                                        insertResult.insertId + ', \'' +
                                        fullName + '\', \'' +
                                        address + '\', \'' +
                                        postcode + '\', \'' +
                                        city + '\', \'' +
                                        country + '\', \'' +
                                        phone + '\')';
                                    RunQuery(insertQuery, function (addRow) {
                                        return done(null, user);
                                    });
                                });
                            }
                        });
                    }
                });
            }
        })
    );
};
