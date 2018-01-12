var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
// var Reminder = require('./models/reminders');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/Reminders'); //connect to DB
var ObjectID = require('mongodb').ObjectID;
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
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

//edit reminder
router.put('/reminders/:reminderId', function(req, res) {
  var reminderId = req.params._id;
  console.log(req.body)
  db.collection('reminders-collection').update(
    {_id :  ObjectID(req.body._id) },
    { $set: { 'text': req.body.text, 'expired_by': req.body.expired_by}
  }, function(err){
    if(err) {res.send(err)} else {
      res.json({message: 'reminder edited!'});
    };
  })
});

//delete reminder to check
router.delete('/reminders/:reminderId', function(req, res) {
  var reminderId = req.params._id;
  db.collection('reminders-collection').remove(reminderId, (err, result) => {
    if (err) {return console.log(err)} else {
      console.log("hello");
        res.json({message: 'reminder deleted'});
    };
  });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
