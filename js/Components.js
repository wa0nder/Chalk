/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./js/react_components/CommentBlock.js




const e = React.createElement;

class TextArea extends React.Component {

  render() {

    return e(
      'textarea',
      {className: 'commentBlockTextArea', value: this.props.value, onChange: this.props.onChange},
      this.props.text
    );

  }
}


class CommentBlock_CommentBlock extends React.Component{
  constructor(props){
    super(props);
    
    this.handlePostComment = this.handlePostComment.bind(this);
    this.state = {
      commentText: ''
    }

    this.clearText = this.clearText.bind(this);
    this.handleChangeEvt = this.handleChangeEvt.bind(this);
    this.handleHidePostReplyBox = this.handleHidePostReplyBox.bind(this);
  }

  clearText(element){
    this.setState({commentText:''});

    if(this.props.hidePostReplyBox){
      this.props.hidePostReplyBox(element);
    }
  }

  handleChangeEvt(event){
      this.setState({commentText:event.target.value});
  }

  handlePostComment(event){

    let element = event.target;

    if(this.state.commentText.length === 0){
      AccountHome_SW_Utils.flashMessage(element, 'red', 'Nothing to post!');
      return;
    }

    this.props.handlePostCommentBtnClick(element, this.props.parentId, this.state.commentText, this.clearText);
  }

  handleHidePostReplyBox(event){
    this.props.hidePostReplyBox(event.target);
  }

  render(){

    return(
      e('div', {id: this.props.id, className:this.props.className, style:this.props.style},

        e('h4', null, 'Leave a comment!'),

        e(TextArea, {value: this.state.commentText, onChange: this.handleChangeEvt}, null),

        e('button', {style:{display:'inline'}, onClick:this.handlePostComment}, 'Post Comment'),

        e('button', {style:{display:'inline'}, onClick:this.handleHidePostReplyBox}, 'Cancel')
        
      )
    );

  }
}

/* harmony default export */ var react_components_CommentBlock = (CommentBlock_CommentBlock);
// CONCATENATED MODULE: ./js/react_components/CommentDisplay.js


const CommentDisplay_e = React.createElement;

class CommentDisplay extends React.Component{
    constructor(props){
        super(props);
        
        this.showPostReplyBox = this.showPostReplyBox.bind(this);
        this.hidePostReplyBox = this.hidePostReplyBox.bind(this);

        this.state = {showPostReplyBox: false};
    }

    showPostReplyBox(){
        this.setState({showPostReplyBox: true});
    }

    hidePostReplyBox(elem){
        elem = elem.parentElement;
        elem.style.opacity = window.getComputedStyle(elem).opacity;

        let self = this;

        (function fade(){
            ((elem.style.opacity -= 0.05) <= 0) ? self.setState.call(self,{showPostReplyBox: false}) : setTimeout(fade, 20);
        })();
    }
    
    render(){

        let replyBox = null;
        if(this.state.showPostReplyBox){
            let parent = document.getElementById(this.props.id);
            let gc = parent.style.gridColumn;
            let gr = parent.style.gridRow;
            replyBox = CommentDisplay_e(CommentBlock, 
                {
                    className:'responseBox', 
                    parentId: this.props.id,
                    style:{gridColumn: gc, gridRow: gr},
                    handlePostCommentBtnClick: this.props.handlePostCommentBtnClick,
                    hidePostReplyBox: this.hidePostReplyBox
                });
        }

        return CommentDisplay_e(React.Fragment, null,

                    CommentDisplay_e('div', {id:this.props.id, className:this.props.className, style:this.props.style},

                        (!this.props.comment.at) ? null : CommentDisplay_e('h4', null, `@${this.props.comment.at}`),

                        CommentDisplay_e('h4', null, `Author: ${(this.props.comment.author || 'none')}`),

                        CommentDisplay_e('p', {className:'commentBody'}, this.props.comment.body),

                        CommentDisplay_e('button', {onClick: this.showPostReplyBox}, 'Reply')

                    ),
                    replyBox
                );
    }
}

/* harmony default export */ var react_components_CommentDisplay = (CommentDisplay);
// CONCATENATED MODULE: ./js/react_components/CommentGrid.js




const CommentGrid_e = React.createElement;

class CommentGrid_CommentGrid extends React.Component{
  constructor(props){
    super(props);

    this.state = {currentCommentId: undefined};
    
    this.loadChildComments = this.loadChildComments.bind(this);
    this.handleScrollEvents = this.handleScrollEvents.bind(this);
  }

  componentDidMount(){
    this.handlePostRender('0');
  }

  handleScrollEvents(event){

    this.loadChildComments(event);
  }

  loadChildComments (event){

    let elem = event.target;

    let div = this.findHighlightedComment(elem);
    
    if(div !== undefined && div.id !== this.state.currentCommentId){

      let found = SW_Utils.findMatchingComment(div.id, this.props.commentThreadDoc);

      //console.log('found: ', div.id, ' : ', found);
      
      if(found !== undefined){

        //de-highlight old comment
        if(this.state.currentCommentId !== undefined){
          document.getElementById(this.state.currentCommentId).style.borderColor = null;
        }

        this.setState({currentCommentId: div.id}, this.handlePostRender);
      }
      
    }
  }

  /**
   * Find leftmost (first) element in current row where row is calculated by vertical scrollbar position.
   * @param {*} elem 
   */
  findHighlightedComment(elem){

    let gridElem = (elem.className === 'container') ? elem.firstElementChild : elem;
    let gridRect = gridElem.getBoundingClientRect();
    let childRect = gridElem.firstElementChild.getBoundingClientRect();
    let height;

    //the vertical scrollbar is being used
    if(elem.className === 'container'){
      let scrollbarHeight = SW_Utils.scrollCalc.calcScrollBarHeight(elem);
      let scrollY = SW_Utils.scrollCalc.calcScrollBarY(elem);
      let containerRect = elem.getBoundingClientRect();

      height = containerRect.y + scrollY + (scrollbarHeight / 2);
    }
    else{ height = gridRect.y + childRect.height / 2; }

    //console.log('elem: ', elem, '\nfirst child- ', gridElem.firstElementChild, '\ngridRect- ', gridRect, '\nchildRect- ', childRect);

    let xt = gridRect.x + (childRect.width/2);
    let yt = height;

    //console.log('offsets: ', xt, ' : ', yt);

    let elements = document.elementsFromPoint(xt,yt);

    //console.log('elements: ', elements);

    return elements.find(e => e.className === 'commentBox');
  }

  handlePostRender(id){

    id = (id) ? id : this.state.currentCommentId;

    let div = document.getElementById(id);

    if(div !== null){

      this.tintComments(div);

      this.setScrollToEndMargin();
    }
    
  }

  /**
   * Tint all comments except highlighted comment and its immediate child comments, which is next grid row
   * @param {*} commentDiv 
   */
  tintComments(currComment){
    
    let grid = currComment.parentElement;
    let gridsContainer = grid.parentElement;
    let gridsConChildren = Array.from(gridsContainer.children);
    let end = gridsConChildren.findIndex(item => item === grid) + 1;

    function getDiv(item){
      let e = document.createElement('div');
      e.id = 'tint_'+item.id;
      e.className = 'commentBoxTint';
      e.style.gridRow = 1;
      e.style.gridColumn = item.style.gridColumn;
      return e;
    }

    //for each grid row
    for(let j=1, i=0; i<end; i++){

      let currId = currComment.id.slice(0,j+(2*i));
      
      let gridRow = gridsConChildren[i];

      Array.from(gridRow.children).forEach(item => {

        if(item.className === 'commentBoxTint' || item.className === 'commentBoxBlank') return;

        if(item.id === currComment.id){ 
          item.style.borderColor = 'red'; 
        }
        
        if(item.id === currId){
          let getElem = document.getElementById('tint_'+currId);
          if(getElem !== null) getElem.remove();
        }
        else if(item.id !== currId && document.getElementById('tint_'+item.id) === null){
          gridRow.appendChild( getDiv(item) );
        }
      });

      //clear immediate following row
      if(end < gridsConChildren.length){
        Array.from(gridsConChildren[end].children).forEach(item =>{
          let getElem = document.getElementById('tint_'+item.id);
          if(getElem !== null) getElem.remove();
        });
      }
      
    }
    
  }

  setScrollToEndMargin(){
    
    if(this.state.currentCommentId === undefined){ return; }

    let elem = document.getElementById(this.state.currentCommentId);
    let childRect = elem.getBoundingClientRect();
    let gridElem = elem.parentElement;

    //paddind has already occurred
    //console.log('gridElem: ', gridElem, ' - ', gridElem.lastElementChild);
    if(Array.from(gridElem.children).some(item => item.className === 'commentBoxBlank')){ return; }

    let multiplier = Math.floor(gridElem.clientWidth / childRect.width);
    let offset = gridElem.children.length;

    for(let i=0; i<multiplier; i++){

      let e = document.createElement(elem.tagName.toLowerCase());
      e.className = 'commentBoxBlank';
      e.style.opacity = 0;
      e.style.gridRow = elem.style.gridRow;
      e.style.gridColumn = offset + i + 1;

      gridElem.appendChild(e);
    }

    //console.log('margin calc: ', multiplier, ' : ', elem);
  }

  renderComments(path, commentArray){

    path = (path === undefined) ? '0' : path;

    if(!commentArray || commentArray.length === 0) return null;

    let elements = [],
      reactRowNum = 0;

    //render top-level comments
    elements.push( this.renderRow(reactRowNum++, '', commentArray) );

    path = path.split('-').map(item => parseInt(item));
    let holdPath = '';

    for(let idx of path){

      holdPath += idx + '-';

      if(!commentArray[idx].comments || commentArray[idx].comments.length === 0) return elements;

      commentArray = commentArray[idx].comments;

      elements.push( this.renderRow(reactRowNum++, holdPath, commentArray) );
    }

    //render vertical responses
    while(commentArray[0].comments && commentArray[0].comments.length > 0){

      holdPath += '0-';

      commentArray = commentArray[0].comments;

      elements.push( this.renderRow(reactRowNum++, holdPath, commentArray, true) );
    }

    return elements;
  }

  renderRow(reactRowNum, path, commentArray){
    return this.renderRow(reactRowNum, path, commentArray, false);
  }

  renderRow(reactRowNum, path, commentArray, renderFirstOnly){
    
    if(renderFirstOnly) commentArray = commentArray.slice(0,1);

    let rowPos = 0;
    let items = commentArray.map( comment => {
  
      let id = `${path}${rowPos++}`;

      return CommentGrid_e(react_components_CommentDisplay, {
                        key: 'k_'+id,
                        id: id,
                        className: 'commentBox', 
                        style:{
                          gridRow: 1,
                          gridColumn: rowPos
                        },
                        comment: comment,
                        onClick: this.loadChildComments,
                        handlePostCommentBtnClick: this.props.handlePostCommentBtnClick
                      }
                )
    });

    return CommentGrid_e('div', {key:reactRowNum, className: 'grid'}, items);
  }

  render(){

    let comments = this.renderComments(this.state.currentCommentId, this.props.commentThreadDoc.comments);

    return (
      CommentGrid_e('div', {className:'container',onScroll: this.handleScrollEvents}, comments)
    );
  }
}

/* harmony default export */ var react_components_CommentGrid = (CommentGrid_CommentGrid);
// CONCATENATED MODULE: ./js/react_components/CommentThread.js





const useState = React.useState, 
      useEffect = React.useEffect;

const CommentThread_e = React.createElement;

class CommentThread_CommentThread extends React.Component{
  constructor(props){
    super(props);

    this.handlePostCommentBtnClick = this.handlePostCommentBtnClick.bind(this);
  }

  

  handlePostCommentBtnClick(targetElement, parentId, commentText, clearTextCallback){

    const text = commentText;

    // let update = this.state.dbComments.concat( [{body: text}] );
    // this.setState( {dbComments: update} );

    this.props.createNewCommentInDB(parentId, text)

    .then( () => clearTextCallback(targetElement) )

    .catch( err => console.log('handlePostCommentBtnClick() This is not supposed to happen: ', err) );
  }

  render(){

    return(

      CommentThread_e(React.Fragment, null, 

        CommentThread_e('h3', null, this.props.commentThreadDoc._id),

        CommentThread_e(react_components_CommentBlock, {parentId: undefined, handlePostCommentBtnClick:this.handlePostCommentBtnClick}),

        CommentThread_e('h4', null, 'Comments:'),

        CommentThread_e(react_components_CommentGrid, {
                        commentThreadDoc:this.props.commentThreadDoc, 
                        loadChildComments:this.props.loadChildComments,
                        handlePostCommentBtnClick:this.handlePostCommentBtnClick
                      })
      )
    );
  }
}

/* harmony default export */ var react_components_CommentThread = (CommentThread_CommentThread);
// CONCATENATED MODULE: ./js/react_components/AccountHome.js




const AccountHome_e = React.createElement;

let AccountHome_SW_Utils = {
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

    findMatchingComment(path, commentArray){

        path = path.split('-').map( num => parseInt(num) );
        
        let comment = commentArray.comments[ path[0] ];
        
        path = path.slice(1);
        for(let idx of path){
        
            if(!comment.comments || comment.comments.length === 0) return undefined;
        
            comment = comment.comments[idx];
        }
        
        return comment;
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

/**
 * Takes two outside properties
 * @param {Function} props.createNewThreadInDB - reference of db object
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
            
            AccountHome_SW_Utils.flashMessage(element.parentElement.parentElement, 'black', msg);
            this.setState({creating: false, threadTitleField:''});
        })

        .catch((errMsg) => AccountHome_SW_Utils.flashMessage(element, 'red', errMsg));
    }

    render(){

        if(this.state.creating === true){

            return(
                AccountHome_e('div', null, 
                
                    AccountHome_e('input', {type:'text', placeholder:'...enter thread name', value:this.state.threadTitleField, onChange:this.updateThreadTitleField}),

                    AccountHome_e('button', {style:{display:'inline-block'}, onClick: this.createNewThreadInDB}, 'OK'),

                    AccountHome_e('button', {style:{display:'inline-block'}, onClick: this.toggleCreateNewThreadState}, 'CANCEL')
                )
            );
        }

        return AccountHome_e('button', {onClick: this.toggleCreateNewThreadState}, 'Create New Thread');
    }
}

function CommentThreadPreview(props){

    let threadId = props.commentThreadDoc.key[1];

    return(

        AccountHome_e('p', {className:'recentThreadLinks',onClickCapture: e => props.loadThread(e,props.commentThreadDoc)}, threadId)
    );
}

class RecentThreads extends React.Component{
    constructor(props){
        super(props);
    }

    render(){

        let elements = this.props.queryResults.map( 
            item => AccountHome_e(CommentThreadPreview, {
                key:item.key, 
                commentThreadDoc: item, 
                loadThread: this.props.loadThread
            })
        )

        return(

            AccountHome_e('div', null, 

                AccountHome_e('h2', null, 'Recent Threads'),
                
                AccountHome_e('div', null, elements)
            )
        );
    }
}


class AccountHome_AccountHome extends React.Component{

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
                let hex = res.db_name.split('-')[1];
                this.state.author = AccountHome_SW_Utils.hexDecode(hex);
            });
        

        this.createNewCommentInDB = this.createNewCommentInDB.bind(this);
        this.loadThread = this.loadThread.bind(this);
        this.createNewThreadInDB = this.createNewThreadInDB.bind(this);
        //this.loadChildComments = this.loadChildComments.bind(this);
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

    createNewCommentInDB(id, text){

        let foundComment = (!id) ? this.state.currentThread : AccountHome_SW_Utils.findMatchingComment(id, this.state.currentThread);

        if(!foundComment.comments){ foundComment.comments = []; }

        foundComment.comments.push({
            at: (foundComment.author || undefined), 
            author: this.state.author, 
            body: text
        });

        this.props.DataService.updateCommentThreadInDB(this.state.currentThread)

        .then(commentThreadDoc => this.setState({currentThread: commentThreadDoc}) )

        .catch(err => console.log('new comment could not be saved: ', err));
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

            .catch( err => AccountHome_SW_Utils.flashMessage(element, 'red', 'Comment thread could not be loaded: ', err) );
        }

    }

    render(){

        let commentThreadElement = ( (this.state.currentThread === undefined) ? 
            AccountHome_e('p', null, 'Nothing to see here...') :
            AccountHome_e(react_components_CommentThread, {
                                commentThreadDoc: this.state.currentThread, 
                                createNewCommentInDB: this.createNewCommentInDB
                                //loadChildComments: this.loadChildComments
                            }
                )
        )

        return(

            AccountHome_e(React.Fragment, null,

                AccountHome_e(NewThreadButton, {createNewThreadInDB: this.createNewThreadInDB}),

                AccountHome_e('div', null, 

                    AccountHome_e('h2', null, 'Past Comments')

                ),

                AccountHome_e(RecentThreads, {queryResults: this.state.queryResults, loadThread:this.loadThread}),

                AccountHome_e('div', null, 

                    AccountHome_e('h2', null, 'Current Thread'),

                    commentThreadElement
                ),
            
            )
        );

    }
}


// CONCATENATED MODULE: ./js/react_components/Root.js





const domContainer = document.getElementById('HomeComponent');
ReactDOM.render(React.createElement(AccountHome_AccountHome, {DataService}), domContainer);

/***/ })
/******/ ]);