'use strict'

const useState = React.useState, 
      useEffect = React.useEffect;

class CommentThread extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      //threadTitle: this.props.commentThreadDoc._id,
      //dbComments: this.props.commentThreadDoc.comments || [],
      commentText: ''
    }

    this.clearText = this.clearText.bind(this);
    this.handleChangeEvt = this.handleChangeEvt.bind(this);
    this.handlePostCommentBtnClick = this.handlePostCommentBtnClick.bind(this);
    
    //this.hilightBoxRef = React.createRef();
  }

  // componentDidMount(){
  //   this.hilightBoxRef.current.addEventListener('scrollEnd', this.props.loadChildComments, false);
  // }

  // componentWillUnmount(){
  //     this.hilightBoxRef.current.removeEventListener('scrollEnd', this.props.loadChildComments, false);
  // }

  clearText(){
    this.setState({commentText:''});
  }

  handleChangeEvt(event){
      this.setState({commentText:event.target.value});
  }

  handlePostCommentBtnClick(){

    const text = this.state.commentText;

    // let update = this.state.dbComments.concat( [{body: text}] );
    // this.setState( {dbComments: update} );

    this.props.createNewCommentInDB(text)

    .then( () => this.clearText() )

    .catch( err => console.log('handlePostCommentBtnClick() This is not supposed to happen: ', err) );
  }

  render(){

    return(

      e(React.Fragment, null, 

        e('h3', null, this.props.commentThreadDoc._id),

        e(CommentBlock, {commentText:this.state.commentText, handlePostCommentBtnClick:this.handlePostCommentBtnClick, handleChangeEvt:this.handleChangeEvt}),

        e('h4', null, 'Comments:'),

        //e('div', {style:{position: 'relative', border:'2px solid green'}},

          //e('div', {key: 'highlightBox', className: 'highlight', ref:this.hilightBoxRef}),

          e(CommentGrid, {commentThreadDoc:this.props.commentThreadDoc, loadChildComments:this.props.loadChildComments})
        //)


      )
    );
  }
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
    
    if(div != undefined && div.id != this.state.currentCommentId){
      let currId = this.state.currentCommentId

      //use div id to get comment from commentThreadDoc
      let found = this.getMatchingComment(div.id, this.props.commentThreadDoc);

      //check if it has children
      if(found.comments && found.comments.length > 0){

        //if so, and moving backwards (up or left)

        
        //clear previously rendered comments


        
        //update state to trigger redraw
        this.setState({currentCommentId: div.id});
      }
      
    }
  }

  /**
   * Convert a '#:#-#:#...' string into index into nested object comments.
   * e.g. '0:0-0:1-1:1' shows sequence of steps to reach grid position
   * x-values as 'dx' can be converted directly into array indices
   * y-values indicate recursions, 'dy' = 1 means stay at current recurse level, 'dy' > 1 means recurse 'dy-1' levels
   * @param {*} idpath 
   * @param {*} commentsDoc 
   */
  getMatchingComment(idpath, commentsDoc){

    let path = idpath.split('-');

    let xyPairs = path.map( item => item.split(':').map(num => parseInt(num)) );

    for(let i=0; i<xyPairs.length-1; i++){
      let dy = xyPairs[i+1][1] - xyPairs[i][1];
      xyPairs[i][1] = dy;
    }
    
    let found = xyPairs.reduce((a,pair) => {

      console.log('pair: ', pair, ' - a: ', a);

      a = a.comments[ pair[0] ];

      if(pair[1] > 0){ a = a.comments[0]; }

      return a;

    }, commentsDoc);

    console.log('found: ', found);

    return found;
  }

  findHighlightedComment(elem){
    let scrollbarWidth = scrollCalc.calcScrollBarWidth(elem);
    let scrollbarHeight = scrollCalc.calcScrollBarHeight(elem);
    let scrollX = scrollCalc.calcScrollBarX(elem);
    let scrollY = scrollCalc.calcScrollBarY(elem);

    let rect = elem.getBoundingClientRect();

    console.log('scroll vals: ', scrollX, ' : ', scrollY, ' - ', scrollbarWidth, ' : ', scrollbarHeight, ' - ', rect.x, ' : ', rect.y);

    let xt = rect.x+scrollX+(scrollbarWidth/2);
    let yt = rect.y+scrollY+(scrollbarHeight/2);

    console.log('offsets: ', xt, ' : ', yt);

    let e = document.getElementById('pointer');
    e.style.left = xt + 'px';
    e.style.top = yt + 'px';

    let elements = document.elementsFromPoint(xt,yt);

    console.log('elements: ', elements);

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

      this.handleScroll(event);
    }

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

    let allComments = [];

    let rootPath = '';

    console.log('xyPairs: ', xyPairs);

    //render top-level comments
    let top = this.renderDirectResponses(rootPath, 0, 0, comments);
    allComments = allComments.concat(top);
    
    let baseY = 0;
    for(let pair of xyPairs){

      //get root comment for vertical rendering
      let root = comments[ pair[0] ];

      //nothing else to render
      if(!root.comments || root.comments.length === 0) break;

      let [results, parentMarker] = this.renderResponseThread(rootPath, baseY+1, pair[0], pair[1], root); //+1 to avoid re-rendering current comment
      allComments = allComments.concat(results);

      if(!parentMarker.comments || parentMarker.comments.length === 0 || pair[1] === 0) break;

      //chain rootPath
      rootPath += `${pair[0]}:${pair[1]}-`;

      //generate horizontal top-level comments
      console.log('out: ', parentMarker);
      results = this.renderDirectResponses(rootPath, pair[0]+1, pair[1], parentMarker.comments.slice(1));
      allComments = allComments.concat(results);

      //chain rootPath
      rootPath += `${pair[0]+1}:${pair[1]}-`;

      //update offset
      baseY = pair[1];

      if(!parentMarker.comments || parentMarker.comments.length === 0) break;

      //update comments reference
      comments = parentMarker.comments;
    }

    return allComments;
  }

  renderDirectResponses(rootPath, x, y, comments){
    console.log('params: ', rootPath, ' - ', x, ':', y, ' - ', comments);
    return comments.map( item => {
      let out = e('div', {
                        key: `${x}:${y}`,
                        id: `${rootPath}${x}:${y}`,
                        className: 'commentBox', 
                        style:{
                          gridRow: y+1,
                          gridColumn: x+1
                        },
                        onClick: this.loadChildComments,
                      }, 

              e('h4', null, `Author: ${item.author}`),

              e('p', null, item.body)

            );
      x++;

      return out;
    });
  }

  renderResponseThread(rootPath, baseY, x, y, comment){
    console.log('params2: ', rootPath, " - ", x, ":", y, " - ", comment);

    let marker = comment;
    comment = comment.comments[0];
    let out = [];
    while(true){

      out.push(
                e('div', {
                  key: `${x}:${baseY}`,
                  id: `${rootPath}${x}:${baseY}`,
                  className: 'commentBox', 
                  style:{
                    gridRow: baseY+1,
                    gridColumn: x+1
                  },
                  onClick: this.loadChildComments,
                }, 

                e('h4', null, `Author: ${comment.author || 'none'}`),

                e('p', null, comment.body)

              )
            );
      
      if(baseY+1 === y){ marker = comment; }
      
      if(!comment.comments || comment.comments.length === 0){ break; }

      comment = comment.comments[0];
      
      baseY++;
    }

    return [out, marker];
  }

  render(){

    //let highlight = e('div', {key: 'highlightBox', className: 'highlight', ref:this.hilightBoxRef});

    //let i=1;
    
    let path = (this.state.currentCommentId != undefined) ? this.state.currentCommentId : "0:1";//0:0-0:1";

    let comments = this.renderCommentPath(path, this.props.commentThreadDoc.comments);
    // let comments = this.props.commentThreadDoc.comments.map( item => {
    //   return e('div', {
    //                     key: i,
    //                     id: `${i}:1`,
    //                     className: 'commentBox', 
    //                     style:{
    //                       gridColumn: i++,
    //                       gridRow: 1
    //                     },
    //                     onClick: this.loadChildComments,
    //                   }, 

    //           e('h4', null, `Author: ${item.author}`),

    //           e('p', null, item.body)

    //         )
    // });

    // if(this.state.currentCommentId != undefined){
    //   comments.concat( this.renderChildComments(this.state.currentCommentId, this.props.commentThreadDoc.comments) );
    // }

    //comments.unshift(highlight);
    
    return(
      e('div', {className: 'gridContainer', onScroll: this.handleScrollEvents, ref:this.gridRef}, comments)
    );
  }
}

// class CommentDiv extends React.Component{
//   constructor(props){
//     super(props);
//   }

//   render(){

//     return e('div', {
//                       key: this.props.key,
//                       id: this.props.id,
//                       className: this.props.className, 
//                       style:{
//                         gridColumn: this.props.style.gridColumn,
//                         gridRow: 1
//                       },
//                       onClick: this.props.onClick
//                     }, 

//                 e('h4', null, `Author: ${this.props.item.author}`),

//                 e('p', null, this.props.item.body)

//                 )
//   }
// }

// function CommentThread(props){

//   //const local_db = props.local_db;
//   const commentThread = props.commentThreadDoc;

//   console.log('each thread: ', commentThread);

//   const [dbComments, updateDBComments] = useState([]);
//   const [commentText, updateCommentText] = useState('');

//   //run once when component is first mounted
//   useEffect(function(){

//     // local_db.get('CommentBlock')

//     // .then(function(commentDoc){

//       updateDBComments( dbComments.concat(commentThread.value) );
//     // })
    
//     // .catch(err => console.log('Error: ', err.status, '-', err.message, ' : ', err));

//   }, []);

//   function clearText(){
//       updateCommentText('');
//   }
  
//   function handleChangeEvt(event){
//       updateCommentText(event.target.value);
//   }

//   function handlePostCommentBtnClick(){

//     const text = commentText;

//     updateDBComments( dbComments.concat([{body: text}]) );

//     props.createNewCommentInDB(text)

//     .then( () => clearText() )

//     .catch( err => console.log('handlePostCommentBtnClick() This is not supposed to happen: ', err) );
//   }
  
//   let cnt = 0;
//   return(
//       e(React.Fragment, null, 

//         e(CommentBlock, {commentText, handlePostCommentBtnClick, handleChangeEvt}),

//         e(React.Fragment, null, dbComments.map( item => e(CommentDisplay, {key: (cnt+=1), commentText:item.body}) ) )

//       )
//   );
// }

//const domContainer = document.getElementById('CommentThread');
//ReactDOM.render(e(CommentThread, {local_db:local_db}), domContainer);