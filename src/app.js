require('./styles/main.styl');

import React from '../node_modules/react/addons';
import moment from 'moment';
import Router  from 'react-router';
let { Route, RouteHandler, Link } = Router;
import { Button } from 'react-bootstrap';
import Firebase from 'firebase';

let firebaseRef = new Firebase("https://reactjstodo.firebaseio.com/");

let toArray = (obj) => {
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
    console.log(this.props.onAuth)
    firebaseRef.authWithOAuthPopup('twitter', (err, authData) => {
      if (err) {
        console.log(err);
        alert("Something went wrong! Please try again later!");
      } else {
        console.log(authData.uid);
        this.props.onAuth(authData.uid);
      }
    });
  }

  render() {
    let login = this.login.bind(this);
    return (
        <div>
          <h1 className="text-center">Log In Below to Save Your Items:</h1>
          <Button onClick={login}>
            Login with Twitter
          </Button>
        </div>
    )
  }
}

class Logout extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {

  }
}


class Dashboard extends React.Component {
  constructor(){
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFirebaseChange = this.handleFirebaseChange.bind(this);
    this.remove = this.remove.bind(this);
    this.state = {
      things: []
    }

  }
  componentDidMount() {
    firebaseRef = firebaseRef.child(`users/${this.props.user}`);
    firebaseRef.on('value', this.handleFirebaseChange);
  }

  componentWillUnmount () {
    firebaseRef.off('value', this.handleFirebaseChange);
  }

  handleFirebaseChange (snapshot) {
    this.setState({ things: toArray(snapshot.val()) });
  }

  handleSubmit (event) {
    event.preventDefault();
    var name = event.target.elements[0].value;
    firebaseRef.push({ name });
    event.target.reset();
  }

  remove (thing) {
    firebaseRef.child(thing._key).remove();
  }

  render () {
    var { things } = this.state;
    return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <input className="form-control" />
          </form>
          <ul>
            {things.map((thing, index) => (
                <li key={index}>
                  {thing.name} {' '}
                  <Button onClick={this.remove.bind(this, thing)}>Remove</Button>
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
     //this.firebaseRef = new Firebase("https://reactjstodo.firebaseio.com/");
    firebaseRef.on("child_added", (snapshot) => {
      this.setState({
        items: this.state.items.concat([{key: snapshot.key(), val: snapshot.val()}])
      })
    });

    firebaseRef.on('child_removed', (snapshot) => {
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
    firebaseRef.off();
  }

  handleChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      firebaseRef.push({
        text: this.state.text
      });
      this.setState({text: ""});
    }
  }

  handleRemoveItem(index) {
    let item = this.state.items[index];
    firebaseRef.child(item.key).remove();
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
    this.handleAuth = this.handleAuth.bind(this);
    this.state = {
		name: "Beautiful",
		time: moment(Date.now()).format('MM/DD/gggg hh:mm A'),
        user: null
	}
  }

  handleAuth(uid) {
    this.setState({
      user: uid
    });
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
          <Dashboard user={this.state.user}/>
          {this.state.user === null ? (
              <Authorization onAuth={this.handleAuth} />
          ) : (
              <Link to='dashboard'><Dashboard user={this.state.user}/></Link>,
              <AddItem />
          )}

        </div>
    )
  }
}

let routes = (
    <Route handler={ToDo}>
      <Route name="login" handler={Authorization} />
      <Route name="logout" handler={Logout} />
      <Route name="dashboard" handler={Dashboard} />
    </Route>
);

Router.run(routes, (Handler) => {
  React.render(
      <Handler />,
      document.querySelector('.container')
  );
});