const service = require('../query/service');
const helper = require ('../helper');

module.exports = (() => {
    'use strict';
    const router = require('express').Router();
    
    router.get('/', function (req, res, next) {
        service.getAllReminders((err, result) => {
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
    
    router.get('/date/:date', function(req, res) {
      var createdDate = req.params.date;
      service.getReminderByDate(createdDate, (err, result) => {
          if (err) {
              res.send(err);
          } else {
              res.json([result]);
          };
      });
    });
    
    router.get('/content/:content', function(req, res){
      var content = req.params.content;
      service.getReminderByContent(content, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json([result]);
        };
      });
    });
    
    router.post('/', function(req, res) {
      service.postReminder(req.body.text, req.body.expired_by, (err, object) => {
        if (err) {
            res.send(err);
        } else {
          res.status(200).json([object]);
        }
      });
    });
    
    router.put('/:reminderId', function(req, res) {
      service.updateReminder(req.params.reminderId, req.body.text, req.body.expired_by, (err, object) => {
        if (err) {
          return next(err);
          // res.status(500).json({})
        } else {
          res.status(200).json([object])
        }
      });
    });
    
    router.delete('/:reminderId', function(req, res) {
      service.deleteReminderById(req.params.reminderId, (err) => {
        if (err) {
          err.status = 402;
          return next(err);
        } else {
          //setup 404 error handler - from the same place
          res.status(404).json({
            status: "terminated",
            message: "The information is not accessible anymore"
          });
        };
      });
    });
    
    return router;
})();