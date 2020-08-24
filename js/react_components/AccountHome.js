'use strict';

import CommentThread from './CommentThread.js';

const e = React.createElement;

let SW_Utils = {

    /**
     * Displays a popup message indicating important app information
     * @param {boolean} usePromise - whether to return Promise-wrapped timeout
     * @param {HTMLElement} element - element that triggered the message
     * @param {String} className - CSS class(es) to apply to element
     * @param {String} msg - message to display
     * @param {Number} timeout - how long to fade out message
     */
    flashMessage(usePromise, element, className, msg, timeout){

        let label = document.createElement('label');
        label.className = className;
        label.innerText = msg;

        let parent = document.body;
        parent.style.position = 'relative';
        parent.appendChild(label);

        label.style.opacity = window.getComputedStyle(label).getPropertyValue('opacity');
        let pageBounds = (document.querySelector('.page') || element.parentElement || element);
        SW_Utils.centerLabelOverElement(pageBounds, element, label);

        timeout = timeout ? timeout : 50;

        if(usePromise === true){
            return new Promise( (resolve) => {
                (function fade(){
                    if((label.style.opacity -= 0.05) <= 0){
                        label.remove();
                        parent.style.position = null;
                        return resolve();
                    }
                    else{ setTimeout(fade, timeout); }
                })();
            });
        }
        
        (function fade(){
            if((label.style.opacity -= 0.05) <= 0){
                label.remove();
                parent.style.position = null;
            }
            else{ setTimeout(fade, timeout); }
        })();
    },

    /**
     * Center an overlay element on top of a base element. Accounts for boundaries from a <body>-level type element
     * @param {HTMLElement} pageBounds - element holding '.page' CSS classname with defines bounds of entire web app
     * @param {HTMLElement} pElement - parent element that triggered the flash message
     * @param {HTMLElement} cElement - label to show on screen relative to parent element
     * @returns {NumberArray} - returns [x,y] pair of final calculated position
     */
    centerLabelOverElement(pageBounds, pElement, cElement){
        
        let pageR = pageBounds.getBoundingClientRect();
        let pR = pElement.getBoundingClientRect();
        let cR = cElement.getBoundingClientRect();

        let x, y;

        if(pR.width > cR.width){
            let diff = (pR.width - cR.width) / 2;
            x = pR.x + diff;
        }
        else if(pR.width < cR.width){
            let diff = (cR.width - pR.width) / 2;
            x = (pR.x - diff);
        }
        else{ x = pR.x; }

        if(pR.height > cR.height){
            let diff = (pR.height - cR.height) / 2;
            y = (pR.y + diff);
        }
        else if(pR.height < cR.height){
            let diff = (cR.height - pR.height) / 2;
            y = (pR.y - diff);
        }
        else{ y = pR.y; }

        x = (x <= pageR.x) ? pR.x : x;
        y = (y <= pageR.y) ? pR.y : y;

        cElement.style.left = x + 'px';
        cElement.style.top = y + 'px';

        return [x,y];
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

    /**
     * Recursively calculate number of comments in a CouchDB document
     * @param {Object} commentThreadDoc - CouchDB formatted object
     */
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

    /**
     * @returns {String} - string formatted largest-grouping first to allow CouchDB query sorting by date
     */
    dateToDbDate(){
        let d = new Date();
        let date = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()+1} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        date += ' ' + d.toTimeString().split(' ').slice(1).join(' '); //adds timezone and any daylight savings info

        return date;
    },

    /**
     * @returns {CSS_RGB_ColorsArray} - returns an array of colors retrieved from CSS variable declarations
     *   for the purpose of styling comment colors in a specific order. First run initializes the array and
     *   all subsequent calls returns same copy of array.
     */
    getColorsArray(){
        let style = getComputedStyle(document.body);
        let colors = [
            style.getPropertyValue('--color_theme_base'),
            style.getPropertyValue('--color_theme_green_11'),
            style.getPropertyValue('--color_theme_red_11'),
            style.getPropertyValue('--color_theme_blue_11'),
            style.getPropertyValue('--color_theme_yellow_11'),
            style.getPropertyValue('--color_theme_purple_11'),
            style.getPropertyValue('--color_theme_gray_11'),

            style.getPropertyValue('--color_theme_green_12'),
            style.getPropertyValue('--color_theme_red_12'),
            style.getPropertyValue('--color_theme_blue_12'),
            style.getPropertyValue('--color_theme_yellow_12'),
            style.getPropertyValue('--color_theme_purple_12'),
            style.getPropertyValue('--color_theme_gray_12'),
            
            style.getPropertyValue('--color_theme_green_13'),
            style.getPropertyValue('--color_theme_red_13'),
            style.getPropertyValue('--color_theme_blue_13'),
            style.getPropertyValue('--color_theme_yellow_13'),
            style.getPropertyValue('--color_theme_purple_13'),
            style.getPropertyValue('--color_theme_gray_13')
        ];

        SW_Utils.getColorsArray = () => colors;

        return colors;
    },

    /**
     * Taken from MDN: 
     *   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values
     *   The maximum is exclusive and the minimum is inclusive
     */
    getRandomInt(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); 
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

            e('img', {className: 'profile__img', src: '/sidewalks/front-end/chalkLogoTwoTanSmall.png'}),

            e('a', {className: 'profile__a'},

                e('p', {className: 'profile__p'}, 'Profile'),

                e('img', {className: 'profile__item', src:'profileCircle2.png'})
            )
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

        .then(msg => SW_Utils.flashMessage(true, element, 'messageLbl', msg) )
            
        .then(() => this.setState({creating: false, threadTitleField:''}) )

        .catch(errMsg => SW_Utils.flashMessage(false, element, 'messageLbl messageLbl--red', errMsg, 80));
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

                e('button', {className:'newThreadBtn', onClick: this.toggleCreateNewThreadState}, 'Create New Thread')
        );
    }
}

class RecentThreads extends React.Component{
    constructor(props){
        super(props);

        this.rootRef = React.createRef();
    }

    componentDidUpdate(){
        let ref = this.rootRef.current;
        if(ref !== undefined){
            if(ref.clientWidth < ref.scrollWidth){
                ref.classList.add('section--flex--indicateScroll')
            }
            else{ ref.classList.remove('section--flex--indicateScroll'); }
        }

    }

    render(){

        let colorsArray = SW_Utils.getColorsArray();
        let cArrLen = colorsArray.length;
        let colorIdx = SW_Utils.getRandomInt(0,cArrLen);
        
        let elements = this.props.queryResults.map( item =>

            e('div', {className:'threadPreview', style:{borderBottom: `2px solid ${colorsArray[(colorIdx++ % cArrLen)]}`}, key:item.key, onClickCapture: e => this.props.loadThread(e,item)},

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

                e('h2', null, 'Recent Threads'),

                e('div', {className:'section section--flex', ref:this.rootRef}, elements)
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
            currentThread: undefined,
            mediaQueryWidthUpdate: false
        };

        //set author for comments
        this.props.DataService.getDB().info()
            .then(res => {
                let hex = res.db_name.split('-');
                hex = hex[ Math.min(hex.length-1, 1) ];
                this.state.author = SW_Utils.hexDecode(hex);
            });
        

        this.createNewCommentInDB = this.createNewCommentInDB.bind(this);
        this.updateCommentLikesInDB = this.updateCommentLikesInDB.bind(this);
        this.loadThread = this.loadThread.bind(this);
        this.createNewThreadInDB = this.createNewThreadInDB.bind(this);
    }

    componentDidMount(){
        
        this.props.DataService.updateRecentThreadsList(undefined)
            .then(queryResults=> this.setState({queryResults: queryResults, currentThreadTitle: undefined}) )
            .catch(err => console.log('Error: ', err) );

        
        const triggerRefresh = () => {
            let toggle = this.state.mediaQueryWidthUpdate;
            this.setState({mediaQueryWidthUpdate: !toggle});
        }
        window.matchMedia("(min-width: 980px)").addListener(triggerRefresh);
        window.matchMedia("(max-width: 870px)").addListener(triggerRefresh);
    }

    createNewThreadInDB(threadTitle){

        let returnMsg;

        return this.props.DataService.createNewThreadInDB(threadTitle, SW_Utils.dateToDbDate())

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

        let date = SW_Utils.dateToDbDate();

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

    updateCommentLikesInDB(id){

        if(!id) return;

        let foundComment = SW_Utils.findMatchingComment(id, this.state.currentThread);

        if(!foundComment.likes){ foundComment.likes = 0; }

        foundComment.likes += 1;

        return this.props.DataService.updateCommentThreadInDB(this.state.currentThread)

            .then(commentThreadDoc => this.setState({currentThread: commentThreadDoc}))

            .catch(err => console.log('Error! Likes value was not updated in DB. ', err));
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

            .catch( err => SW_Utils.flashMessage(false, element, 'messageLbl messageLbl--red', 'Comment thread could not be loaded: ', err, 80) );
        }

    }

    render(){

        let commentThreadElement = ( (this.state.currentThread === undefined) ? 
            e('p', null, 'Nothing to see here...') :
            e(CommentThread, {
                                commentThreadDoc: this.state.currentThread, 
                                createNewCommentInDB: this.createNewCommentInDB,
                                updateCommentLikesInDB: this.updateCommentLikesInDB
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