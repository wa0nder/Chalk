'use strict'

import CommentBlock from './CommentBlock.js';
import CommentGrid from './CommentGrid.js';

const e = React.createElement;

function CommentThread(props){

  return(

    e(React.Fragment, null, 

      e('h3', null, props.commentThreadDoc._id),

      e(CommentBlock, {createNewCommentInDB:props.createNewCommentInDB}),

      e('h4', null, 'Comments:'),

      e(CommentGrid, {
                      commentThreadDoc:props.commentThreadDoc,
                      createNewCommentInDB:props.createNewCommentInDB
                    })
    )
  );
}

export default CommentThread;