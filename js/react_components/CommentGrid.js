'use strict'

/**
 * Convert a '#:#-#:#...' string into index into nested object comments.
 * e.g. '0:0-0:1-1:1' shows sequence of steps to reach grid position
 * x-values as 'dx' can be converted directly into array indices
 * y-values indicate recursions, 'dy' <= 1 means stay at current recurse level, 'dy' > 1 means recurse 'dy-1' levels
 * @param {*} idpath 
 * @param {*} commentsDoc 
 */
function getMatchingComment(idpath, commentsDoc){

    let path = idpath.split('-');

    let xyPairs = path.map( item => item.split(':').map(num => parseInt(num)) );

    //get starting top-level comment
    let comment = commentsDoc.comments[xyPairs[0][0]];

    xyPairs = getDeltaPairs(xyPairs, false);

    //console.log('delta pairs: ', xyPairs, " - ", comment);

    //let comment = commentsDoc;
    for(let i=0; i<xyPairs.length; i++){
        let pair = xyPairs[i];

        //console.log('dpair: ', pair[0], ' : ', pair[1]);

        if(pair[0] != 0){

            if(!comment.comments || pair[0] >= comment.comments.length) return undefined;

                comment = comment.comments[ pair[0] ];
        }

        else{ 

            while(pair[1] > 1){ 

                if(!comment.comments || comment.comments.length === 0) return undefined;

                comment = comment.comments[0]; 

                pair[1]--;
            }

            //if final pair, recurse to grab comment
            if(i === xyPairs.length-1 && pair[1] === 1){
                comment = comment.comments[0];
            }
        }
    }

    return comment;
}

/**
 * Convert a set of discrete points into delta values.
 * @param {*} xyPairs 
 * @param {*True for a non-delta starting point} leaveFirst 
 */
function getDeltaPairs(xyPairs, leaveFirst){

    //deep copy
    let deltaPairs = xyPairs.map(item => item.slice());

    if(leaveFirst){
        
        for(let i=deltaPairs.length-1; i>0; i--){

            let dx = deltaPairs[i][0] - deltaPairs[i-1][0];
            let dy = deltaPairs[i][1] - deltaPairs[i-1][1];
            
            deltaPairs[i][0] = dx;
            deltaPairs[i][1] = dy;
        }
    }
    else{
        
        for(let i=0; i<deltaPairs.length-1; i++){

            let dx = deltaPairs[i+1][0] - deltaPairs[i][0];
            let dy = deltaPairs[i+1][1] - deltaPairs[i][1];
            
            deltaPairs[i][0] = dx;
            deltaPairs[i][1] = dy;
        }

        //delta requires a pair so output set size is -1 the original set
        deltaPairs = deltaPairs.slice(0,-1);
    }
    
    return deltaPairs;
}

function findMatchingComment(path, commentArray){

  path = path.split('-').map( num => parseInt(num) );

  let comment = commentArray.comments[ path[0] ];

  path = path.slice(1);
  for(let idx of path){

    if(!comment.comments || comment.comments.length === 0) return undefined;

    comment = comment.comments[idx];
  }

  return comment;
}

class CommentGrid2 extends React.Component{
  constructor(props){
    super(props);

    this.state = {currentCommentId: undefined};
    
    this.loadChildComments = this.loadChildComments.bind(this);
    this.handleScrollEvents = this.handleScrollEvents.bind(this);
  }

  handleScrollEvents(event){

    this.loadChildComments(event);
  }

  loadChildComments (event){

    let elem = event.target;

    let div = this.findHighlightedComment(elem);
    
    if(div !== undefined && div.id !== this.state.currentCommentId){

      let found = findMatchingComment(div.id, this.props.commentThreadDoc);

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
      let scrollbarHeight = scrollCalc.calcScrollBarHeight(elem);
      let scrollY = scrollCalc.calcScrollBarY(elem);
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

  handlePostRender(){

    let div = document.getElementById(this.state.currentCommentId);

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
    for(let j=-1, i=0; i<end; i++){

      let currId = currComment.id.slice(0,j+((i+1)*2));
      
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

      return e(CommentDisplay, {
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

    return e('div', {key:reactRowNum, className: 'grid'}, items);
  }

  render(){

    let path = (this.state.currentCommentId != undefined) ? this.state.currentCommentId : '0';
  
    let comments = this.renderComments(path, this.props.commentThreadDoc.comments);

    return (
      e('div', {className:'container',onScroll: this.handleScrollEvents}, comments)
    );
  }
}