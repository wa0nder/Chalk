'use strict'

import CommentBlock from './CommentBlock.js';
import CommentGrid from './CommentGrid.js';

const useState = React.useState, 
      useEffect = React.useEffect;

const e = React.createElement;

class CommentThread extends React.Component{
  constructor(props){
    super(props);

    this.handlePostCommentBtnClick = this.handlePostCommentBtnClick.bind(this);
  }

  

  handlePostCommentBtnClick(targetElement, parentId, commentText, clearTextCallback){

    const text = commentText;

    // let update = this.state.dbComments.concat( [{body: text}] );
    // this.setState( {dbComments: update} );

    this.props.createNewCommentInDB(parentId, text)

    .then( () => clearTextCallback(targetElement) )

    .catch( err => console.log('handlePostCommentBtnClick() This is not supposed to happen: ', err) );
  }

  render(){

    return(

      e(React.Fragment, null, 

        e('h3', null, this.props.commentThreadDoc._id),

        e(CommentBlock, {parentId: undefined, handlePostCommentBtnClick:this.handlePostCommentBtnClick}),

        e('h4', null, 'Comments:'),

        e(CommentGrid, {
                        commentThreadDoc:this.props.commentThreadDoc, 
                        loadChildComments:this.props.loadChildComments,
                        handlePostCommentBtnClick:this.handlePostCommentBtnClick
                      })
      )
    );
  }
}

export default CommentThread;