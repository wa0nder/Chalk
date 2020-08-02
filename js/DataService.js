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

    DataService.prototype.createNewThreadInDB = function(threadTitle){

        return new Promise((resolve, reject) => {

            if(threadTitle.length === 0){
                reject('Must enter a valid thread title!');
            }
    
            let newThread = {
                _id: threadTitle,
                type: 'thread',
                date: Date(),
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
    
        db.put(commentThread)

        .then(() => {

            console.log('new comment saved.')

            return db.get(commentThread._id);
        })
    };

    return new DataService();
}

//export {createLocalDataService, createRemoteDataService};