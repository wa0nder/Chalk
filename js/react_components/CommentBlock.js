'use strict';

import {SW_Utils} from './AccountHome.js';

const e = React.createElement;

class TextArea extends React.Component {

  render() {

    return e(
      'textarea',
      {className: 'commentBlockTextArea', value: this.props.value, onChange: this.props.onChange},
      this.props.text
    );

  }
}


class CommentBlock extends React.Component{
  constructor(props){
    super(props);
    
    this.handlePostComment = this.handlePostComment.bind(this);
    this.state = {
      commentText: ''
    }

    this.clearText = this.clearText.bind(this);
    this.handleChangeEvt = this.handleChangeEvt.bind(this);
    this.handleHidePostReplyBox = this.handleHidePostReplyBox.bind(this);
  }

  clearText(element){
    this.setState({commentText:''});

    if(this.props.hidePostReplyBox){
      this.props.hidePostReplyBox(element);
    }
  }

  handleChangeEvt(event){
      this.setState({commentText:event.target.value});
  }

  handlePostComment(event){

    let element = event.target;

    if(this.state.commentText.length === 0){
      SW_Utils.flashMessage(element, 'red', 'Nothing to post!');
      return;
    }

    this.props.handlePostCommentBtnClick(element, this.props.parentId, this.state.commentText, this.clearText);
  }

  handleHidePostReplyBox(event){
    this.props.hidePostReplyBox(event.target);
  }

  render(){

    return(
      e('div', {id: this.props.id, className:this.props.className, style:this.props.style},

        e('h4', null, 'Leave a comment!'),

        e(TextArea, {value: this.state.commentText, onChange: this.handleChangeEvt}, null),

        e('button', {style:{display:'inline'}, onClick:this.handlePostComment}, 'Post Comment'),

        e('button', {style:{display:'inline'}, onClick:this.handleHidePostReplyBox}, 'Cancel')
        
      )
    );

  }
}

export default CommentBlock;