var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
// var Reminder = require('./models/reminders');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/Reminders'); //connect to DB
var ObjectID = require('mongodb').ObjectID;
var collection = db.collection('reminders-collection');
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
    collection.find().toArray(function (err, reminders) {
        if (err) {
            res.send(err);
        } else {
          if (!reminders.length || null) {
            res.status(404) //server status
          }
            res.json(reminders);
        }
    });
});

router.get('/reminderByCreateDate/:date', function(req, res) {
  var createdDate = req.params.date;
  collection.find({"created_at": createdDate}).toArray(function(err, result) {
    if (err) {
        res.send(err);
    } else {
        res.json(result);
    };
  });
});
//TO DO search by content //change and test
router.get('/reminders', function(req, res){
  collection.find({"text": req.query.content}).toArray(function(err, result){
    if (err) {
        res.send(err);
    } else {
        res.json({result});
    };
  });
});

router.post('/reminders', function(req, res) {
  collection.save(req.body, (err, result) => {
    if (err) {return console.log(err)} else {
        res.json({'status' : '200'});
    };
  })
});

router.put('/reminders/:reminderId', function(req, res, next) {
  //set conditionally: if property - update. otherwise do nothing
  //create an object if properties are on body then add them to the obj and pass to set!
  //extracting out db query
  collection.findAndModify({
    query: {_id: ObjectID(req.params.reminderId)},
    update: { 
      $set: {text: req.body.text}
    },
    upsert: false,
    returnOriginal: false,
    new: true,
  },
  function(err, object) {
    //console.log({err, object});
    if (err){
      res.status(500).json({})
    }else{
      res.status(200).json([object])
    }
  });
});

router.delete('/reminders/:reminderId', function(req, res) {
  collection.remove(
    {_id: ObjectID(req.params.reminderId)}, function(err) {
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
