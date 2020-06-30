'use strict'

const useState = React.useState;

function CommentThread(props){

    const [db_comments, update_db_comments] = useState({comments:undefined});

    return(
        e('div', null, 
        
            e(CommentBlock),
            
            e(CommentDisplay)
        )
    );
}

const domContainer = document.getElementById('CommentThread');
ReactDOM.render(e(CommentThread), domContainer);