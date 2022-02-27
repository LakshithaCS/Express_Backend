//include express and http
const express = require('express'), http = require('http');
//include morgan middleware, for file serving
const morgan = require('morgan')
//include body parser middleware, for converting text sent through HTTP request
const bodyParser = require('body-parser');
//include routers
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

//hostname & port
const hostname = "localhost";
const port = 3000;

//create express app
const app = express();


/***********************/
/*****MiddleWares*******/
/***********************/

//request text is converted to json format
app.use(bodyParser.json());

//use morgan middleware
app.use(morgan('dev'));

/*
v1.0

//for all requests
app.all('/dishes', (req,res,next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();//continue (otherwise below codes doesnt run)
});
//get => /dishes
app.get('/dishes', (req,res,next) => {
    res.end('Will send all the dishes to you!');
});
//post => /dishes
app.post('/dishes', (req, res, next) => {
 res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
});
//put => /dishes
app.put('/dishes', (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /dishes');
});
//delete => /dishes
app.delete('/dishes', (req, res, next) => {
    res.end('Deleting all dishes');
});
//get  => /dishes/id
app.get('/dishes/:dishId', (req,res,next) => {
    res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
});
//post => /dishes/id
app.post('/dishes/:dishId', (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
});

*/

//v2.0
//this will help to devide code into sub part, dont have write lots of code here
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);



/*this works first, index.html serve for '/' */
//give the access to the directory
app.use(express.static(__dirname + '/public'));


/*********************/


/*if user try to access unknown file this part runs. */
//next for additional middlewares
app.use((req, res, next) => {
	//log header
	console.log(req.headers);

	//set response 
	res.statusCode = 200;
  	res.setHeader('Content-Type', 'text/html');
  	res.end('<html><body><h1>Error</h1></body></html>');
});

//create server using express app
const server = http.createServer(app);

//listing
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

