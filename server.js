var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
// var Reminder = require('./models/reminders');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/Reminders'); //connect to DB
var ObjectID = require('mongodb').ObjectID;
var collection = db.collection('reminders-collection');
var service = require('./service');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
//get a different post to for tests
var router = express.Router();

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.use(function(req, res, next) {
  console.log('debugger logs below:');
  console.log('Params: ', req.params)
  console.log('Path: ', req.path)
  console.log('Query: ', req.query) 
  console.log('Method: ', req.method) 
  next();
});
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.get('/reminders', function (req, res, next) {
    service.getAllReminders(function (err, result) {
        if (err) {
            res.send(err);
        } else {
          if (!result.length || null) {
            res.status(404) //server status
          }
            res.json(result);
        }
    });
});

router.get('/reminderByCreateDate/:date', function(req, res) {
  var createdDate = req.params.date;
  service.getReminderByDate(createdDate, function (err, result) {
      if (err) {
          res.send(err);
      } else {
          res.json([result]);
      };
  });
});

router.get('/reminderByContent/:content', function(req, res){
  var content = req.params.content;
  service.getReminderByContent(content, function(err, result){
    if (err) {
        res.send(err);
    } else {
        res.json([result]);
    };
  });
});

router.post('/reminders', function(req, res) {
  console.log("POST", req.body);
  const rem = { 
    _id: ObjectID(req.body._id), 
    text: req.body.text,
    created_at: req.body.created_at,
    expired_by: req.body.expired_by
  };
  
  collection.save(rem, (err, result) => {
    if (err) {return console.log(err)} else {
        res.json({'status' : '200'});
    };
  })
});

router.put('/reminders/:reminderId', function(req, res, next) {
  //set conditionally: if property - update. otherwise do nothing
  //create an object if properties are on body then add them to the obj and pass to set!
  service.updateReminder(req.params.reminderId, req.body.text, function(err, object) {
    if (err){
      res.status(500).json({})
    }else{
      res.status(200).json([object])
    }
  });
});

router.delete('/reminders/:reminderId', function(req, res) {
  service.deleteReminderById(req.params.reminderId, function(err) {
    if(err) {res.send(err)} else {
      res.status(404).json({
        status: "terminated",
        message: "The information is not accessible anymore"
      });
    };
  });
});

app.use('/api', router);

if(!module.parent){ app.listen(port); }
console.log('Magic happens on port ' + port);

module.exports = app;
