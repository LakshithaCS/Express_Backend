//http module
const http = require('http');

//file system module, to read and write file in local file system
const fs = require('fs');

//path module, to specify path in local file system
const path = require('path');

//host name
const hostname = 'localhost';

//portname
const port = 3000;

/**
 * setup the server
 * takes two paramentes , request and response
 * request = request that comming from any browser
**/
const server = http.createServer((req, res) => {
  
  /*
    v1.0

    //request header
    console.log(req.headers);
    
    //setup response
    res.statusCode = 200; //setup status code 200 = everything ok
    res.setHeader('Content-Type', 'text/html'); //response header
    res.end('<html><body><h1>Hello, World!</h1></body></html>'); //ending response, this information send back to the client

  */

  //v2.0

  console.log('Request for ' + req.url + ' by method ' + req.method);

  //if method is GET
  if (req.method == 'GET') {
    var fileUrl;

    //if URL contains only '/'
    if (req.url == '/') fileUrl = '/index.html';
    //otherwise
    else fileUrl = req.url;

    //find the full path using resolve()
    var filePath = path.resolve('./public'+fileUrl);
    //file name extension
    const fileExt = path.extname(filePath);

    //if it is html
    if (fileExt == '.html') {
      /**checking existance
       * first parameter = file
       * second parameter = call back function
      **/
      fs.exists(filePath, (exists) => {
        //if not exist, return an error
        if (!exists) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html');
          res.end('<html><body><h1>Error 404: ' + fileUrl + 
                      ' not found</h1></body></html>');
          return;
        }
        //if exist, return the file
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream(filePath).pipe(res);
      });

    //if file extension is not HTML, return an error
    }else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html');
      res.end('<html><body><h1>Error 404: ' + fileUrl + 
              ' not a HTML file</h1></body></html>');
    }
  }

  //if reqest is not GET, return an error
  else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html');
      res.end('<html><body><h1>Error 404: ' + req.method + 
              ' not supported</h1></body></html>');
  }


})

/*start the server*/
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});