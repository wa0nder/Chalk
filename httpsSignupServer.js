const https = require('https');
const http = require('http');
const fs = require('fs');

let filename = process.argv[2] || 'credentials.txt';
let pair = fs.readFileSync(filename, 'utf8').split('|');
const [admin, pass] = [pair[0], pair[1].trim()];

const options = {
  key: fs.readFileSync('cert/privkey.pem'),
  cert: fs.readFileSync('cert/signupServer.pem')
};

const hostname = 'localhost';
const port = 3000;

const server = https.createServer(options, (req, res) => {

  console.log('req URL: ', req.url);

  if(req.url === '/signUp'){
    handleSignUp(req, res);
  }
  else if(req.url === '/confirm'){
    handleConfirm(req, res);
  }
  else if(req.url === '/logIn'){
    handleLogin(req, res);
  }
  else{
    displaySignUp(req, res);
  }
  
});

server.listen(port, hostname, () => {
  console.log(`Server running at https://${hostname}:${port}/`);
});

function displaySignUp(req, res){
  //console.log('req: ', req);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  let html = `
    <head>
    </head>

    <body>
      <a href="/logIn">Log In</a>
      <h1>Chalk Sign Up</h1>
      <form action="/signUp" method="post">
        <label for="fname">Username:</label><br>
        <input type="text" id="fname" name="fname"><br>
        <label for="pass">Password:</label><br>
        <input type="text" id="pass" name="pass"><br><br>
        <input type="submit" value="Submit">
      </form>
    </body>
  `

  res.end(html);
}

function handleSignUp(req, res){
  data = '';

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {

    console.log('post data: ', data);

    createUser(data)

    .then( val => {

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(
        `<a href='/logIn'>You've got an account for Sidewalks!</a>`
      );

    })
    .catch( err => console.log('handleSignUp() Error, Account not created: ', err) );

  });

  res.on('error', function(err){
    callback(err);
  });
}

function createUser(data){

  let userAndPassArray = parseFormData(data);

  return createUserInDB(userAndPassArray);
}

function parseFormData(data){

  let halves = data.split('&');

  let userAndPass = halves.map( item => item.split('=')[1] );

  return userAndPass;
}

function createUserInDB(userPassArray){

  return new Promise( (resolve, reject) => {

    var options = {
      host: 'localhost',
      port: 5984,
      path: '/_users/org.couchdb.user:'+userPassArray[0],
      method: 'PUT',
      auth: `${admin}:${pass}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    console.log("OPTIONS: ", options);

    var req = http.request(options, function(res) {

      console.log('STATUS: ' + res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
  
      body = '';
      res.on('data', chunk => body += chunk);
  
      res.on('end', () => {
  
        let json = JSON.parse(body);
  
        if(res.statusCode === 201 && json.ok === true){

          resolve("Success!");
        }
        else{

          reject( new Error(res.statusCode + ':' + res.body) );
        }
  
  
      });
  
    });
    
    req.on('error', function(e){
  
      console.log('problem with request: ' + e.message);
  
    });
    
    let userData = {
      'name': userPassArray[0], 
      'password': userPassArray[1], 
      'roles': ['user_viewer'], 
      'type': 'user'
    }
  
    req.end( JSON.stringify(userData) );

  });

}

function handleLogin(req, res){

  let path = 'login.html';

  // Check if file exists
  fs.stat(path, function(err,stats) {

    if(err){

      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('ERROR: file does not exist');
    }
    else{

      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': stats.size
      });

      fs.createReadStream(path).pipe(res);
    }

  });
}

function handleConfirm(req, res){

}