const https = require('https');
const http = require('http');
const fs = require('fs');
const { uploadFiles } = require('./updateScriptNodeJS.js');

function hexEncode(str){
  let hex, i;

  let result = "";
  for (i=0; i<str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += (hex).slice(-4);
  }

  return result
}

let filename = process.argv[2] || '../credentials.txt';
let pair = fs.readFileSync(filename, 'utf8').replace(/\s/g, "").split('|');
const [admin, pass] = [pair[0], pair[1].trim()];

const options = {
  key: fs.readFileSync('../cert/privkey.pem'),
  cert: fs.readFileSync('../cert/signupServer.pem')
};

const serverDBHostName = '127.0.0.1'
const serverDBPort = 5984;
const hostname = 'localhost';
const port = 3000;

const server = https.createServer(options, (req, res) => {

  console.log('req URL: ', req.url);

  if(req.url === '/signUp'){
    handleSignUp(req, res);
  }
  // else if(req.url === '/confirm'){
  //   handleConfirm(req, res);
  // }
  else if(req.url === '/logIn'){
    handleLogin(req, res);
  }
  else if(req.url === '/'){
    displaySignUp(req, res);
  }
  else{
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end("<p>Sorry! The page you are looking for does not exist</p>");
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

    .then( () => {

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(
        `<a href='/logIn'>You've got an account for Sidewalks!</a>`
      );

    })

    .catch( err => {

      console.log('handleSignUp() Error: ', err.message)

      res.statusCode = 401;
      res.setHeader('Content-Type', 'text/html');
      res.end(`<p>Sorry, something went wrong during the sign up process :( <br/>${err.toString()}</p>`);

    });

  });

  res.on('error', function(err){
    callback(err);
  });
}

function createUser(data){

  let userAndPassArray = parseFormData(data);
  let dbHex = hexEncode(userAndPassArray[0]);

  return createUserInDB(userAndPassArray)

    .then( () => confirmUserDBCreation(dbHex) )

    .then( () => putJSFileInDB(dbHex) )

    .then( () => putDesignDocInDB(dbHex) )

    .then( () => uploadFiles(false, `/userdb-${dbHex}/home/`, ['../html/home.html']) );
}

function confirmUserDBCreation(dbHex){

  return new Promise( (resolve, reject) => {

    let retries = 0;

    (function checkDB(resolve, reject){

      http.get(`http://${admin}:${pass}@${serverDBHostName}:${serverDBPort}/userdb-${dbHex}`, res => {

        //console.log('RESPONSE: ', res.statusCode);

        if(res.statusCode === 200) resolve(res.statusCode + ' : User DB successfully created');

        else{

          if(retries > 5) reject( new Error(`checkDB() http.get() UserDB creation failed`) );

          else{

            console.log('Retrying confirm userdb creation.')

            setTimeout( () => checkDB(resolve, reject), 10);

            retries++;
          }

        }
  
      })
      .on('error', (e) => {

        console.error(`checkDB() http.get() Error: ${e.message}`);
        
        reject(e);
      });

    })(resolve, reject);

  });
  
}

function putDesignDocInDB(dbHex){

  let doc = {
    '_id' : '_design/sortThreads',
    "views": {
      "sortThreads": {
        "map": `function (doc){
          if(doc.type && doc.type === 'thread' && doc.date){
            var key = [doc.date, doc._id]
            emit(key, {numComments: doc.numComments, previewComments:doc.comments.slice(0,10)});
          }
        }`
      }
    },
    "language": "javascript"
  }

  return putDocInDB(`/userdb-${dbHex}/_design/sortThreads`, doc);
}

function putJSFileInDB(dbHex){

  return new Promise((resolve, reject) => {

    fs.readFile('./DataService.js', (err,data) => {

      if(err) reject(err);
      
      console.log(data);

      data += '\n\n';
      data += `let DataService = createRemoteDataService('${serverDBHostName}','${dbHex}');`;

      //fs.writeFileSync('testoutput.js', data, 'utf8');
      //let base64e = Buffer.from(jsFileContents).toString('base64');
      //console.log('out: ', base64e);
      let doc = {
        "_attachments": {
          "init.js": {
            "data": Buffer.from(data).toString('base64'), 
            "content_type": "text/javascript"
          }
        }
      }

      resolve(doc);
    })
  })

  .then(doc => putDocInDB(`/userdb-${dbHex}/home`, doc) );
  
}

function putDocInDB(path, doc){

  return new Promise( (resolve, reject) => {

    //send file as db attachment
    let options = {
      host: serverDBHostName,
      port: serverDBPort,
      path: path,
      method: 'PUT',
      auth: `${admin}:${pass}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    //console.log('OPTIONS: ', options);

    let req = http.request(options, function(res) {

      console.log('STATUS: ' + res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
  
      let body = '';
      res.on('data', chunk => body += chunk);
  
      res.on('end', () => {
  
        let json = JSON.parse(body);
  
        if(res.statusCode === 201 && json.ok === true){

          resolve(`document successfully added to DB @ ${path}.`);
        }
        else{

          reject( new Error('putJSInDB() : ' + res.statusCode + ':' + body) );
        }
      });
  
    });
    
    req.on('error', function(e){
  
      reject('putJSInDB(): request did not resolve', e);
    });
  
    req.end( JSON.stringify(doc) );

  });

}

function parseFormData(data){

  let halves = data.split('&');

  let userAndPass = halves.map( item => item.split('=')[1] );

  return userAndPass;
}

function createUserInDB(userPassArray){

  return new Promise( (resolve, reject) => {

    let options = {
      host: serverDBHostName,
      port: serverDBPort,
      path: '/_users/org.couchdb.user:'+userPassArray[0],
      method: 'PUT',
      auth: `${admin}:${pass}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    //console.log("OPTIONS: ", options);

    let req = http.request(options, function(res) {

      console.log('STATUS: ' + res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
  
      let body = '';
      res.on('data', chunk => body += chunk);
  
      res.on('end', () => {
  
        let json = JSON.parse(body);
  
        if(res.statusCode === 201 && json.ok === true){

          resolve("Success!");
        }
        else{

          reject( new Error(res.statusCode + ':' + body) );
        }
      });
  
    });
    
    req.on('error', function(e){
  
      reject(e);
  
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

  let path = '../html/login.html';

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