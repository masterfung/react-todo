require('./styles/main.styl');

import React from '../node_modules/react/addons';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import Firebase from 'firebase';

let firebaseRef;

var toArray = (obj) => {
  if (obj == null)
    return [];
  return Object.keys(obj).map((key) => {
    obj[key]._key = key;
    return obj[key];
  });
};

class Authorization extends React.Component {
  constructor() {
    super();
  }
  login() {
    firebaseRef.authWithOAuthPopup('github', (err, authData) => {
      if (err) {
        console.log(err);
        alert("Something went wrong! Please try again later!");
      } else {
        this.props.onAuth(authData.uid);
      }
    });
  }

  render() {
    return (
        <div>
          <h1 className="text-center">Login Below to Save Your Items:</h1>
          <Button onClick={this.login}>
            Login with Github
          </Button>
        </div>
    )
  }
}

class Dashboard extends React.Component {
  constructor(){
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.remove = this.remove.bind(this);
    this.state = {
      things: []
    }

  }
  componentDidMount() {
    this.firebaseRef = firebaseRef.child(`users/${this.props.user}`);
    this.firebaseRef.on('value', this.handleFirebaseChange);
  }

  componentWillUnmount () {
    this.firebaseRef.off('value', this.handleFirebaseChange);
  }

  handleFirebaseChange (snapshot) {
    this.setState({ things: toArray(snapshot.val()) });
  }

  handleSubmit (event) {
    event.preventDefault();
    var name = event.target.elements[0].value;
    this.firebaseRef.push({ name });
    event.target.reset();
  }

  remove (thing) {
    this.firebaseRef.child(thing._key).remove();
  }

  render () {
    var { things } = this.state;
    return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <input/>
            <button type="submit">Wow</button>
          </form>
          <ul>
            {things.map((thing) => (
                <li>
                  {thing.name} {' '}
                  <button onClick={this.remove.bind(this, thing)}>Remove</button>
                </li>
            ))}
          </ul>
        </div>
    );
  }
}

class Item extends React.Component {
  render() {
    let styles = {
      uList: {
        paddingLeft: 0,
        marginTop: 20,
        listStyleType: "none"
      },
      listGroup: {
        margin: '5px 0',
        borderRadius: 5
      },
      removeItem: {
        fontSize: 20,
        float: "left",
        position: "absolute",
        top: 12,
        left: 6,
        cursor: "pointer",
        color: "rgb(222, 79, 79)"
      },
      todoItem: {
        paddingLeft: 20,
        fontSize: 17
      }
    };
    let listItems = this.props.items.map((item, index) =>{
      return (
          <li key={index} className="list-group-item" style={styles.listGroup}>
          <span
              className="glyphicon glyphicon-remove"
              style={styles.removeItem}
              onClick={this.props.remove.bind(null, index)}>
          </span>
          <span style={styles.todoItem}>
            {item}
          </span>
          </li>
      )
    });
    return (
        <ul style={styles.uList}>
          {listItems}
        </ul>
    )
  }
}

class AddItem extends React.Component{
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.state = {
      items: [],
      text: ""
    }
  }

  componentDidMount() {
     this.firebaseRef = new Firebase("https://reactjstodo.firebaseio.com/");
    this.firebaseRef.on("child_added", (snapshot) => {
      this.setState({
        items: this.state.items.concat([{key: snapshot.key(), val: snapshot.val()}])
      })
    });

    this.firebaseRef.on('child_removed', (snapshot) => {
      let key = snapshot.key();
      let newList = this.state.items.filter((item) => {
        return item.key !== key;
      });
      this.setState({
        items: newList
      });
    })
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  handleChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.firebaseRef.push({
        text: this.state.text
      });
      this.setState({text: ""});
    }
  }

  handleRemoveItem(index) {
    let item = this.state.items[index];
    this.firebaseRef.child(item.key).remove();
  }

  render() {
    return (
        <div>
          <Item items={this.state.items.map((item) => {return item.val})} remove={this.handleRemoveItem}/>
          <h2 className='text-center'>Enter Your Item:</h2>
          <form onSubmit={ this.handleSubmit }>
            <input
                className = "form-control"
                onChange={ this.handleChange }
                value={ this.state.text }
                placeholder = "Enter New Item" />
          </form>
        </div>
    );
  }
}

class ToDo extends React.Component {
  constructor() {
    super();
    this.handleName = this.handleName.bind(this);
    this.state = {
		list: [],
		name: "Beautiful",
		time: moment(Date.now()).format('MM/DD/gggg hh:mm A'),
        user: null
	}
  }

  handleName(e) {
    this.setState({
      name: e.target.value
    })
  }

  render(){
    let name = this.state.name;
    return (
        <div className="col-sm-6 col-md-offset-3">

          <h1 className="text-center">Welcome {name}! <br /> Your Todo List</h1>
          <Button className="btn btn-primary button-center"><b>Time</b>: {this.state.time}</Button>
          <div className="col-sm-12 text-center">
            <h5 className='text-center'>We know you are beautiful, but feel free
            to change to your name:</h5>
            <input
                type="text"
                className="form-control"
                value={name}
                onChange={this.handleName}
                placeholder="Stranger! Change Name Here" />
              <hr />
            </div>

            <h2 className="text-center"> </h2>
          <AddItem />

        </div>
    )
  }
}

React.render(
  <ToDo />,
  document.querySelector('.container')
);

window.firebaseRef = firebaseRef;