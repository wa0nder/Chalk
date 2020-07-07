const http = require('http');
const fs = require('fs');
const path = require('path');

let filename = process.argv[2] || 'credentials.txt';
let pair = fs.readFileSync(filename, 'utf8').split('|');
const [admin, pass] = [pair[0], pair[1].trim()];

function getLastRev(path){

    return new Promise( function(resolve, reject){

        http.get(`http://${admin}:${pass}@127.0.0.1:5984${path}`, (resp) => {
            let data = '';
          
            // A chunk of data has been received.
            resp.on('data', (chunk) => {
              data += chunk;
            });
          
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                let json = JSON.parse(data);
                //console.log("returned json: " + data);

                resolve(json._rev);
            });
          
            resp.on('error', (err) => {
                reject(err);
                //console.log("Error: " + err.message);
            })
          
        })
        .on("error", (err) => {
            reject(err);
            //console.log("Error: " + err.message);
            });
    });
    
}

function uploadFile(filename, rev, verbose, db_path){

    return new Promise( function(resolve, reject){
        
        let type = path.extname(filename).substr(1);
        
        let options = {
            host: 'localhost',
            port: 5984,
            path: `${db_path}${filename}?rev=${rev}`,
            method: 'PUT',
            auth: `${admin}:${pass}`,
            headers: {
                'Content-Type': `text/${type}`
            }
        };
        
        var req = http.request(options, function(res){
            if(verbose){
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
            }
            
            res.setEncoding('utf8');

            let data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function(){
                console.log('BODY: ' + data);

                resolve(data);
            })

            res.on('error', function(err){
                reject(err);
            })
        });
        
        req.on('error', function(err) {
            reject(err);
            //console.log('problem with request: ' + e.message);
        });

        //create readstream of file
        let readstream = fs.createReadStream(filename);

        readstream.pipe(req);

        // readstream.on('data', (chunk) => {
        //     // write data to request body
        //     req.write(chunk);
        // })

        // readstream.on('end', ()=>{
        //     //finish sending request
        //     req.end();
        // });

        // readstream.on('error', (err) => {
        //     reject(err);
        //     //console.log('ERROR: ' + err);
        // })
    });
}

function getFilesToUpdate(){
 
    return new Promise( function(resolve, reject) {

        fs.readdir("./", function(err, files){

            if(err){
                reject(err);
            }

            let file_list = [];
    
            files.forEach( (file) => {
    
                let type = path.extname(file).substr(1); //remove '.'
    
                if(type === 'js' || type === 'html'){
    
                    file_list.push(file);
                }
                
            });
    
            //console.log("attachments: " + JSON.stringify(attachObj));
    
            resolve(file_list);
        });

    });
}

/**Reads in a list of files from command line and uploads them to couchDB */
function uploadFiles(verbose, path, file_list){
    //getFilesToUpdate()
    return Promise.resolve( file_list )
    
    .then( file_list => {
        
        return file_list.reduce( (chain, file) => {

            return chain.then( () => {

                return getLastRev(path);
            })

            .then( (rev_id) => {
                console.log('file updated: ', file);
                return uploadFile(file, rev_id, verbose, path);

            })

        }, Promise.resolve(''))

    });
}

function stepThroughFiles(){

    let verbose = (process.argv[3] === 'true') ? true : false;
    let file_list = Array.from(process.argv).slice(4);

    uploadFiles(verbose, '/sidewalks/front-end/', file_list)

    .catch( (err) => console.log("Error: ", err) );
}

stepThroughFiles();

module.exports.uploadFiles = uploadFiles;