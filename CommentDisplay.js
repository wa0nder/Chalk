'use strict';

class ReplyButton extends React.Component{
    
    render(){

        return(
            e('button', null, this.props.children)
        );
    }

}

class CommentDisplay extends React.Component{
    constructor(props){
        super(props);

    }
    
    render(){

        return e('div', null,

                    e('p', null, 'noneAuthor'),

                    e('p', null, this.props.commentText),

                    e(ReplyButton, null, "Reply")

                );
    }
}

// const domContainer = document.getElementById('CommentThread');
// ReactDOM.render(e(CommentBlock), domContainer);