'use strict'

const useState = React.useState, 
      useEffect = React.useEffect;

class CommentThread extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      dbComments: [],
      commentText: ''
    }

    this.clearText = this.clearText.bind(this);
    this.handleChangeEvt = this.handleChangeEvt.bind(this);
    this.handlePostCommentBtnClick = this.handlePostCommentBtnClick.bind(this);

  }

  componentDidMount(){
    let update = this.state.dbComments.concat(this.props.commentThreadDoc.value);
    this.setState({dbComments: update})
  }

  clearText(){
    updateCommentText('');
  }

  handleChangeEvt(event){
      updateCommentText(event.target.value);
  }

  handlePostCommentBtnClick(){

    const text = this.state.commentText;

    let update = this.state.dbComments.concat( [{body: text}] );
    this.setState( {dbComments: update} );

    this.props.createNewCommentInDB(text)

    .then( () => clearText() )

    .catch( err => console.log('handlePostCommentBtnClick() This is not supposed to happen: ', err) );
  }

  render(){

    let cnt = 0;

    return(

      e(React.Fragment, null, 

        e(CommentBlock, {commentText:this.state.commentText, handlePostCommentBtnClick:this.handlePostCommentBtnClick, handleChangeEvt:this.handleChangeEvt}),

        e(React.Fragment, null, this.state.dbComments.map( item => e(CommentDisplay, {key: (cnt+=1), commentText:item.body}) ) )

      )
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