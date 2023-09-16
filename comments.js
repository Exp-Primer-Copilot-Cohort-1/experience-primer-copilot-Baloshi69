// create web server 
// 1. load all the modules 
// 2. create a server 
// 3. create a router
// 4. create a request handler
// 5. start the server

// 1. load all the modules 
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var comments = require('./comments.json');

// 2. create a server 
var server = http.createServer(function(req, res) {
    // 3. create a router
    var path = url.parse(req.url).pathname;
    // 4. create a request handler
    if (path === '/') {
        fs.readFile(__dirname + '/index.html', function(err, data) {
            if (err) {
                console.log(err);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('500 - Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (path === '/comments.json') {
        if (req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(comments));
        } else if (req.method === 'POST') {
            var requestBody = '';
            req.on('data', function(data) {
                requestBody += data;
            });
            req.on('end', function() {
                var comment = querystring.parse(requestBody);
                comments.push(comment);
                fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
                    if (err) {
                        console.log(err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('500 - Internal Server Error');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(comments));
                    }
                });
            });
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 - Page Not Found');
    }
});

// 5. start the server
server.listen(3000, function() {
    console.log('Server is running at port 3000');
});