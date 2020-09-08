function createLocalDataService(dbName){
    return createDataService( new PouchDB(dbName) );
}

function createRemoteDataService(serverDBHostName, dbHex){

    let db = new PouchDB(`https://${serverDBHostName}:6984/userdb-${dbHex}`, {skip_setup: true});
    return createDataService(db);
}

function createDataService(pouchDBInstance){

    let db = pouchDBInstance;

    function DataService(){}
    
    DataService.prototype.getDB = function(){
        return db;
    };

    DataService.prototype.addDemoThread = function(){

        return new Promise((resolve, reject) => {

            let demoThread = {
                "_id": "Click [Tap] Here!",
                "type": "thread",
                "date": "2020-9-9 15:41:2 GMT-0400 (Eastern Daylight Time)",
                "comments": [
                  {
                    "author": "Bob",
                    "date": "2020-9-9 16:30:6 GMT-0400 (Eastern Daylight Time)",
                    "body": "This is the first top-level comment responding to the thread topic \"Click [Tap] Here!\"",
                    "comments": [
                      {
                        "at": "Bob",
                        "author": "Bob",
                        "date": "2020-9-9 16:31:3 GMT-0400 (Eastern Daylight Time)",
                        "body": "This is a direct reply to the first top-level comment.",
                        "comments": [
                          {
                            "at": "Bob",
                            "author": "Bob",
                            "date": "2020-9-9 16:49:33 GMT-0400 (Eastern Daylight Time)",
                            "body": "This is the second direct reply in the comment chain (responding to the first direct response). \n\nAs you can see, there is a direct line of organization with zero indentation thus preserving the full space for the comment text. "
                          },
                          {
                            "at": "Bob",
                            "author": "Bob",
                            "date": "2020-9-9 16:53:14 GMT-0400 (Eastern Daylight Time)",
                            "body": "Even this far down into the thread, the comment you are responding to (or reading the response to) is always directly overhead. This guarantees very easy and intuitive navigation."
                          }
                        ]
                      },
                      {
                        "at": "Bob",
                        "author": "Bob",
                        "date": "2020-9-9 16:47:8 GMT-0400 (Eastern Daylight Time)",
                        "body": "This is a second direct reply to the first top-level comment. As you can see, the highlighted comments trace out the path of the conversation so you never get lost figuring out who is replying to whom."
                      },
                      {
                        "at": "Bob",
                        "author": "Bob",
                        "date": "2020-9-9 16:51:10 GMT-0400 (Eastern Daylight Time)",
                        "body": "If you notice as you scroll back to the left, comments that have replies show a brief shadow indicator at their bottom edge. This ensures you never miss a reply!"
                      }
                    ]
                  },
                  {
                    "author": "Bob",
                    "date": "2020-9-9 16:30:14 GMT-0400 (Eastern Daylight Time)",
                    "body": "This is the second top-level comment responding to the thread topic \"Click [Tap] Here!\""
                  },
                  {
                    "author": "Bob",
                    "date": "2020-9-9 16:30:32 GMT-0400 (Eastern Daylight Time)",
                    "body": "This is the third (and so on...) top-level comment responding to the thread topic \"Click [Tap] Here!\"",
                    "comments": [
                      {
                        "at": "Bob",
                        "author": "Bob",
                        "date": "2020-9-9 16:57:46 GMT-0400 (Eastern Daylight Time)",
                        "body": "If you've made it this far after exploring all of the other comments, I'd say you've got the hang of it!\n\nYou can add further comments to play around with the mechanism or create your own thread and start from scratch!\n\nSince this is just a demo all running locally in the browser, you are, of course, just replying to yourself. But that means you can say try whatever. \n\nThat means that even if you leave a really long comment like this one, you can click \"Show More\" to view your entire comment.\n\nEnjoy!"
                      }
                    ]
                  }
                ],
                "numComments": 9
              };

            db.put(demoThread)
    
            .then( response => {
    
                if(response.ok === true){

                    resolve(`'${demoThread._id}' thread successfully created!`);
                }
            })
    
            .catch(err => {
    
                if(err.status === 409){
                    
                    reject('A thread with this name already exists');
                }
    
                console.log('Error: ', err.status, '-', err.message, ' : ', err);

                reject('Something else went wrong');
            });

        });
    };

    DataService.prototype.createNewThreadInDB = function(threadTitle, date){

        return new Promise((resolve, reject) => {

            if(threadTitle.length === 0){
                return reject('Must enter a valid thread title!');
            }

            let newThread = {
                _id: threadTitle,
                type: 'thread',
                date: date,
                comments: []
            }
    
            db.put(newThread)
    
            .then( response => {
    
                if(response.ok === true){

                    resolve(`'${newThread._id}' thread successfully created!`);
                }
            })
    
            .catch(err => {
    
                if(err.status === 409){
                    
                    reject('A thread with this name already exists');
                }
    
                console.log('Error: ', err.status, '-', err.message, ' : ', err);

                reject('Something else went wrong');
            });

        });
    };
    
    DataService.prototype.updateRecentThreadsList = function(){

        return new Promise((resolve, reject) => {

            db.query('sortThreads', {limit: 4, descending: true})

            .then( result => resolve(result.rows) )
    
            .catch( err => {
                if(err.message === 'missing'){
                    reject('There are no threads to load.');
                }
                else{ reject('createNewThreadInDB() Error: ', err.message); }
            });
        });

    };
    
    DataService.prototype.updateCommentThreadInDB = function(commentThread){
    
        return db.put(commentThread)

        .then(() => {

            console.log('change successfully uploaded to db.')

            return db.get(commentThread._id);
        });
    };

    return new DataService();
}

//export {createLocalDataService, createRemoteDataService};

let DataService = createRemoteDataService('127.0.0.1','426f62');