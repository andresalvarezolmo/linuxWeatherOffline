const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const db = require('./db');
const bcrypt = require('../lib/bcrypt')

console.log('Passport config loaded');

passport.use('local.signin', new Strategy({
    usernameField: 'username',
    passwordField: 'password'
    // passReqToCallBack: true // allows us to pass back the entire request to the callback
} , async(username, password, done) =>{
    console.log('Entered here');
    const rows = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    // console.log(rows);
    if (rows.length > 0) {
        console.log('Username found in the database');
        const user = rows[0];
        const validPassword = await bcrypt.comparePasswords(password, rows[0].pass);
        if(validPassword){
            console.log('Right password, welcome '+ user.username) + "with ID: " + user.userID;
            done(null, user);
        }
        // if (rows[0].pass === password) {
        //     console.log('Right password, welcome '+ user.username) + "with ID: " + user.userID;
        //     done(null, user);
        // }
        else{
            console.log('Incorrect pass');
            done(null, false);
        }
    }
    else{
        console.log('User not found');
        done(null, false);
    }
}));

passport.use('local.signup', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallBack: true // allows us to pass back the entire request to the callback
}, async(username, password, done) => {
    const user = {username, pass: password};
    user.pass = await bcrypt.encryptPassword(password);
    // console.log(user);
    console.log("This is the introduced password: " + password);
    await db.query('INSERT INTO users SET ?', [user], (err)=>{
        if(err){
            console.log(err);
            console.log('Username already exists:', user.username);
            done(null, false);
        }
        else{
            console.log('User created', user.username);
            done(null,user);
        }
    });
}));

passport.serializeUser((user, done) => {
    console.log("Serialize: ", user.username);
    done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
    const user = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    // console.log("This is the userID that has logged out:" + user[0].userID);
    done(null, user[0]);
});