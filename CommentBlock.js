'use strict';

const e = React.createElement;

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

    this.state = {
      value: ''
    }

    this.handleChangeEvt = this.handleChangeEvt.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.clearText = this.clearText.bind(this);
  }

  clearText(){
    this.setState( {value: ''} );
  }

  handleChangeEvt(event){
    this.setState( {value: event.target.value} );
  }

  handleOnClick(){

    let text = this.state.value;
    let clear = this.clearText;

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
        clear();
      },
      (err) => console.log('new comment could not be saved: ', err)
    );

  }

  displayDB(){

    local_db.get('CommentBlock')

    .then(function(commentDoc){
      console.log('doc: ', commentDoc);
    })
    
    .catch(function (err) {
      console.log('Error .get()ing document: ', err);
    })

  }

  render(){

    return(
      e('div', null,

        e(TextArea, {id: 'textblock', value: this.state.value, onChange: this.handleChangeEvt}, null),

        e(PostButton, {onClick: this.handleOnClick}, 'Post Comment'),

        e('button', {onClick: this.displayDB}, 'Check DB')
      )
    );

  }
}

// const domContainer = document.getElementById('CommentBox');
// ReactDOM.render(e(CommentBlock), domContainer);