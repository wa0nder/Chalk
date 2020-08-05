'use strict';

import CommentBlock from './CommentBlock.js';

const e = React.createElement;

/** Expects six properties from the props object
 * @param {String} id - used to connect rendered comment to specific comment in DB document
 * @param {String} className - for applying CSS class
 * @param {Number} style.gridRow - to render matching parent gridRow position
 * @param {Number} style.gridColumn - to render matching parent gridColumn position
 * @param {Object} comment - object holding comment data schema from database (at, author, date, body, ...)
 * @param {Function} createNewCommentInDB - self-explanatory function call needed for passing to CommentBlock
 */
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

    /**
     * Expects event OR element depending on calling function
     * @param {Event} event - if undefined, use element parameter, otherwise event.target
     * @param {HTMLElement} element
     */
    hidePostReplyBox(event, element){
        let elem = (event !== undefined) ? event.target : element;
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
            replyBox = e(CommentBlock, {
                            className:'responseBox', 
                            parentId: this.props.id,
                            style:{gridColumn: gc, gridRow: gr},
                            createNewCommentInDB:this.props.createNewCommentInDB,
                            hidePostReplyBox: this.hidePostReplyBox
                        }
                    );
        }

        return e(React.Fragment, null,

                    e('div', {id:this.props.id, className:this.props.className, style:this.props.style},

                        (!this.props.comment.at) ? null : e('h4', null, `@${this.props.comment.at}`),

                        e('h4', null, `Author: ${(this.props.comment.author || 'none')}`),

                        e('p', {className:'commentBody'}, this.props.comment.body),

                        e('button', {onClick: this.showPostReplyBox}, 'Reply')

                    ),
                    replyBox
                );
    }
}

export default CommentDisplay;