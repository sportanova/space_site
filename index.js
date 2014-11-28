module.exports = require('./node_modules/express/lib/express');

var express    = require('express');
var app        = express();
var router = express.Router();

var port = process.env.PORT || 8080;    // set our port
app.use(express.static(process.cwd() + '/public'));

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.methodOverride());
// app.use(express.multipart());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/', router);
// app.set('views', __dirname + '/views');


router.get('/', function(req, res) {
  res.render('index.html'); 
});

app.listen(port);
console.log('Magic happens on port ' + port);