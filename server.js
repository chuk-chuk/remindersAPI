// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Reminder = require('./models/reminders');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/Reminders'); //connect to DB

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
  console.log('something is happening');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
    res.send('Hello Yulia!')
});

router.get('/reminders', function (req, res, next) {

   var collection = db.collection('reminders-collection');
    collection.find().toArray(function (err, reminders) {
        if (err) {
            res.send(err);
        } else {
            res.json(reminders);
        }
    });
});

router.post('/reminder-new', function(req, res) {
  db.collection('reminders-collection').save(req.body, (err, result) => {
   if (err) return console.log(err)

   console.log('saved to database')
 })
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
