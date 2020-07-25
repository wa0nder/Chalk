'use strict';

class CommentDisplay extends React.Component{
    constructor(props){
        super(props);
        
        this.showPostReplyBox = this.showPostReplyBox.bind(this);
        this.hidePostReplyBox = this.hidePostReplyBox.bind(this);

        this.state = {showPostReplyBox: false};
    }

    showPostReplyBox(){
        this.setState({showPostReplyBox: true});
    }

    hidePostReplyBox(elem){
        elem = elem.parentElement;
        elem.style.opacity = window.getComputedStyle(elem).opacity;

        let self = this;

        (function fade(){
            ((elem.style.opacity -= 0.05) <= 0) ? self.setState.call(self,{showPostReplyBox: false}) : setTimeout(fade, 20);
        })();
    }
    
    render(){

        let replyBox = null;
        if(this.state.showPostReplyBox){
            let parent = document.getElementById(this.props.id);
            let gc = parent.style.gridColumn;
            let gr = parent.style.gridRow;
            replyBox = e(CommentBlock, 
                {
                    className:'responseBox', 
                    parentId: this.props.id,
                    style:{gridColumn: gc, gridRow: gr},
                    handlePostCommentBtnClick: this.props.handlePostCommentBtnClick,
                    hidePostReplyBox: this.hidePostReplyBox
                });
        }

        return e(React.Fragment, null,

                    e('div', {id:this.props.id, className:this.props.className, style:this.props.style},

                        e('h4', null, `@${(this.props.comment.at ? this.props.comment.at : 'none')}`),

                        e('h4', null, `Author: ${(this.props.comment.author || 'none')}`),

                        e('p', {className:'commentBody'}, this.props.comment.body),

                        e('button', {onClick: this.showPostReplyBox}, 'Reply')

                    ),
                    replyBox
                );
    }
}