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
      console.log('div found: ', div);

      //use div id to get comment from commentThreadDoc
      //check if it has children
      //if so, clear grid, then update state
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

    let elements = document.elementsFromPoint(xt,yt);

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

  render(){

    //let highlight = e('div', {key: 'highlightBox', className: 'highlight', ref:this.hilightBoxRef});

    let i=1;
    
    let comments = this.props.commentThreadDoc.comments.map( item => {
      return e('div', {
                        key: i,
                        id: i,
                        className: 'commentBox', 
                        style:{
                          gridColumn: i++,
                          gridRow: 1
                        },
                        onClick: this.loadChildComments,
                      }, 

              e('h4', null, `Author: ${item.author}`),

              e('p', null, item.body)

            )
    });

    if(this.state.currentCommentId != undefined){

    }

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