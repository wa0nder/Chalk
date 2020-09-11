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
      SW_Utils.flashMessage(false, element, 'messageLbl messageLbl--red', 'Nothing to post!', 80);
      return;
    }

    this.props.createNewCommentInDB(this.props.parentId, this.state.commentText)

    .then( () => this.clearText(element) )

    .catch( err => console.log('handlePostComment() This is not supposed to happen: ', err) );
  }

  render(){

    return(
      e('div', {className:this.props.className, style:this.props.style},

        e('h4', {className:'commentBlock__h4'}, (this.props.parentAuthor) ? '@'+this.props.parentAuthor : 'Share your thoughts!'),

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
        this.toggleShowContent = this.toggleShowContent.bind(this);

        this.state = {showPostReplyBox: false, showOverflowBtn: false};
        this.hasOverflow = false;
    }

    componentDidMount(){
        this.applyOverflowButton();
    }

    applyOverflowButton(){

        let c = document.querySelector('#'+this.props.id);
        let body = c.querySelector('.commentBox__body');

        if(body.clientHeight < body.scrollHeight && !this.hasOverflow){

            this.setState({showOverflowBtn: true});
            this.hasOverflow = true;
        }
    }

    toggleShowContent(event){
        let elem = event.target;
        let parent = (elem.parentElement.className === 'commentBox') ? elem.parentElement : elem.parentElement.parentElement;
        let style = parent.getElementsByClassName('commentBox__body')[0].style;

        if(style.overflowY === 'scroll'){

            elem.parentElement.scrollTo(0,0);
            style.overflowY = 'hidden';
            this.setState({showOverflowBtn:true});
        }
        else{ 
            style.overflowY = 'scroll'; 
            this.setState({showOverflowBtn:false});
        }
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

        let comment = this.props.comment;
        let replyBox = null;
        let date = undefined;

        if(this.state.showPostReplyBox){
            let parent = document.getElementById(this.props.id);
            let gc = parent.style.gridColumn;
            let gr = parent.style.gridRow;
            replyBox = CommentDisplay_e(react_components_CommentBlock, {
                            className:'commentBlock commentBlock--invertColors', 
                            parentId: this.props.id,
                            parentAuthor: comment.author,
                            style:{gridColumn: gc, gridRow: gr},
                            createNewCommentInDB:this.props.createNewCommentInDB,
                            hidePostReplyBox: this.hidePostReplyBox
                        }
                    );
        }

        if(comment.date){
            date = comment.date.split(' '); //year time GMT ()
            let dateArray = date[0].split('-');
            let timeArray = date[1].split(':');
            let d = new Date(dateArray[0],dateArray[1],dateArray[2], timeArray[0],timeArray[1],timeArray[2]);
            let day = SW_Utils.numToDay(d.getDay());
            let hourWrap = timeArray[0]%12;
            hourWrap = (hourWrap === 0) ? 12 : hourWrap;
            date = `${dateArray[1]}/${dateArray[0].slice(2)} ${day} ${hourWrap}:${timeArray[1]}`;
        }

        return CommentDisplay_e(React.Fragment, null,

            CommentDisplay_e('div', {id:this.props.id, className:this.props.className, style:this.props.style},

                CommentDisplay_e('div', {className: 'commentBox__header'},

                    CommentDisplay_e('div', {className: 'commentBox__header__info'},

                        (!comment.at) ? null : CommentDisplay_e('p', null, `@${comment.at}`),

                        CommentDisplay_e('p', null, `${(comment.author || 'Anon')}`),

                        CommentDisplay_e('p', null, (date || 'date'))
                    ),

                    CommentDisplay_e('img', {className: 'profile__item profile__item--small', src:'profileCircle.png'})
                ),

                CommentDisplay_e('p', {className:'commentBox__body'},

                    comment.body,

                    CommentDisplay_e('br'),

                    ((this.hasOverflow) ? CommentDisplay_e('button', {onClick:this.toggleShowContent}, 'Show Less') : null)
                ),

                ((this.state.showOverflowBtn) ? CommentDisplay_e('button', {className:'commentBox__showMoreLbl', onClick:this.toggleShowContent}, 'Show More') : null),

                CommentDisplay_e('div', {className:'commentBox__actions', style:{background:this.props.actionBarColor}},

                    CommentDisplay_e('div', {className:'commentBox__actions__likes'},

                        CommentDisplay_e('p', {style:{display:'inline'}}, (comment.likes) ? comment.likes : '0'),

                        CommentDisplay_e('button', {onClick:() => this.props.updateCommentLikesInDB(this.props.id)}, 'Like'),

                    ),

                    CommentDisplay_e('button', {onClick: this.showPostReplyBox}, 'Reply'),

                    CommentDisplay_e('div', {className:'commentBox__actions__indicator'})

                ),
            ),

            replyBox
        );
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
    this.hasNewComment = false;
    this.uniqueIdToggle = true;
    this.colorIdx = SW_Utils.getRandomInt(0,SW_Utils.getColorsArray().length);
    
    this.loadChildComments = this.loadChildComments.bind(this);
    this.handleScrollEvents = this.handleScrollEvents.bind(this);
    this.createNewCommentInDB = this.createNewCommentInDB.bind(this);
  }

  componentDidMount(){
    this.handlePostRender('c_0');
  }

  componentDidUpdate(){
    //this.clearOldTintsAndMargins();
    this.handlePostRender();
  }

  handleScrollEvents(event){

    this.loadChildComments(event);
  }

  /**
   * Refresh margins for grid row that received new comment.
   * If 'id' is available just get parent grid, otherwise get first grid row.
   * 
   */
  createNewCommentInDB(id, text){

    this.hasNewComment = true;

    let c = document.querySelector('.container');
    
    let cg = (id) ? document.getElementById(id).parentElement : c.getElementsByClassName('.container__grid')[0];

    Array.from(cg.children)
        .filter(i => i.className === 'commentBox--blank')
        .forEach(i => i.remove());

    return this.props.createNewCommentInDB(id, text);
  }

  loadChildComments(event){

    let elem = event.target;

    let div = this.findHighlightedComment(elem);
    
    if(div !== undefined && div.id !== this.state.currentCommentId){

      let found = SW_Utils.findMatchingComment(div.id, this.props.commentThreadDoc);

      //console.log('found: ', div.id, ' : ', found);
      
      if(found !== undefined){

        //unhighlight old comment
        if(this.state.currentCommentId !== undefined){

          let old = document.getElementById(this.state.currentCommentId);
          
          if(old !== null){ old.style.borderWidth = null; }
        }

        this.setState({currentCommentId: div.id});
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

      this.clearOldTintsAndMargins(div);

      this.tintComments(div);

      this.setScrollToEndMargin(id);
    }
    
  }

  /**
   * Tint all comments except highlighted comment and its immediate child comments, 
   *  which is next grid row. The highlighted comment gets a thicker border. If it
   *  has responses, fade in-out a gradient indicator.
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

          item.style.borderWidth = '4px';

          this.showChildCommentsIndicator(item, end, gridsConChildren.length);
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
   * If comment has responses, indicated by a following grid row, show indicator
   * @param {HTMLElement} comment 
   * @param {Number} idx 
   * @param {Number} arrayLen 
   */
  showChildCommentsIndicator(comment, idx, gridArrayLen){

    if(idx >= gridArrayLen){ return; }

    let indic = comment.getElementsByClassName('commentBox__actions__indicator')[0];
    let opacity = indic.style.opacity = 0;
    let timeout = 50;

    (function fadeIn(){
      ((indic.style.opacity = (opacity+=0.07)) >= 0.5) ? fadeOut() : setTimeout(fadeIn, timeout);
    })();

    function fadeOut(){
      ((indic.style.opacity = (opacity-=0.07)) <= 0) ? (indic.style.opacity = null) : setTimeout(fadeOut, timeout) 
    }
  }

  /**
   * Adds empty comment boxes to extend scrollbar range. 
   *  This allows ending comments to be scrolled to far left of parent container
   *  for highlighting.
   */
  setScrollToEndMargin(id){

    let currentCommentId = this.state.currentCommentId;
    if(currentCommentId === undefined){ currentCommentId = id; }
    if(currentCommentId === undefined){ return; }

    let elem = document.getElementById(currentCommentId);
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
      e.style.gridRow = elem.style.gridRow;
      e.style.gridColumn = offset + i + 1;

      gridElem.appendChild(e);
    }

    //console.log('margin calc: ', multiplier, ' : ', elem);
  }

  /**
   * Relies on difference between 'this.currentThreadId' and 'this.props.commentThreadDoc._id'
   *   to detect loading of new thread. Relies on 'this.hasNewComment' as another condition for
   *   clearing margins
   */
  clearOldTintsAndMargins(){

    let gridsContainer = document.querySelector('.container');
    let gridsConChildren = Array.from(gridsContainer.children);

    this.clearOldTints(gridsConChildren);

    this.clearOldMargins(gridsConChildren);

    //update state
    this.currentThreadId = this.props.commentThreadDoc._id;
    this.hasNewComment = false;
  }

  /**
   * Tinting is manually added on top of react generated components and must be managed
   * as different comment threads, and thus different number of comments, are loaded. This function
   * checks for matching underlying comment box using id = 'tint_[id]', if none found the tint is removed.
   */
  clearOldTints(gridsConChildren){

    if(this.currentThreadId === this.props.commentThreadDoc._id){ return; }

    gridsConChildren.forEach(row => {

      Array.from(row.children).forEach(commentDiv => {

        let id = 'c_' + commentDiv.id.slice(5); //remove 'tint_' prefix
        if(commentDiv.className === 'commentBox--tint' && row.querySelector('#'+id) === null){
          commentDiv.remove();
        }
      })
    });
  }

  /**
   * Remove blank boxes serving as margin filler to allow scrolling to left
   * @param {HTMLElement Array} gridsConChildren
   */
  clearOldMargins(gridsConChildren){

    if(this.currentThreadId === this.props.commentThreadDoc._id && !this.hasNewComment){ return; }

    gridsConChildren.forEach(row => {

      Array.from(row.children)
        .filter(i => i.className === 'commentBox--blank')
        .forEach(i => i.remove());

    });
  }


  /**
   * If thread change, scroll back to top left corner and toggle React key list prefix to force
   *   re-render of comment body. Also update color cycling offset.
   * @param {String} path 
   */
  checkForThreadChange(path){

    if(this.currentThreadId !== this.props.commentThreadDoc._id){

      this.uniqueIdToggle = !this.uniqueIdToggle;
      
      this.colorIdx = SW_Utils.getRandomInt(0,SW_Utils.getColorsArray().length);

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

    if(!commentArray || commentArray.length === 0){ return null; } 

    let state = {
      elements: [],
      end: false,
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

    let colorsArray = SW_Utils.getColorsArray(),
        cArrLen = colorsArray.length,
        colorIdx = (this.colorIdx + reactRowNum) % cArrLen;

    let rowPos = 0;
    
    let items = commentArray.map( comment => {
  
      let id = `${path}${rowPos++}`;
      let key = this.uniqueIdToggle ? 'k_' : 'K_';
      let color = colorsArray[(colorIdx % cArrLen)];
      let gradient = `linear-gradient(135deg, ${colorsArray[((colorIdx+12) % cArrLen)]}, 10%, ${colorsArray[(colorIdx++ % cArrLen)]})`;

      return CommentGrid_e(react_components_CommentDisplay, {
                        key: key+id,
                        id: 'c_'+id,
                        className: 'commentBox', 
                        style:{
                          gridRow: 1,
                          gridColumn: rowPos,
                          borderRight: `2px solid ${color}`,
                          borderBottom: `2px solid ${color}`
                        },
                        actionBarColor: gradient,
                        comment: comment,
                        onClick: this.loadChildComments,
                        createNewCommentInDB:this.createNewCommentInDB,
                        updateCommentLikesInDB: this.props.updateCommentLikesInDB
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

        CommentThread_e('div', {className: 'commentThreadHeader'}, 
  
          CommentThread_e('h3', null, this.props.commentThreadDoc._id),
    
          CommentThread_e('h4', null, date.toDateString()),
    
          CommentThread_e('h4', null, `${this.props.commentThreadDoc.numComments || 0} Comments`)

        ),

        CommentThread_e('div', {className:'commentThreadReplyContainer'},

          CommentThread_e('button', {className: 'addCommentBtn', onClick:this.toggleShowCommentBlock}, 'Leave a comment!'),
  
          ((this.state.showBlock) ? 
  
            CommentThread_e(react_components_CommentBlock, { className:'commentBlock commentBlock--overlay', 
                              createNewCommentInDB:this.props.createNewCommentInDB, 
                              hidePostReplyBox:this.toggleShowCommentBlock}) 
            : null)
        ),
  
        CommentThread_e(react_components_CommentGrid, {
                        commentThreadDoc:this.props.commentThreadDoc,
                        createNewCommentInDB:this.props.createNewCommentInDB,
                        updateCommentLikesInDB: this.props.updateCommentLikesInDB
                      })
      )
    );
  }
}

/* harmony default export */ var react_components_CommentThread = (CommentThread_CommentThread);
// CONCATENATED MODULE: ./js/react_components/AccountHome.js




const AccountHome_e = React.createElement;

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

        label.style.opacity = parseInt(window.getComputedStyle(label).getPropertyValue('opacity')) + 1;
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

    numToMonth(num){
        let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        SW_Utils.numToMonth = function(num){
            
            if(num < 0 || num > 11){ throw new RangeError(`${num} does not map to 0-11 month range`); }

            return months[num];
        }

        return SW_Utils.numToMonth(num);
    },

    numToDay(num){
        let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

        SW_Utils.numToDay = function(num){
            
            if(num < 0 || num > 6){ throw new RangeError(`${num} does not map to 0-6 day range`); }

            return days[num];
        }

        return SW_Utils.numToDay(num);
    },

    /**
     * @returns {CSS_RGB_ColorsArray} - returns an array of colors retrieved from CSS variable declarations
     *   for the purpose of styling comment colors in a specific order. First run initializes the array and
     *   all subsequent calls returns same copy of array.
     */
    getColorsArray(){
        let style = getComputedStyle(document.body);
        let colors = [
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

        AccountHome_e('div', {className: 'profile'}, 

            AccountHome_e('img', {className: 'profile__logo', src: '/sidewalks/front-end/chalkLogoTwoClearSmall.png'}),

            AccountHome_e('a', {className: 'profile__a'},

                AccountHome_e('img', {className: 'profile__item', src:'profileCircle.png'}),

                AccountHome_e('p', {className: 'profile__p'}, 'Profile')
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
                AccountHome_e('div', {className: 'section'}, 
                
                    AccountHome_e('input', {className:'section__input', type:'text', placeholder:'...enter thread name', value:this.state.threadTitleField, onChange:this.updateThreadTitleField}),

                    AccountHome_e('button', {style:{display:'inline'}, onClick: this.createNewThreadInDB}, 'OK'),

                    AccountHome_e('button', {onClick: this.toggleCreateNewThreadState}, 'CANCEL')
                )
            );
        }

        return AccountHome_e('div', {className:'section section--neutral'},

                AccountHome_e('button', {className:'newThreadBtn', onClick: this.toggleCreateNewThreadState}, '+ new thread')
        );
    }
}

class RecentThreads extends React.Component{
    constructor(props){
        super(props);

        this.threadRenderFlag = !this.props.threadCreateFlag;
        this.colorIdx = 0;
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

        if(this.threadRenderFlag !== this.props.threadCreateFlag){

            this.threadRenderFlag = this.props.threadCreateFlag;
            
            this.colorIdx = SW_Utils.getRandomInt(0,cArrLen);
        }
        
        let colorIdx = this.colorIdx;
        let elements = this.props.queryResults.map( item =>

            AccountHome_e('div', { className:'threadPreview', 
                        style:{ background: `linear-gradient(135deg, ${colorsArray[((colorIdx+12) % cArrLen)]}, 10%, ${colorsArray[(colorIdx++ % cArrLen)]})`}, 
                        key:item.key,
                        onClickCapture: e => this.props.loadThread(e,item)
                    },

                        AccountHome_e('h3', {className:'threadPreview__title'}, item.id),

                        AccountHome_e('h3', {className:'threadPreview__fullTitle'}, item.id),
                        
                        AccountHome_e('div', {className:'threadPreview__info'}, 

                            AccountHome_e('h3', {className:'threadPreview__info recentThreadLinks'}, new Date(item.key[0]).toDateString().slice(4)),

                            AccountHome_e('h3', {className:'threadPreview__info recentThreadLinks'}, ((item.value.numComments) ? item.value.numComments : 0) + ' Comments')
                        )
            )
        )

        return(

            AccountHome_e(React.Fragment, null, 

                AccountHome_e('h2', null, 'Recent Threads'),

                AccountHome_e('div', {className:'section section--flex', ref:this.rootRef}, elements)
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
            currentThread: undefined,
            threadCreateFlag: false,
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
        this.changeStyleSheet = this.changeStyleSheet.bind(this);
    }

    componentDidMount(){

        this.props.DataService.addDemoThread()
        
        .then(() => this.props.DataService.updateRecentThreadsList(undefined) )

        .then(queryResults => this.setState({queryResults: queryResults, currentThreadTitle: undefined}) )
                
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

            let flag = this.state.threadCreateFlag;
            this.setState({queryResults: queryResult, currentThreadTitle: threadTitle, threadCreateFlag: !flag})

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

    changeStyleSheet(event){

        let text = event.target.innerText;
        let name = (text === 'dusk') ? 'index.css' : (text === 'day' ? 'indexBright.css' : 'indexDark.css');

        fetch(`/sidewalks/front-end/${name}`)

        .then(response => response.blob())

        .then(blob => document.getElementById('stylesheet').href = URL.createObjectURL( blob ))

        .catch(err => console.log("Error! ", err.message));

        return false;
    }

    render(){

        let commentThreadElement = ( (this.state.currentThread === undefined) ? 
            AccountHome_e('h4', null, 'Nothing to see here...') :
            AccountHome_e(react_components_CommentThread, {
                                commentThreadDoc: this.state.currentThread, 
                                createNewCommentInDB: this.createNewCommentInDB,
                                updateCommentLikesInDB: this.updateCommentLikesInDB
                            }
                )
        )

        return(

            AccountHome_e(React.Fragment, null,
            
                AccountHome_e('div', {className: 'profile__container'},
            
                    AccountHome_e('a', {onClick: this.changeStyleSheet}, 'day'),

                    AccountHome_e('a', {onClick: this.changeStyleSheet}, 'dusk'),

                    AccountHome_e('a', {onClick: this.changeStyleSheet}, 'night')
                        
                ),

                AccountHome_e(ProfileWidget),

                AccountHome_e(NewThreadButton, {createNewThreadInDB: this.createNewThreadInDB}),

                AccountHome_e(RecentThreads, {threadCreateFlag: this.state.threadCreateFlag, queryResults: this.state.queryResults, loadThread:this.loadThread}),

                AccountHome_e('h2', null, 'Current Thread'),

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