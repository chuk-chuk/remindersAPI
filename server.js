const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8080;
const externalRoutes = require('./routes/externalRoutes');

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

app.use('/api', externalRoutes);

module.exports = app;