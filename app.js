const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require("./models");
const routes = require('./routes/api.js');
const HttpError = require('./http-error');
const dotenv = require('dotenv');

// get config vars
dotenv.config();

const app = express()

app.use(cors())
app.use(bodyParser.json());

db.sequelize.sync();

app.use('/api', routes)

app.get('/',(req,res,next) => {
    res.json({message:'Server started successfully'});
})

app.use((req, res, next) => {
    const error = new HttpError("Could not find the Route", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "unknown error" });
});

app.listen(5000);