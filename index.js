let local_db = new PouchDB("sidewalks");
let remote_db = new PouchDB('http://admin:yaz@localhost:5984/sidewalks');

local_db.info().then(function(info){
    console.log(info);
});

remote_db.info().then(function(info){
    console.log(info);
});

console.log("yabababa");