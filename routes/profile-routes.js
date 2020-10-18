const router = require('express').Router();
const {render} = require('ejs');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const pool = require('../js/db');
const fetchUrl = require('fetch').fetchUrl;
const apiKey = '&appid=a38656fcf967a388c6027b0920d8e2e8';
const tempUnit = '&units=metric';

const addPartURl = 'https://api.openweathermap.org/data/2.5/weather?q=';
const citiesCheck = 'http://api.openweathermap.org/data/2.5/group?id=';

//checks if user is authenticated
const authCheck = (req, res, next) => {
    if (!req.user) res.redirect('/auth/login');
    else next();
}

router.get('/', authCheck, async (req,res) =>{
    //Query to get user stored locations
    await pool.query("SELECT * FROM locations where fk_userID=" + req.user.userID, async (error,result)=>{
        //debugging purposes
        // console.log(result.length);
        var citiesIDs = '';
        for (let index = 0; index < result.length; index++) {
            citiesIDs = citiesIDs + result[index].cityID + ",";
        }
        //debugging purposes
        // cons ole.log(citiesIDs);
        // console.log(citiesCheck + citiesIDs + apiKey);
        await fetchUrl(citiesCheck + citiesIDs + apiKey + tempUnit, (err, meta, body)=>{
            var citiesResponse = JSON.parse(body);
                // console.log(citiesResponse);
                // console.log(citiesResponse.list[0].name);
                // console.log(citiesResponse.list[0].weather[0].main);
                // console.log(citiesResponse.list[0].main.temp);
                // console.log(citiesResponse.list[0].main.humidity)
                // console.log(citiesResponse.list[0].wind.speed)
            res.render('profile', {user: req.user, locations: citiesResponse});
        })
    });
});

router.post('/delete', urlencodedParser, async(req,res)=>{
    if(!req.body.deletedCity){
        res.redirect('/profile')
    }
    else{
        // console.log(req.user);
        var cityToDelete = req.body.deletedCity;
        // console.log(cityToDelete);
        var deleteQuery = "DELETE FROM locations WHERE cityID = " + cityToDelete;
        await pool.query(deleteQuery);
        res.redirect('/profile')
    }
});

router.post('/add', urlencodedParser, async (req, res) => {

    await fetchUrl(addPartURl + req.body.cityInput + apiKey, async (error, meta, body) => {

        var response = JSON.parse(body);
        if (response.cod=='404'){
            console.log(response.message);
            res.redirect("/profile")
        }

        else {
            //if the petition's status is not 404 save city details to enter to DB
            var city = req.body.cityInput;
            var country = response.sys.country;
            var userID = req.user.userID;
            var refCode = userID + city;
            var cityID = response.id;
            await pool.query("INSERT INTO locations(cityName, countryCode, fk_userID, referenceCode, cityID) VALUES('" + city + "','"+ country +"','" + userID + "','" + refCode + "','" + cityID + "' );", (error)=>{
                if(error) {
                    console.log(error);
                    // console.log('Duplicated city:', city);
                }
                res.redirect('/profile');
            });
        }
    });
});

module.exports = router;