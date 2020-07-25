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

class CommentGrid extends React.Component{
    constructor(props){
      super(props);
  
      this.scrolling = false;
      this.timerId = undefined;
  
      this.handleScrollEvents = this.handleScrollEvents.bind(this);
      this.loadChildComments = this.loadChildComments.bind(this);
  
      this.gridRef = React.createRef();
  
      this.state = {currentCommentId: undefined};
    }
  
    componentDidMount(){
      this.gridRef.current.addEventListener('scrollEnd', this.loadChildComments, false);
    }
  
    componentWillUnmount(){
      this.gridRef.current.removeEventListener('scrollEnd', this.loadChildComments, false);
    }
    
  
    loadChildComments (event){
      let elem = event.target;
  
      let div = this.findHighlightedComment(elem);
      
      if(div !== undefined && div.id !== this.state.currentCommentId){
  
        //use div id to get comment from commentThreadDoc
        let found = getMatchingComment(div.id, this.props.commentThreadDoc);
  
        //console.log('found: ', div.id, ' : ', found);
  
        //check if it has children
        if(found){
  
          //de-highlight old comment
          if(this.state.currentCommentId !== undefined){
            document.getElementById(this.state.currentCommentId).style.borderColor = undefined;
          }
  
          //update state to trigger redraw
          this.setState({currentCommentId: div.id});
        }
        
      }
    }
  
    findHighlightedComment(elem){
      let scrollbarWidth = scrollCalc.calcScrollBarWidth(elem);
      let scrollbarHeight = scrollCalc.calcScrollBarHeight(elem);
      let scrollX = scrollCalc.calcScrollBarX(elem);
      let scrollY = scrollCalc.calcScrollBarY(elem);
  
      let rect = elem.getBoundingClientRect();
  
      //console.log('scroll vals: ', scrollX, ' : ', scrollY, ' - ', scrollbarWidth, ' : ', scrollbarHeight, ' - ', rect.x, ' : ', rect.y);
  
      let xt = rect.x+scrollX+(scrollbarWidth/2);
      let yt = rect.y+scrollY+(scrollbarHeight/2);
  
      //console.log('offsets: ', xt, ' : ', yt);
  
      // let e = document.getElementById('pointer');
      // e.style.left = xt + 'px';
      // e.style.top = yt + 'px';
  
      let elements = document.elementsFromPoint(xt,yt);
  
      //console.log('elements: ', elements);
  
      return elements.find(e => e.className === 'commentBox');
    }
  
    handleScrollEvents(event){
  
      let elem = event.target;
  
      if(!this.scrolling){
  
        this.scrolling = true;
  
        elem.dispatchEvent( new Event('scrollStart') );
      }
      else{
        clearTimeout(this.timerId);
  
        //this.handleScroll(event);
      }
  
      this.loadChildComments(event);
  
      this.timerId = setTimeout( () => {
  
          elem.dispatchEvent( new Event('scrollEnd') );
          this.scrolling = false;
        }, 
        300);
  
    }
  
    handleScroll(event){
  
      this.moveHighlightBox(event);
    }
  
    moveHighlightBox(event){
  
      let highlight = event.target.children[0];
      highlight.style.top = event.target.scrollTop + 'px';
      highlight.style.left = event.target.scrollLeft + 'px';
    }
  
    renderCommentPath(path, comments){
      
      let idpath = path.split('-');
  
      let xyPairs = idpath.map( item => item.split(':').map(num => parseInt(num)) );

      let deltaPairs = getDeltaPairs(xyPairs, true);
  
      let allComments = [],
          rootPath = '';
  
      //console.log('xyPairs: ', xyPairs, ' - ', deltaPairs);
  
      //render top-level comments
      let top = this.renderDirectResponses(rootPath, 0, 0, comments);
      allComments = allComments.concat(top);
      
      let vert = true;
      let results, vertList;
      for(let i=0; i<xyPairs.length; i++){

        let pair = xyPairs[i];
        let dpair = deltaPairs[i];
  
        if(vert){
  
          if(!comments || comments.length === 0){ break; }
  
          //chain rootPath
          rootPath += `${pair[0]}:${pair[1]}-`;
  
          //get root comment for vertical rendering
          let root = comments[ dpair[0] ];

          //console.log("root: ", root, ' - ', dpair[0], ' - ', comments);
  
          //nothing else to render
          if(!root.comments || root.comments.length === 0){ break; }
  
          //generate vertical response comments
          [results, vertList] = this.renderResponseThread(rootPath, pair[0], pair[1], root);
          allComments = allComments.concat(results);
  
          vert = false;
        }
  
        else{
          
          let parentMarker = vertList[ Math.max(0,dpair[1]-1) ];
          //console.log('parentMarker: ', vertList, ' : ', pair[1]);
          if(!parentMarker.comments || parentMarker.comments.length === 0) break;
  
          //chain rootPath
          rootPath += `${pair[0]}:${pair[1]}-`;
    
          //generate horizontal top-level comments
          results = this.renderDirectResponses(rootPath, pair[0]+1, pair[1], parentMarker.comments.slice(1));
          allComments = allComments.concat(results);
  
          //update comments reference
          comments = parentMarker.comments;
  
          vert = true;
        }
  
      }
  
      return allComments;
    }
  
    renderDirectResponses(rootPath, x, y, comments){
      //console.log('params: ', rootPath, ' - ', x, ':', y, ' - ', comments);
      return comments.map( item => {
  
        let id = `${rootPath}${x}:${y}`;
        let borderColor = (id === this.state.currentCommentId) ? 'red' : undefined;
  
        let out = e(CommentDisplay, {
                          key: `${x}:${y}`,
                          id: id,
                          className: 'commentBox', 
                          style:{
                            gridRow: y+1,
                            gridColumn: x+1,
                            borderColor: borderColor
                          },
                          comment: item,
                          onClick: this.loadChildComments,
                          handlePostCommentBtnClick: this.props.handlePostCommentBtnClick
                        }
                  );
        x++;
  
        return out;
      });
    }
  
    renderResponseThread(rootPath, x, y, comment){
      //console.log('params2: ', rootPath, " - ", x, ":", y, " - ", comment);
  
      y += 1; //+1 to avoid re-rendering root comment
      let gridRowNum = y + 1; //another +1 because CSS grid starts at 1, not 0
      
      let out = [], 
        vertList = [comment];
  
      while(true){
  
        let id = `${rootPath}${x}:${y}`;
        let borderColor = (id === this.state.currentCommentId) ? 'red' : undefined;
  
        comment = comment.comments[0];
        
        out.push(
                  e(CommentDisplay, {
                    key: `${x}:${y}`,
                    id: `${rootPath}${x}:${y++}`,
                    className: 'commentBox', 
                    style:{
                      gridRow: gridRowNum++,
                      gridColumn: x+1,
                      borderColor
                    },
                    comment: comment,
                    onClick: this.loadChildComments,
                    handlePostCommentBtnClick:this.props.handlePostCommentBtnClick
                  }
                )
              );
        
        vertList.push(comment);
  
        if(!comment.comments || comment.comments.length === 0){ break; }
      }
  
      return [out, vertList];
    }
  
    render(){
  
      //let i=1;
      
      let path = (this.state.currentCommentId != undefined) ? this.state.currentCommentId : "0:0";//0:0-0:1";
  
      let comments = this.renderCommentPath(path, this.props.commentThreadDoc.comments);
  
      // let highlight = e('div', {key: 'highlightBox', className: 'highlight', ref:this.hilightBoxRef});
      // comments.unshift(highlight);
      
      return(
        e('div', {className: 'gridContainer', onScroll: this.handleScrollEvents, ref:this.gridRef}, comments)
      );
    }
  }