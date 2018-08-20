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
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use((req, res, next) => {
    console.log('Params: ', req.params)
    console.log('Path: ', req.path)
    console.log('Query: ', req.query) 
    console.log('Method: ', req.method) 
    console.log('Body: ', req.body)
    console.log("💎 💎 💎 💎 💎 💎 💎 💎 💎 💎 💎") 
    next();
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});

// app.use('/token', generateToken)
app.use('/health', healthRoutes);
app.use('/user', userRoutes);
app.use('/reminders', remindersRoutes);

// error handling here after you ve called all the routes

module.exports = app;