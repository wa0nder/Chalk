'use strict';

const e = React.createElement;

function flashMessage(element, color, msg){
    //put warning styling in css
    let label = document.createElement('label');
    label.style.backgroundColor = color;
    label.style.color = 'white';
    label.style.opacity = 2.0;
    label.style.position = 'absolute';
    label.style.top = element.getBoundingClientRect().top-5 + 'px';
    label.innerText = msg;
    document.body.appendChild(label);
    
    (function fade(){
        ((label.style.opacity -= 0.05) <= 0) ? label.remove() : setTimeout(fade, 50);
    })()
}

function hexDecode(hexstr){
    let out = "";
    let hexes = hexstr.match(/.{1,2}/g) || [];
    for(let j = 0; j<hexes.length; j++) {
        out += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return out;
}

class NewThreadButton extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            creating: false, 
            threadTitleField: ''
        };

        this.toggleCreateNewThreadState = this.toggleCreateNewThreadState.bind(this);
        this.updateThreadTitleField = this.updateThreadTitleField.bind(this);
        this.createNewThreadInDB = this.createNewThreadInDB.bind(this);
    }

    toggleCreateNewThreadState(){
        
        let flip = !this.state.creating;
        this.setState({creating: flip});
    }

    updateThreadTitleField(event){

        let title = event.target.value;
        this.setState({threadTitleField:title})
    }

    createNewThreadInDB(event){

        let targetElement = event.target;

        let newThread = {
            _id: this.state.threadTitleField,
            type: 'thread',
            date: Date(),
            comments: []
        }

        let db = this.props.local_db;
        db.put(newThread)

        .then( response => {

            if(response.ok === true){

                flashMessage(targetElement, 'black', `'${newThread._id}' thread successfully created!`)

                this.setState({creating: false, threadTitleField:''});
            }
        })

        .catch(err => {

            if(err.status === 409){
                
                flashMessage(targetElement, 'red', 'A thread with this name already exists');
            }

            console.log('Error: ', err.status, '-', err.message, ' : ', err)
        });

        this.props.updateRecentThreadsList(newThread._id);
    }

    render(){

        if(this.state.creating === true){

            return(
                e('div', null, 
                
                    e('input', {type:'text', placeholder:'...enter thread name', value:this.state.threadTitleField, onChange:this.updateThreadTitleField}),

                    e('button', {onClick: this.createNewThreadInDB}, 'OK'),

                    e('button', {onClick: this.toggleCreateNewThreadState}, 'CANCEL')
                )
            );
        }

        return e('button', {onClick: this.toggleCreateNewThreadState}, 'Create New Thread');
    }
}

function CommentThreadPreview(props){

    let threadId = props.commentThreadDoc.key[1];

    return(

        e('p', {className:'recentThreadLinks',onClickCapture: e => props.loadThread(e,props.commentThreadDoc)}, threadId)
    );
}

class RecentThreads extends React.Component{
    constructor(props){
        super(props);
    }

    render(){

        let elements = this.props.queryResults.map( 
            item => e(CommentThreadPreview, {
                key:item.key, 
                commentThreadDoc: item, 
                loadThread: this.props.loadThread, 
                createNewCommentInDB:this.props.createNewCommentInDB
            })
        )

        return(

            e('div', null, 

                e('h2', null, 'Recent Threads'),
                
                e('div', null, elements)
            )
        );
    }
}


class AccountHome extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            queryResults: [],
            currentThreadTitle: undefined,
            currentThread: undefined
        };

        this.local_db = this.props.local_db;

        //set author for comments
        this.local_db.info()
            .then(res => {
                let hex = res.db_name.split('-')[1];
                this.state.author = hexDecode(hex);
            })

        this.updateRecentThreadsList = this.updateRecentThreadsList.bind(this);
        this.createNewCommentInDB = this.createNewCommentInDB.bind(this);
        this.loadThread = this.loadThread.bind(this);
    }

    componentDidMount(){
        this.updateRecentThreadsList(undefined);
    }

    updateRecentThreadsList(threadTitle){

        this.local_db.query('sortThreads', {limit: 4, descending: true})

        .then( result => {
            this.setState({queryResults: result.rows, currentThreadTitle: threadTitle});
        })

        .catch( err => {
            console.log('createNewThreadInDB() Error: ', err.message)
        });
    }

    createNewCommentInDB(text){

        return this.local_db.get(this.state.currentThreadTitle)

        .then( commentThread => {

            commentThread.comments.push( {author: this.state.author, body: text} );

            this.setState({currentThread: commentThread});

            return this.local_db.put(commentThread);
        })

        .then( 
            () => console.log('new comment saved.'),

            (err) => console.log('new comment could not be saved: ', err)
        );
    }

    loadThread(event, commentThreadDoc){

        //console.log("I'm supposed to load a comment here: ", commentThreadDoc);

        let title = commentThreadDoc.key[1];

        if(title != undefined){

            this.local_db.get(title)

            .then( res => {
                //console.log('res: ', res);
                this.setState({currentThreadTitle: title, currentThread: res});
            })

            .catch( err => flashMessage(event.target, 'red', 'Comment thread could not be loaded: ', err) );
        }

    }

    render(){

        let commentThreadElement = ( (this.state.currentThread === undefined) ? 
            e('p', null, 'Nothing to see here...') :
            e(CommentThread, {commentThreadDoc: this.state.currentThread, createNewCommentInDB:this.createNewCommentInDB})
        )

        return(

            e(React.Fragment, null,

                e(NewThreadButton, {local_db: this.props.local_db, updateRecentThreadsList: this.updateRecentThreadsList}),

                e('div', null, 

                    e('h2', null, 'Past Comments')

                ),

                e(RecentThreads, {queryResults: this.state.queryResults, createNewCommentInDB:this.createNewCommentInDB, loadThread:this.loadThread}),

                e('div', null, 

                    e('h2', null, 'Current Thread'),

                    commentThreadElement
                ),
            
            )
        );

    }
}

const domContainer = document.getElementById('HomeComponent');
ReactDOM.render(e(AccountHome, {local_db}), domContainer);