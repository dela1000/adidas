let fs = require('fs');
let path = require('path');
let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let app = express();

var router = require(__dirname + '/backend/routes.js');

app.use(cors())

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.use("/", router);

app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});