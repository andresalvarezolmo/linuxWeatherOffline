const router = require('express').Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const { render } = require('ejs');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
// const isAuthenticated = require('../lib/authentication');
// require('../js/passport');

router.get('/', isAuthenticated,(req,res)=>{
    res.render('home', {user: req.user});
});

router.get('/login',isNotAuthenticated, (req,res) =>{
    res.render('login', {user: req.user});
});

router.get('/signup',isNotAuthenticated, (req,res) =>{
    res.render('signup');
})

router.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/');
});

router.post('/login',urlencodedParser, passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/auth/login'
}));

router.post('/signup', urlencodedParser, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/auth/signup'
}));



// router.post('/login', urlencodedParser, (req,res)=>{
//     console.log('Body content:', req.body); 
//     res.redirect('/');
// });




//change to separate file
function isAuthenticated(req,res,next){
    if(req.isAuthenticated())
        return next();
    else
        return res.redirect('../auth/login');
}

function isNotAuthenticated(req,res,next){
    if (!req.isAuthenticated())
        return next();        
    return res.redirect('/profile')
}

module.exports = router;

