'use strict'

import CommentBlock from './CommentBlock.js';
import CommentGrid from './CommentGrid.js';

const e = React.createElement;

class CommentThread extends React.Component{
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

      e(React.Fragment, null, 
  
        e('h3', null, this.props.commentThreadDoc._id),
  
        e('h4', null, date.toDateString()),
  
        e('h4', null, `${this.props.commentThreadDoc.numComments} Comments`),
  
        ( (this.state.showBlock) ? 
  
          e(CommentBlock, {createNewCommentInDB:this.props.createNewCommentInDB, hidePostReplyBox:this.toggleShowCommentBlock}) :
  
          e('button', {onClick:this.toggleShowCommentBlock}, 'Leave a comment!')),
  
        e(CommentGrid, {
                        commentThreadDoc:this.props.commentThreadDoc,
                        createNewCommentInDB:this.props.createNewCommentInDB
                      })
      )
    );
  }
}

export default CommentThread;