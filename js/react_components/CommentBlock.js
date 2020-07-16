'use strict';

//const e = React.createElement;

class PostButton extends React.Component{

  render(){

    return(
      e('button', {onClick:this.props.onClick}, this.props.children)
    );

  }
}

class TextArea extends React.Component {

  render() {

    return e(
      'textarea',
      {id: this.props.id, value: this.props.value, onChange: this.props.onChange},
      this.props.text
    );

  }
}


class CommentBlock extends React.Component{
  constructor(props){
    super(props);
    
  }

  render(){

    return(
      e('div', null,

        e('h4', null, 'Leave a comment!'),

        e(TextArea, {id: 'textblock', value: this.props.commentText, onChange: this.props.handleChangeEvt}, null),

        e(PostButton, {onClick: this.props.handlePostCommentBtnClick}, 'Post Comment')
      )
    );

  }
}

// const domContainer = document.getElementById('CommentBox');
// ReactDOM.render(e(CommentBlock), domContainer);