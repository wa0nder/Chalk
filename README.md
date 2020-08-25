![Chalk](assets/chalkLogoTwoTanSmall.png?raw=true "Chalk")

~~July 2020 - Warning: this project is in an initial stage of development so anything is up for change.~~

August 2020 - Warning: even though there is now a live working demo of the project (see below), there's still plenty of room to evolve the idea in terms of live-deployment of the app. This, in turn, means there still can be serious breaking changes in terms of underlying technology used.

Information relating to the development process behind the aesthetic choices and technical decisions for this project can be read at my site here: https://www.clarityncode.com/p/1-first-steps.html

Purpose: solve the 'nesting layout issue' which plauges nearly all comment thread systems on the web with a 2D grid comment thread layout. ~~Also the components should update themselves using a local database synced with remote database.~~ In practice, and in terms of underlying technology patterns (e.g. ReactJS), this autonomous aspect didn't work out.

~~It is created in the spirit of a 'CouchApp'* where the website files are attached to the CouchDB database and served from there.~~ * CouchDB's team is still working on integrating a 'per document access' feature so I'll need to add a third, application-layer tier.

*the concept of a 'CouchApp' has been officially abandoned by the CouchDB development team, see here: https://docs.couchdb.org/en/stable/ddocs/.*


Roadmap

* (Completed) Explore and implement technical skeleton of application (software to use, API's to call, authentication scheme, etc.)
.
.
* (Completed) Architect the overall structure of the program (object organization, begin unit tests, etc.)
.
.
* (Completed) Analyze the user experience both from a front-end styling perspective and back-end technical maintenance

## jsFiddle Version

View a fullscreen demo of the app [here](https://jsfiddle.net/waonder/ay1r8opL/5/show). 

*Important!* If you are viewing on a mobile device, only Chromium-based browsers (Chrome, Opera, Vivaldi, Edge, ...) work with jsFiddle + PouchDB. Firefox, due to how it handles CORS, just shows "invalid error". This demo is a browser-based version of the app that only uses a local in-browser DB to run.

## Local Disk Version

If on desktop you can download all files in the 'chalk_local' folder and run the entire app from your local disk.

## CouchDB Version

To get started running a version from a live CouchDB instance follow these steps.
1. clone this project
2. create a 'credentials.txt' file in the root 'sidewalks' folder which **only** contains the username and pass for your CouchDB instance separated by '|' (e.g. user|pass ). **No spaces in the username or password**
3. create a folder at root named 'cert' holding ssl certificates generated following the instructions [here](https://docs.couchdb.org/en/stable/config/http.html#https-ssl-tls-options)
4. start a localhost instance of CouchDB and create a db called 'sidewalks'

at CLI, navigate to 'sidewalks' root folder:

5. type 'npm run build' - this runs webpack
6. type 'npm run update -- js/Components.js' - "update" runs 'updateScriptNodeJS.js' which uploads files to the DB
7. type 'npm run update -- css/index.css css/indexDark.css'
8. type 'npm run update -- js/libs/pouchdb-7.1.1.js'

all shared resources needed by individual user db's are now in the 'sidewalks' db

9. change directory to 'js' subfolder and type 'node httpsSignupServer'
10. visit the localhost address, follow the 'create an account' screens, then use the app!

11. to run the tests, run 'npm run build_tests' then load the file 'AccountHomeTests.html' in a browser.

*Important!* after making any changes to files in 'react_components' folder, run 'npm run build' to run Webpack and get a new 'Components.js' file in the 'js' folder for upload to the 'sidewalks' db using the above 'npm run update -- filename1 filename2 ...' syntax. Any changes to other files that are relevant to loading a website (e.g. html, css) also need to be re-uploaded to the db using 'npm run update -- filename' syntax
