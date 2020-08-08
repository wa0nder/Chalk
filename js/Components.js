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

/** Expects one and five optional parameters in the props object
 * 
 * @param {Function} createNewCommentInDB - self-explanatory
 * @param {Function} hidePostReplyBox - optional - self-explanatory, only needed when appearing on a parent comment
 * @param {String} parentId - optional - if present it is the id of comment one is replying to
 * @param {String} className - optional - if present applies CSS style
 * @param {String} style.gridRow - optional - allows attachment to parent comment grid row
 * @param {String} style.gridColumn - optional - allows attachment to parent comment grid column
 */
class CommentBlock_CommentBlock extends React.Component{
  constructor(props){
    super(props);
    
    this.state = {
      commentText: ''
    }

    this.handlePostComment = this.handlePostComment.bind(this);
    this.handleChangeEvt = this.handleChangeEvt.bind(this);
    this.clearText = this.clearText.bind(this);
  }

  clearText(element){
    this.setState({commentText:''});

    if(this.props.hidePostReplyBox){
      this.props.hidePostReplyBox(undefined, element);
    }
  }

  handleChangeEvt(event){
    this.setState({commentText:event.target.value});
  }

  handlePostComment(event){

    let element = event.target;

    if(this.state.commentText.length === 0){
      SW_Utils.flashMessage(element, 'red', 'Nothing to post!');
      return;
    }

    this.props.createNewCommentInDB(this.props.parentId, this.state.commentText)

    .then( () => this.clearText(element) )

    .catch( err => console.log('handlePostComment() This is not supposed to happen: ', err) );
  }

  render(){

    return(
      e('div', {className:this.props.className, style:this.props.style},

        e('h4', null, 'Leave a comment!'),

        e('textarea', {
                        className: 'commentBlockTextArea', 
                        value: this.state.commentText, 
                        onChange: this.handleChangeEvt}
        ),

        e('button', {style:{display:'inline'}, onClick:this.handlePostComment}, 'Post Comment'),

        e('button', {style:{display:'inline'}, onClick:this.props.hidePostReplyBox}, 'Cancel')
        
      )
    );

  }
}

/* harmony default export */ var react_components_CommentBlock = (CommentBlock_CommentBlock);
// CONCATENATED MODULE: ./js/react_components/CommentDisplay.js




const CommentDisplay_e = React.createElement;

/** Expects six properties from the props object
 * @param {String} id - used to connect rendered comment to specific comment in DB document
 * @param {String} className - for applying CSS class
 * @param {Number} style.gridRow - to render matching parent gridRow position
 * @param {Number} style.gridColumn - to render matching parent gridColumn position
 * @param {Object} comment - object holding comment data schema from database (at, author, date, body, ...)
 * @param {Function} createNewCommentInDB - self-explanatory function call needed for passing to CommentBlock
 */
class CommentDisplay_CommentDisplay extends React.Component{
    constructor(props){
        super(props);
        
        this.showPostReplyBox = this.showPostReplyBox.bind(this);
        this.hidePostReplyBox = this.hidePostReplyBox.bind(this);
        this.showContent = this.showContent.bind(this);

        this.state = {showPostReplyBox: false, showOverflowBtn: false};
    }

    componentDidMount(){
        this.applyOverflowButton();
    }

    applyOverflowButton(){

        let c = document.querySelector('#'+this.props.id);
        let body = c.querySelector('.commentBox__body');

        if(body.clientHeight < body.scrollHeight){

            this.setState({showOverflowBtn: true});
        }
    }

    showContent(event){
        //event.target.style.ov
    }

    showPostReplyBox(){
        this.setState({showPostReplyBox: true});
    }

    /**
     * Expects event OR element depending on calling function
     * @param {Event} event - if undefined, use element parameter, otherwise event.target
     * @param {HTMLElement} element
     */
    hidePostReplyBox(event, element){
        let elem = (event !== undefined) ? event.target : element;
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
            replyBox = CommentDisplay_e(react_components_CommentBlock, {
                            className:'responseBox', 
                            parentId: this.props.id,
                            style:{gridColumn: gc, gridRow: gr},
                            createNewCommentInDB:this.props.createNewCommentInDB,
                            hidePostReplyBox: this.hidePostReplyBox
                        }
                    );
        }

        let comment = this.props.comment;

        return CommentDisplay_e(React.Fragment, null,

            CommentDisplay_e('div', {id:this.props.id, className:this.props.className, style:this.props.style},

                CommentDisplay_e('div', {className: 'commentBox__header'},

                    CommentDisplay_e('div', {className: 'commentBox__header__info'},

                        (!comment.at) ? null : CommentDisplay_e('p', null, `⮬  @${comment.at}`),

                        CommentDisplay_e('p', null, `${(comment.author || 'Anon')}`),

                        CommentDisplay_e('p', null, (comment.date || 'date'))
                    ),

                    CommentDisplay_e('img', {className: 'profile__item', src:'profileCircle.png'})
                ),

                CommentDisplay_e('p', {className:'commentBox__body'}, comment.body),

                ((this.state.showOverflowBtn) ? CommentDisplay_e('button', {className:'commentBox__showMoreLbl', onClick:this.showContent}, 'Show More') : null),

                CommentDisplay_e('div', {className:'commentBox__actions'},

                    CommentDisplay_e('div', {className:'commentBox__actions__likes'},

                        CommentDisplay_e('p', {style:{display:'inline'}}, (comment.likes) ? comment.likes : '0'),

                        CommentDisplay_e('button', null, 'Like'),

                    ),

                    CommentDisplay_e('button', {onClick: this.showPostReplyBox}, 'Reply')

                ),
            ),

            replyBox
        );

        // return return e(React.Fragment, null,

        //             e('div', {id:this.props.id, className:this.props.className, style:this.props.style},

        //                 (!this.props.comment.at) ? null : e('h4', null, `@${this.props.comment.at}`),

        //                 e('h4', null, `Author: ${(this.props.comment.author || 'none')}`),

        //                 e('p', {className:'commentBody'}, this.props.comment.body),

        //                 e('button', {onClick: this.showPostReplyBox}, 'Reply')

        //             ),
        //             replyBox
        //         );
    }
}

/* harmony default export */ var react_components_CommentDisplay = (CommentDisplay_CommentDisplay);
// CONCATENATED MODULE: ./js/react_components/CommentGrid.js





const CommentGrid_e = React.createElement;

/**
 * Expects two properties passed in props object
 * @param {Object} commentThreadDoc - CouchDB document
 * @param {Function} createNewCommentInDB - self-explanatory function to be passed to CommentDisplay
 */
class CommentGrid_CommentGrid extends React.Component{
  constructor(props){
    super(props);

    this.state = {currentCommentId: undefined};
    this.currentThreadId = this.props.commentThreadDoc._id;
    
    this.loadChildComments = this.loadChildComments.bind(this);
    this.handleScrollEvents = this.handleScrollEvents.bind(this);
  }

  componentDidMount(){
    this.handlePostRender('c_0');
  }

  componentDidUpdate(){
    this.clearOldTints();
  }

  handleScrollEvents(event){

    this.loadChildComments(event);
  }

  loadChildComments(event){

    let elem = event.target;

    let div = this.findHighlightedComment(elem);
    
    if(div !== undefined && div.id !== this.state.currentCommentId){

      let found = SW_Utils.findMatchingComment(div.id, this.props.commentThreadDoc);

      //console.log('found: ', div.id, ' : ', found);
      
      if(found !== undefined){

        //de-highlight old comment
        if(this.state.currentCommentId !== undefined){

          let old = document.getElementById(this.state.currentCommentId);
          
          if(old !== null){ old.style.borderWidth = null; }
        }

        this.setState({currentCommentId: div.id}, this.handlePostRender);
      }
      
    }
  }

  /**
   * Find leftmost (first) element in current row where row is calculated by vertical scrollbar position.
   * @param {HTMLElement} elem - CSS Grid container parent element
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

      this.clearOldTints(div);

      this.tintComments(div);

      this.setScrollToEndMargin();
    }
    
  }

  /**
   * Tint all comments except highlighted comment and its immediate child comments, 
   *  which is next grid row
   * @param {HTMLElement} currComment - HTML 'div' element
   */
  tintComments(currComment){
    
    let grid = currComment.parentElement;
    let gridsContainer = grid.parentElement;
    let gridsConChildren = Array.from(gridsContainer.children);
    let end = gridsConChildren.findIndex(item => item === grid) + 1;

    function getTintDiv(item){
      let e = document.createElement('div');
      e.id = 'tint_'+item.id.slice(2);
      e.className = 'commentBox--tint';
      e.style.gridRow = 1;
      e.style.gridColumn = item.style.gridColumn;
      return e;
    }
    
    //for each grid row
    let baseId = currComment.id.slice(2); //remove 'c_'
    for(let i=0; i<end; i++){
      
      let currPathId = baseId.slice(0,1+(2*i));
      
      let gridRow = gridsConChildren[i];

      Array.from(gridRow.children).forEach(item => {

        if(item.className === 'commentBox--tint' || item.className === 'commentBox--blank') return;

        if(item.id === currComment.id){ 
          item.style.borderWidth = '6px'; 
        }
        
        let id = item.id.slice(2);
        if(id === currPathId){

          let getElem = document.getElementById('tint_'+currPathId);

          if(getElem !== null){ getElem.remove(); }
        }
        else if(id !== currPathId && document.getElementById('tint_'+id) === null){

          gridRow.appendChild( getTintDiv(item) );
        }
        
      });

      //clear immediate following row
      if(end < gridsConChildren.length){

        Array.from(gridsConChildren[end].children).forEach(item =>{

          let getElem = document.getElementById('tint_'+item.id.slice(2));

          if(getElem !== null){ getElem.remove(); }
        });
      }
      
    }
    
  }

  /**
   * Adds empty comment boxes to extend scrollbar range. 
   *  This allows ending comments to be scrolled to far left of parent container
   *  for highlighting.
   */
  setScrollToEndMargin(){
    
    if(this.state.currentCommentId === undefined){ return; }

    let elem = document.getElementById(this.state.currentCommentId);
    let childRect = elem.getBoundingClientRect();
    let gridElem = elem.parentElement;

    //padding has already occurred
    //console.log('gridElem: ', gridElem, ' - ', gridElem.lastElementChild);
    if(Array.from(gridElem.children).some(item => item.className === 'commentBox--blank')){ return; }

    let multiplier = Math.floor(gridElem.clientWidth / childRect.width);
    let offset = gridElem.children.length;

    for(let i=0; i<multiplier; i++){

      let e = document.createElement(elem.tagName.toLowerCase());
      e.className = 'commentBox--blank';
      e.style.opacity = 0;
      e.style.gridRow = elem.style.gridRow;
      e.style.gridColumn = offset + i + 1;

      gridElem.appendChild(e);
    }

    //console.log('margin calc: ', multiplier, ' : ', elem);
  }

  /**
   * Tinting is manually added on top of react generated components and must be managed
   * as different comment threads, and thus different number of comments, are loaded. This function
   * checks for matching underlying comment box using id = 'tint_[id]', if none found the tint is removed.
   */
  clearOldTints(){

    if(this.props.commentThreadDoc._id === this.currentThreadId){ return; }
    
    this.currentThreadId = this.props.commentThreadDoc._id;

    let gridsContainer = document.querySelector('.container');
    let gridsConChildren = Array.from(gridsContainer.children);

    gridsConChildren.forEach(row => {

      Array.from(row.children).forEach(commentDiv => {

        let id = 'c_' + commentDiv.id.slice(5); //remove 'tint_' prefix
        if(commentDiv.className === 'commentBox--tint' && row.querySelector('#'+id) === null){
          commentDiv.remove();
        }
      })
    });

  }

  checkForThreadChange(path){

    if(this.currentThreadId !== this.props.commentThreadDoc._id){

      document.querySelector('.container').scrollTo(0,0);
      let cg = document.querySelector('.container__grid');
      if(cg !== null){ cg.scrollTo(0,0); }

      return 'c_0';
    }

    return path;
  }

  renderComments(path, commentArray){

    path = (path === undefined || path === null) ? 'c_0' : path;

    path = this.checkForThreadChange(path);

    path = path.slice(2).split('-').map(item => parseInt(item));

    if(!commentArray || commentArray.length === 0) return null;

    let state = {
      elements: [],
      reactRowNum: 0,
      holdPath: '',
      path,
      commentArray,
    }

    //render top-level comments
    state.elements.push( this.renderRow(state.reactRowNum++, '', state.commentArray) );

    state = this.renderResponseRowsOfEachCommentOnPath(state);

    if(state.end){ return state.elements; }

    let elements = this.renderVerticalResponses(state);

    return elements;
  }

  /**
   * For every comment referenced in 'path', generate row of direct response comments
   * @param {Object} state - contains five parameters
   * @param {Number} state.reactRowNum - serves as key id for react lists
   * @param {String} state.path - dash separate list of numbers indicating where comments are found in DB
   * @param {String} state.holdPath - holds how far into full render 'path' 
   * @param {Array} state.commentArray - array holding comment objects (author, comment body, etc.)
   * @param {Array} state.elements - an array of React Components holding lists of components
   * @returns {Object} - returns either a two element array containing an 'end' parameter to signal
   *  that there is nothing left to render or the full state object for further rendering
   */
  renderResponseRowsOfEachCommentOnPath({reactRowNum, path, holdPath, commentArray, elements}){

    for(let idx of path){

      holdPath += idx + '-';

      if(!commentArray[idx].comments || commentArray[idx].comments.length === 0){
        return {'end':true, elements};
      }

      commentArray = commentArray[idx].comments;

      elements.push( this.renderRow(reactRowNum++, holdPath, commentArray) );
    }

    return {reactRowNum, path, holdPath, commentArray, elements};
  }

  renderVerticalResponses({reactRowNum, holdPath, commentArray, elements}){

    while(commentArray[0].comments && commentArray[0].comments.length > 0){

      holdPath += '0-';

      commentArray = commentArray[0].comments;

      elements.push( this.renderRow(reactRowNum++, holdPath, commentArray, true) );
    }

    return elements;
  }

  /**
   * Renders an entire row of top-level response comments. 
   *  See 'renderRow(reactRowNum, path, commentArray, renderFirstOnly)' for documentation
   */
  renderRow(reactRowNum, path, commentArray){
    return this.renderRow(reactRowNum, path, commentArray, false);
  }

  /**
   * Renders an entire row of top-level response comments
   * @param {Number} reactRowNum - serves as key id for react lists
   * @param {String} path - dash '-' separated string of numbers holding path to find a specific comment
   * @param {Array} commentArray - array of comment objects
   * @param {Boolean} renderFirstOnly - only render first comment of a row of comments
   * @returns {ReactComponent} - a react component holding a list of CommentDisplay elements
   */
  renderRow(reactRowNum, path, commentArray, renderFirstOnly){
    
    if(renderFirstOnly) commentArray = commentArray.slice(0,1);

    let rowPos = 0;
    let items = commentArray.map( comment => {
  
      let id = `${path}${rowPos++}`;

      return CommentGrid_e(react_components_CommentDisplay, {
                        key: 'k_'+id,
                        id: 'c_'+id,
                        className: 'commentBox', 
                        style:{
                          gridRow: 1,
                          gridColumn: rowPos
                        },
                        comment: comment,
                        onClick: this.loadChildComments,
                        createNewCommentInDB:this.props.createNewCommentInDB
                      }
                )
    });

    return CommentGrid_e('div', {key:reactRowNum, className: 'container__grid'}, items);
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





const CommentThread_e = React.createElement;

class CommentThread_CommentThread extends React.Component{
  constructor(props){
    super(props);

    this.state = {showBlock: false};

    this.toggleShowCommentBlock = this.toggleShowCommentBlock.bind(this);
  }

  toggleShowCommentBlock(){

    let state = this.state.showBlock;
    
    this.setState({showBlock:!state});
  }

  render(){
    
    let date = new Date(this.props.commentThreadDoc.date);

    return(

      CommentThread_e(React.Fragment, null, 
  
        CommentThread_e('h3', null, this.props.commentThreadDoc._id),
  
        CommentThread_e('h4', null, date.toDateString()),
  
        CommentThread_e('h4', null, `${this.props.commentThreadDoc.numComments} Comments`),
  
        ( (this.state.showBlock) ? 
  
          CommentThread_e(react_components_CommentBlock, {createNewCommentInDB:this.props.createNewCommentInDB, hidePostReplyBox:this.toggleShowCommentBlock}) :
  
          CommentThread_e('button', {onClick:this.toggleShowCommentBlock}, 'Leave a comment!')),
  
        CommentThread_e(react_components_CommentGrid, {
                        commentThreadDoc:this.props.commentThreadDoc,
                        createNewCommentInDB:this.props.createNewCommentInDB
                      })
      )
    );
  }
}

/* harmony default export */ var react_components_CommentThread = (CommentThread_CommentThread);
// CONCATENATED MODULE: ./js/react_components/AccountHome.js




const AccountHome_e = React.createElement;

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

function ProfileWidget(props){

    return (

        AccountHome_e('div', {className: 'profile'}, 

            AccountHome_e('a', {className: 'profile__item profile__a'}, 'Profile'),

            AccountHome_e('img', {className: 'profile__item', src:'profileCircle.png'})
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
                AccountHome_e('div', {className: 'section'}, 
                
                    AccountHome_e('input', {type:'text', placeholder:'...enter thread name', value:this.state.threadTitleField, onChange:this.updateThreadTitleField}),

                    AccountHome_e('button', {style:{display:'inline-block'}, onClick: this.createNewThreadInDB}, 'OK'),

                    AccountHome_e('button', {style:{display:'inline-block'}, onClick: this.toggleCreateNewThreadState}, 'CANCEL')
                )
            );
        }

        return AccountHome_e('button', {className:'btn--red', onClick: this.toggleCreateNewThreadState}, 'Create New Thread');
    }
}

class RecentThreads extends React.Component{
    constructor(props){
        super(props);
    }

    render(){

        let elements = this.props.queryResults.map( item => 
            
            AccountHome_e('div', {className:'threadPreview', key:item.key, onClickCapture: e => this.props.loadThread(e,item)},

                        AccountHome_e('h3', {className:'threadPreview__title'}, item.id),
                        
                        AccountHome_e('div', {className:'threadPreview__info'}, 

                            AccountHome_e('h3', {className:'threadPreview__info recentThreadLinks'}, new Date(item.key[0]).toDateString().slice(4)),

                            AccountHome_e('h3', {className:'threadPreview__info recentThreadLinks'}, ((item.value.numComments) ? item.value.numComments : 0) + ' Comments')
                        )
            )
        )

        return(

            AccountHome_e(React.Fragment, null, 

                AccountHome_e('h3', null, 'Recent Threads'),

                AccountHome_e('div', {className:'section section--flex'}, elements)
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
            AccountHome_e('p', null, 'Nothing to see here...') :
            AccountHome_e(react_components_CommentThread, {
                                commentThreadDoc: this.state.currentThread, 
                                createNewCommentInDB: this.createNewCommentInDB
                            }
                )
        )

        return(

            AccountHome_e(React.Fragment, null,

                AccountHome_e(ProfileWidget),

                AccountHome_e(NewThreadButton, {createNewThreadInDB: this.createNewThreadInDB}),

                AccountHome_e(RecentThreads, {queryResults: this.state.queryResults, loadThread:this.loadThread}),

                //e('h2', null, (this.state.currentThread === undefined) ? 'No Thread Selected' : this.state.currentThread._id),

                commentThreadElement
            )
        );

    }
}


// CONCATENATED MODULE: ./js/react_components/Root.js





const domContainer = document.getElementById('HomeComponent');
ReactDOM.render(React.createElement(AccountHome_AccountHome, {DataService}), domContainer);

/***/ })
/******/ ]);