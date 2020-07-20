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
    //this.syncStateWithDB = this.syncStateWithDB.bind(this);
  }

  // componentDidMount(){
  //   let update = this.state.dbComments.concat(this.props.commentThreadDoc.comments);
  //   this.setState({dbComments: update})
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

        e(CommentGrid, {commentThreadDoc:this.props.commentThreadDoc})
        //e(React.Fragment, null, this.props.commentThreadDoc.comments.map( item => e(CommentDisplay, {key: (cnt+=1), commentText:item.body}) ) )

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
  }

  handleScrollEvents(event){

    let elem = event.target;

    if(!this.scrolling){

      this.scrolling = true;

      elem.dispatchEvent( new Event('scrollStart') );
    }
    else{
      clearTimeout(this.timerId);

      this.handleScroll();
    }

    this.timerId = setTimeout( () => {

        elem.dispatchEvent( new Event('scrollEnd') );
        this.scrolling = false;
      }, 
      300);

  }

  handleScroll(){

  }

  render(){

    let highlight = e('div', {key: 'highlightBox', className: 'highlight'});

    let i=1;
    
    let comments = this.props.commentThreadDoc.comments.map( item => {
      return e('div', {
                        key: i, 
                        className: 'commentBox', 
                        style:{
                          gridColumn: i++,
                          gridRow: 1
                        }
                      }, 

              e('h4', null, `Author: ${item.author}`),

              e('p', null, item.body)

            )
    });

    comments.unshift(highlight);
    
    return(
      e('div', {className: 'gridContainer', onScroll: this.handleScrollEvents}, comments)
    );
  }
}

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