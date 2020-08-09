'use strict'

import CommentDisplay from './CommentDisplay.js';
import {SW_Utils} from './AccountHome.js';

const e = React.createElement;

/**
 * Expects two properties passed in props object
 * @param {Object} commentThreadDoc - CouchDB document
 * @param {Function} createNewCommentInDB - self-explanatory function to be passed to CommentDisplay
 */
class CommentGrid extends React.Component{
  constructor(props){
    super(props);

    this.state = {currentCommentId: undefined};
    this.currentThreadId = this.props.commentThreadDoc._id;
    this.uniqueIdToggle = true;
    
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

        //unhighlight old comment
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

          item.style.borderWidth = '6px';

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
    let timeout = 25;

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

  /**
   * If thread change, scroll back to top left corner and toggle React key list prefix to force
   *   re-render of comment body
   * @param {String} path 
   */
  checkForThreadChange(path){

    if(this.currentThreadId !== this.props.commentThreadDoc._id){

      this.uniqueIdToggle = !this.uniqueIdToggle;

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

    let rowPos = 0;
    let items = commentArray.map( comment => {
  
      let id = `${path}${rowPos++}`;
      let key = this.uniqueIdToggle ? 'k_' : 'K_';

      return e(CommentDisplay, {
                        key: key+id,
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

    return e('div', {key:reactRowNum, className: 'container__grid'}, items);
  }

  render(){

    let comments = this.renderComments(this.state.currentCommentId, this.props.commentThreadDoc.comments);

    return (
      e('div', {className:'container',onScroll: this.handleScrollEvents}, comments)
    );
  }
}

export default CommentGrid;