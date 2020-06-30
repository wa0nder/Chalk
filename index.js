let local_db = new PouchDB("sidewalks");
let remote_db = new PouchDB('http://admin:yaz@localhost:5984/sidewalks');

local_db.info().then(function(info){
    console.log('local db: ', info);
});

remote_db.info().then(function(info){
    console.log('remote db: ', info);
});


// let doc = {
//     _id: "commentBlock",
//     author: "yaz",
//     content: "Just a sample"
// }

// //local_db.put(doc);

// local_db.get('commentBlock')

//     .then(function (doc) {

//         console.log('returned doc: ', doc);

//         doc.dog = "spotty";

//         local_db.put(doc)

//         .catch(err => {
//             console.log('Error: ', err);
//         })
        
//     })

//     .catch((err) => {
//         console.log('error: ', err);
//     });