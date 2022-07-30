require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Url = require('./models/url')
const { createUrl, getUrlByHash, redirectController } = require('./controllers/urlController')
const app = express();

const port = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI;
const SHORTENED_URL_REGEX = /^\/[A-Za-z0-9]{5}$/;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) throw err;
        console.log("Succesfully connected to db!");
    });

// logger                                                                            
app.use((req, _, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`)
    next();
})

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));



app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
});

// url redirect
app.get(SHORTENED_URL_REGEX, redirectController);

// API
app.post('/api/create-url', createUrl);

app.get('/api/get-url/:url', getUrlByHash);



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
