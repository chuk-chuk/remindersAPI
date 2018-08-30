const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 8080;
const remindersRoutes = require('./routes/remindersRoutes');
const userRoutes = require('./routes/userRoutes');
const healthRoutes = require('./routes/healthRoutes');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use((req, res, next) => {
    console.log('Params: ', req.params);
    console.log('Path: ', req.path);
    console.log('Query: ', req.query); 
    console.log('Method: ', req.method); 
    console.log('Body: ', req.body);
    console.log('💎 💎 💎 💎 💎 💎 💎 💎 💎 💎 💎'); 
    next();
});

app.use((req, res, next) => {
   // VERIFY TOKEN HERE UNLESS ROUTE IS /token or POST /users 
    next();
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});

// app.use('/token', generateToken)
app.use('/health', healthRoutes);
app.use('/users', userRoutes);
app.use('/reminders', remindersRoutes);

app.use((req, res) => {
    res.status(404).json();
});
// error handling here after you ve called all the routes

// 50x
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
    res.send(err.statusCode).json(err);
});

module.exports = app;
