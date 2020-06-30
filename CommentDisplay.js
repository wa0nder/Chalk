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
        
        return(
            e('p', null, this.props.author),
            e('p', null, this.props.content),
            e(ReplyButton, null, 'Reply')
        );
    }
}

// const domContainer = document.getElementById('CommentThread');
// ReactDOM.render(e(CommentBlock), domContainer);