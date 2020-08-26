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
        this.toggleShowContent = this.toggleShowContent.bind(this);

        this.state = {showPostReplyBox: false, showOverflowBtn: false};
        this.hasOverflow = false;
    }

    componentDidMount(){
        this.applyOverflowButton();
    }

    applyOverflowButton(){

        let c = document.querySelector('#'+this.props.id);
        let body = c.querySelector('.commentBox__body');

        if(body.clientHeight < body.scrollHeight && !this.hasOverflow){

            this.setState({showOverflowBtn: true});
            this.hasOverflow = true;
        }
    }

    toggleShowContent(event){
        let elem = event.target;
        let parent = (elem.parentElement.className === 'commentBox') ? elem.parentElement : elem.parentElement.parentElement;
        let style = parent.getElementsByClassName('commentBox__body')[0].style;

        if(style.overflowY === 'scroll'){

            elem.parentElement.scrollTo(0,0);
            style.overflowY = 'hidden';
            this.setState({showOverflowBtn:true});
        }
        else{ 
            style.overflowY = 'scroll'; 
            this.setState({showOverflowBtn:false});
        }
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

        let comment = this.props.comment;
        let replyBox = null;
        let date = undefined;

        if(this.state.showPostReplyBox){
            let parent = document.getElementById(this.props.id);
            let gc = parent.style.gridColumn;
            let gr = parent.style.gridRow;
            replyBox = e(CommentBlock, {
                            className:'commentBlock commentBlock--invertColors', 
                            parentId: this.props.id,
                            parentAuthor: comment.author,
                            style:{gridColumn: gc, gridRow: gr},
                            createNewCommentInDB:this.props.createNewCommentInDB,
                            hidePostReplyBox: this.hidePostReplyBox
                        }
                    );
        }

        if(comment.date){
            let d = new Date(comment.date);
            let day = d.toDateString().slice(0,3);
            date = `${d.getMonth()}/${d.getFullYear().toString().slice(2)} ${day} ${d.getHours()%12}:${d.getMinutes()}`;
        }

        return e(React.Fragment, null,

            e('div', {id:this.props.id, className:this.props.className, style:this.props.style},

                e('div', {className: 'commentBox__header'},

                    e('div', {className: 'commentBox__header__info'},

                        (!comment.at) ? null : e('p', null, `@${comment.at}`),

                        e('p', null, `${(comment.author || 'Anon')}`),

                        e('p', null, (date || 'date'))
                    ),

                    e('img', {className: 'profile__item profile__item--small', src:'profileCircle.png'})
                ),

                e('p', {className:'commentBox__body'},

                    comment.body,

                    e('br'),

                    ((this.hasOverflow) ? e('button', {onClick:this.toggleShowContent}, 'Show Less') : null)
                ),

                ((this.state.showOverflowBtn) ? e('button', {className:'commentBox__showMoreLbl', onClick:this.toggleShowContent}, 'Show More') : null),

                e('div', {className:'commentBox__actions', style:{background:this.props.actionBarColor}},

                    e('div', {className:'commentBox__actions__likes'},

                        e('p', {style:{display:'inline'}}, (comment.likes) ? comment.likes : '0'),

                        e('button', {onClick:() => this.props.updateCommentLikesInDB(this.props.id)}, 'Like'),

                    ),

                    e('button', {onClick: this.showPostReplyBox}, 'Reply'),

                    e('div', {className:'commentBox__actions__indicator'})

                ),
            ),

            replyBox
        );
    }
}

export default CommentDisplay;