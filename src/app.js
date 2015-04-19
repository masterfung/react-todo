require('./styles/main.styl');

import React from '../node_modules/react/addons';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import Firebase from 'firebase';

class Item extends React.Component{
  render() {
    let createItem = function(item, index) {
      return <li key={ index }>{ item.text }</li>;
    };
    return <ul>{ this.props.items.map(createItem) }</ul>;
  }
}

class AddItem extends React.Component{
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      items: [],
      text: ""
    }
  }

  componentWillMount() {
    this.firebaseRef = new Firebase("https://reactjstodo.firebaseio.com/items/");
    this.firebaseRef.limitToLast(25).on("child_added", function(dataSnapshot) {
      // Only keep track of 25 items at a time
      if (this.items.length === 25) {
        this.items.splice(0, 1);
      }

      this.items.push(dataSnapshot.val());
      this.setState({
        items: this.items
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  onChange(e) {
    this.setState({text: e.target.value});
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

  render() {
    return (
        <div>
          <Item items={ this.state.items } />
          <form onSubmit={ this.handleSubmit }>
            <input
                className = "form-control"
                onChange={ this.onChange }
                value={ this.state.text } />
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
		time: moment(Date.now()).format('MM/DD/gggg hh:mm A')
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
