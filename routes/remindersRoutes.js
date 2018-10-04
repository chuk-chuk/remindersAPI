const service = require('../query/service');

module.exports = (() => {
    /* eslint-disable global-require */
    const router = require('express').Router();
    
    router.get('/', (req, res, next) => {
        service.getRemindersForUser(req.decoded.id, (err, reminders) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
            } else {
                if (!reminders.length) {
                    return next({ statusCode: 404 });
                }
                return res.json(reminders);
            }
        });
    });
    
    router.get('/date/:date', (req, res, next) => {
        const createdDate = req.params.date;
        service.getReminderByDate(req.decoded.id, createdDate, (err, result) => {
            if (err) {
                err.status = 503;
                return next(err);
            } else {
                return res.json([result]);
            }
        });
    });

    router.get('/content/:content', (req, res, next) => {
        const { content } = req.params;
        service.getReminderByContent(req.decoded.id, content, (err, result) => {
            if (err) {
                err.statusCode = 503;
                return next(err);
            } else {
                return res.json([result]);
            }
        });
    });
    
    router.post('/', (req, res, next) => {
        service.postReminder(req.body.text, req.body.expired_by, req.decoded.id, (err, reminder) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
            } else {
                return res.status(200).json([reminder]);
            }
        });
    });
    
    router.put('/:reminderId', (req, res, next) => {
        service.updateReminder(req.params.reminderId, req.body.text, req.body.expired_by, req.decoded.id, (err, reminder) => {
            if (err) {
                err.statusCode = 502;
                return next(err); 
            }
            if (!reminder) {
                service.getReminderById(req.params.reminderId, (err, reminder) => {
                    console.log('99999', reminder);
                    if (err) {
                        err.statusCode = 502;
                        return next(err);
                    } else if (reminder && req.decoded.id !== reminder.userId) {
                        return res.status(403).json();
                    } else if (!reminder._id) {
                        return res.status(404).json();
                    } else {
                        console.log('I am not sure what\'s going on');
                    }
                });
            } else {
                return res.status(200).json([reminder]);
            }
        });
    });
    
    router.delete('/:reminderId', (req, res, next) => {
        service.deleteReminderById(req.params.reminderId, req.decoded.id, (err, result) => {
            if (err) {
                err.statusCode = 502;
                return next(err);
            }
            
            if (result.n < 1) {
                return next();
            }
            return res.status(200).json([result]);
        });
    });
    return router;
})();
