var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var Reminder = require('./models/reminders');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/Reminders'); //connect to DB
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.use(function(req, res, next) {
  console.log('something is happening');
  next();
});
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
    // res.send('Hello Yulia!')
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
//search by creation date
router.get('/reminderByCreateDate/:date', function(req, res) {
  var createdDate = req.params.date;
  var reminderCollection = db.collection('reminders-collection');
  reminderCollection.find({"created_at": createdDate}).toArray(function(err, result) {
    if (err) {
        res.send(err);
    } else {
        res.json(result);
    };
 });
});
//search by content
router.get('/reminderByContext/:content', function(req, res){
  var content = req.params.content;
  var reminderCollection = db.collection('reminders-collection');
  reminderCollection.find({"text": content}).toArray(function(err, result){
    if (err) {
        res.send(err);
    } else {
        res.json({result});
    };
  });
});

router.post('/reminder-new', function(req, res) {
  db.collection('reminders-collection').save(req.body, (err, result) => {
    if (err) {return console.log(err)} else {
        res.json({'status' : '200'});
    };
  })
});
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
