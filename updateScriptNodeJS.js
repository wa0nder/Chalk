const http = require('http');
const fs = require('fs');
const path = require('path');

function getLastRev(){

    return new Promise( function(resolve, reject){

        http.get('http://admin:yaz@127.0.0.1:5984/sidewalks/front-end/', (resp) => {
            let data = '';
          
            // A chunk of data has been received.
            resp.on('data', (chunk) => {
              data += chunk;
            });
          
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                let json = JSON.parse(data);
                console.log("returned json: " + data);

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

function uploadFile(filename, rev){

    return new Promise( function(resolve, reject){

        //create request object
        var options = {
            host: 'localhost',
            port: 5984,
            path: `/sidewalks/front-end/${filename}?rev=${rev}`,
            method: 'PUT',
            auth: 'admin:yaz'
        };
        
        var req = http.request(options, function(res){
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
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
function stepThroughFiles(){

    //getFilesToUpdate()

    Promise.resolve( Array.from(process.argv).slice(2) )
    
    .then( (file_list) => {
        
        file_list.reduce( (chain, file) => {

            return chain.then( () => {

                return getLastRev();
            })

            .then( (rev_id) => {
                console.log('file updated: ', file);
                return uploadFile(file, rev_id);

            })

        }, Promise.resolve(''))

        .catch( (err) => console.log("Error: ", err) );

    })

    .catch( (err) => console.log("Error: ", err) );;
    
}

stepThroughFiles();
