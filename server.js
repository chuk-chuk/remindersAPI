const express = require('express');
const app = express();
const moment = require('moment');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongojs = require('mongojs');
const db = mongojs('mongodb://localhost:27017/Reminders');
const collection = db.collection('reminders-collection');
const service = require('./service');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 8080;
//get a different post to for tests
var router = express.Router();

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//router out to its own module !!! 
router.use(function(req, res, next) {
  console.log('debugger logs below:');
  console.log('Params: ', req.params)
  console.log('Path: ', req.path)
  console.log('Query: ', req.query) 
  console.log('Method: ', req.method) 
  console.log('Body: ', req.body) 
  console.log("+++++++++++++++++++++") 
  next();
});

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
  const rem = {
    text: req.body.text,
    created_at: moment().format("YYYY-MM-DD"),
    expired_by: req.body.expired_by
  };
  
  collection.save(rem, (err, result) => {
    if (err) {
      return console.log(err)
    } else {
        res.json({'status' : '200'});
    }
  });
});

router.put('/reminders/:reminderId', function(req, res) {
  service.updateReminder(req.params.reminderId, req.body.text, req.body.expired_by, function(err, object) {
    if (err) {
      res.status(500).json({})
    } else {
      res.status(200).json([object])
    }
  });
});

router.delete('/reminders/:reminderId', function(req, res) {
  service.deleteReminderById(req.params.reminderId, function(err) {
    if (err) {
      res.send(err)
    } else {
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
