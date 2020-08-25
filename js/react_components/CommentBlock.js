'use strict';

import {SW_Utils} from './AccountHome.js';

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
class CommentBlock extends React.Component{
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

export default CommentBlock;