'use strict'

const useState = React.useState, 
      useEffect = React.useEffect;

function CommentThread(props){

    const [dbComments, updateDBComments] = useState([]);
    const [commentText, updateCommentText] = useState('');

    //run once when component is first mounted
    useEffect(function(){
  
      local_db.get('CommentBlock')
  
      .then(function(commentDoc){

        updateDBComments( dbComments.concat(commentDoc.comments) );
      })
      
      .catch(err => console.log('Error: ', err.status, '-', err.message, ' : ', err));

    }, []);

    function clearText(){
        updateCommentText('');
    }
    
    function handleChangeEvt(event){
        updateCommentText(event.target.value);
    }

    function handlePostCommentBtnClick(){

      const text = commentText;

      updateDBComments( dbComments.concat([{text: text}]) );
  
      local_db.get('CommentBlock')
  
      .then(function(commentDoc){
  
        commentDoc.comments.push( {text: text} );
  
        return local_db.put(commentDoc);
      })
      
      .catch(function (err) {
  
        if(err.name === 'not_found') {
  
          return local_db.put({
            _id: 'CommentBlock',
            comments: [
              {text: text}
            ]
          });
          
        }
        
        throw err;
      })
  
      .then( 
        () => {
          console.log('new comment saved.')
          
          clearText();
        },

        (err) => console.log('new comment could not be saved: ', err)

      );
  
    }
    
    function displayDB(){

      console.log('dbComments: ', dbComments);
  
      local_db.get('CommentBlock')
  
      .then( function(commentDoc){
        console.log('doc: ', commentDoc);
      })
      
      .catch( function (err) {
        console.log('Error .get()ing document: ', err);
      })
  
    }
    
    let cnt = 0;
    return(
        e(React.Fragment, null, 

          e(CommentBlock, {commentText, handlePostCommentBtnClick, handleChangeEvt, displayDB}),

          e(React.Fragment, null, dbComments.map( item => e(CommentDisplay, {key: (cnt+=1), commentText:item.text}) ) )

        )
    );
}

const domContainer = document.getElementById('CommentThread');
ReactDOM.render(e(CommentThread), domContainer);