'use strict';

import CommentThread from './CommentThread.js';

const e = React.createElement;

let SW_Utils = {
    flashMessage(element, bgColor, msg, timeout){
        //put warning styling in css
        let label = document.createElement('label');
        label.style.backgroundColor = bgColor;
        label.style.color = 'white';
        label.style.opacity = 2.0;
        label.style.position = 'relative';
        label.style.borderRadius = '5px';
        label.style.padding = '1em';
        label.style.top = '-5px';
        label.innerText = msg;
        element.appendChild(label);

        timeout = timeout ? timeout : 50;
        
        (function fade(){
            ((label.style.opacity -= 0.05) <= 0) ? label.remove() : setTimeout(fade, timeout);
        })();
    },

    hexDecode(hexstr){
        let out = "";
        let hexes = hexstr.match(/.{1,2}/g) || [];
        for(let j = 0; j<hexes.length; j++) {
            out += String.fromCharCode(parseInt(hexes[j], 16));
        }
    
        return out;
    },

    /**
     * 
     * @param {String} path - dash separated list of numbers beginning with 'c_' (e.g. c_1-2-3)
     * @param {Array} commentArray 
     */
    findMatchingComment(path, commentArray){

        path = path.slice(2).split('-').map( num => parseInt(num) );
        
        let comment = commentArray.comments[ path[0] ];
        
        path = path.slice(1);
        for(let idx of path){
        
            if(!comment.comments || comment.comments.length === 0) return undefined;
        
            comment = comment.comments[idx];
        }
        
        return comment;
    },

    getNumComments(commentThreadDoc){

        if(!commentThreadDoc.comments) return 0;

        let num = 0,
            cArray = commentThreadDoc.comments;

        (function countAll(cArray){

            num += cArray.length;
            
            cArray.forEach(comment => {
                if(comment.comments){ countAll(comment.comments); }
            });

        })(cArray);

        return num;
    },

    scrollCalc : {
        calcScrollBarWidth(elem){
            if(elem === null || elem === undefined) return 0;

            //if there is no scrollbar, get element width
            if(elem.clientWidth >= elem.scrollWidth){
                return elem.clientWidth;
            }
    
            let frac = elem.clientWidth / elem.scrollWidth;
            let width = elem.clientWidth * frac;
            //console.log('horizontal scrollbar length: ', width);
            
            return width;
        },
    
        calcScrollBarHeight(elem){
            if(elem === null || elem === undefined) return 0;

            //if no vertical scrollbar, get element height
            if(elem.clientHeight >= elem.scrollHeight){
                return elem.clientHeight;
            }
    
            let frac = elem.clientHeight / elem.scrollHeight;
            let height = elem.clientHeight * frac;
            //console.log('vertical scrollbar length: ', height);
            
            return height;
        },
    
        calcScrollBarX(elem){
            if(elem === null || elem === undefined) return 0;

            let frac = elem.scrollLeft / elem.scrollWidth;
            let scrollX = frac * elem.clientWidth;
            //console.log('scrollX: ', scrollX);
    
            return scrollX;
        },
    
        calcScrollBarY(elem){
            if(elem === null || elem === undefined) return 0;

            let frac = elem.scrollTop / elem.scrollHeight;
            let scrollY = frac * elem.clientHeight;
            //console.log('scrollY: ', scrollY);
    
            return scrollY;
        }
    }
};

function ProfileWidget(){

    return (

        e('div', {className: 'profile'}, 

            e('a', {className: 'profile__item profile__a'}, 'Profile'),

            e('img', {className: 'profile__item', src:'profileCircle.png'})
        )
    );
}

/**
 * Takes a single property
 * @param {Function} props.createNewThreadInDB - calls this self-explanatory function and waits for response
 */
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

        let element = event.target;
        this.props.createNewThreadInDB(this.state.threadTitleField)

        .then((msg) => {
            
            SW_Utils.flashMessage(element.parentElement.parentElement, 'black', msg);
            this.setState({creating: false, threadTitleField:''});
        })

        .catch((errMsg) => SW_Utils.flashMessage(element, 'red', errMsg));
    }

    render(){

        if(this.state.creating === true){

            return(
                e('div', {className: 'section'}, 
                
                    e('input', {className:'section__input', type:'text', placeholder:'...enter thread name', value:this.state.threadTitleField, onChange:this.updateThreadTitleField}),

                    e('button', {style:{display:'inline'}, onClick: this.createNewThreadInDB}, 'OK'),

                    e('button', {onClick: this.toggleCreateNewThreadState}, 'CANCEL')
                )
            );
        }

        return e('div', {className:'section section--neutral'},

                e('button', {className:'btn--margin', onClick: this.toggleCreateNewThreadState}, 'Create New Thread')
        );
    }
}

class RecentThreads extends React.Component{
    constructor(props){
        super(props);
    }

    render(){

        let elements = this.props.queryResults.map( item => 
            
            e('div', {className:'threadPreview', key:item.key, onClickCapture: e => this.props.loadThread(e,item)},

                        e('h3', {className:'threadPreview__title'}, item.id),

                        e('h4', {className:'threadPreview__fullTitle'}, item.id),
                        
                        e('div', {className:'threadPreview__info'}, 

                            e('h3', {className:'threadPreview__info recentThreadLinks'}, new Date(item.key[0]).toDateString().slice(4)),

                            e('h3', {className:'threadPreview__info recentThreadLinks'}, ((item.value.numComments) ? item.value.numComments : 0) + ' Comments')
                        )
            )
        )

        return(

            e(React.Fragment, null, 

                e('h3', null, 'Recent Threads'),

                e('div', {className:'section section--flex'}, elements)
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

        //set author for comments
        this.props.DataService.getDB().info()
            .then(res => {
                let hex = res.db_name.split('-');
                hex = hex[ Math.min(hex.length-1, 1) ];
                this.state.author = SW_Utils.hexDecode(hex);
            });
        

        this.createNewCommentInDB = this.createNewCommentInDB.bind(this);
        this.loadThread = this.loadThread.bind(this);
        this.createNewThreadInDB = this.createNewThreadInDB.bind(this);
    }

    componentDidMount(){

        this.props.DataService.updateRecentThreadsList(undefined)
        .then(queryResults=> this.setState({queryResults: queryResults, currentThreadTitle: undefined}) )
        .catch(err => console.log('Error: ', err) );
    }

    createNewThreadInDB(threadTitle){

        let returnMsg;

        return this.props.DataService.createNewThreadInDB(threadTitle)

        .then((successMsg) => {

            returnMsg = successMsg;
            return this.props.DataService.updateRecentThreadsList(threadTitle)
        })

        .then(queryResult => {
            this.setState({queryResults: queryResult, currentThreadTitle: threadTitle})

            return returnMsg;
        });
    }

    /**
     * Converts comment id into matching comment in database, adds comment to db document, then sends it to db
     * @param {String} id - dash separated string of numbers to locate comment in database (e.g. c_0-0-1-3)
     * @param {String} text - body of comment to add to database
     * @return {Promise}
     */
    createNewCommentInDB(id, text){

        let foundComment = (!id) ? this.state.currentThread : SW_Utils.findMatchingComment(id, this.state.currentThread);

        if(!foundComment.comments){ foundComment.comments = []; }

        let d = new Date();
        let day = d.toDateString().slice(0,3);
        let date = `${d.getMonth()}/${d.getFullYear().toString().slice(2)} ${day} ${d.getHours()%12}:${d.getMinutes()}`;

        foundComment.comments.push({
            at: (foundComment.author || undefined), 
            author: this.state.author, 
            date: date,
            body: text
        });

        let cn = this.state.currentThread.numComments;
        this.state.currentThread.numComments = (cn) ? cn + 1 : 1;

        return this.props.DataService.updateCommentThreadInDB(this.state.currentThread)

        .then(commentThreadDoc => this.setState({currentThread: commentThreadDoc}) );
    }

    /**
     * 
     * @param {*} event 
     * @param {*} commentThreadDoc - CouchDB returns query results as two field object: 
     */
    loadThread(event, commentThreadDoc){

        //console.log("I'm supposed to load a comment here: ", commentThreadDoc);

        let title = commentThreadDoc.key[1];
        let element = event.target;

        if(title != undefined){

            this.props.DataService.getDB().get(title)

            .then( res => {
                //console.log('res: ', res);
                this.setState({currentThreadTitle: title, currentThread: res});
            })

            .catch( err => SW_Utils.flashMessage(element, 'red', 'Comment thread could not be loaded: ', err) );
        }

    }

    render(){

        let commentThreadElement = ( (this.state.currentThread === undefined) ? 
            e('p', null, 'Nothing to see here...') :
            e(CommentThread, {
                                commentThreadDoc: this.state.currentThread, 
                                createNewCommentInDB: this.createNewCommentInDB
                            }
                )
        )

        return(

            e(React.Fragment, null,

                e(ProfileWidget),

                e(NewThreadButton, {createNewThreadInDB: this.createNewThreadInDB}),

                e(RecentThreads, {queryResults: this.state.queryResults, loadThread:this.loadThread}),

                //e('h2', null, (this.state.currentThread === undefined) ? 'No Thread Selected' : this.state.currentThread._id),

                commentThreadElement
            )
        );

    }
}

export {AccountHome, NewThreadButton, RecentThreads, SW_Utils};