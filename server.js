const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./js/db');
const passport = require('passport');
require('./js/passport');
const cookieSession = require('cookie-session');
const ejs = require('ejs');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');


// create application/json parser
const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

//Setting ejs as view engine
app.set('view engine', 'ejs');

//Cookies
app.use(cookieSession({
    maxAge: 24*60*60*100,
    keys:['abc']
}));

//Passpoiddlewares
app.use(passport.initialize());
app.use(passport.session());

//Set up routes 
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

//Image processor
app.use(express.static(__dirname));

//Routing for get petitions
app.get('/',homeAuthenticaded, (req,res) => {
    res.render('home', {user: req.user})
    console.log(req.headers['x-forwarded-for'])
});

//Check if user is already logged in
function homeAuthenticaded(req,res,next){
    if(req.isAuthenticated())
        return res.redirect('/profile');
    else
        return next();
}

app.listen(port, () => console.log(`Server listening http://localhost:${port}`));
   