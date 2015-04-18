require('./styles/main.styl');

import React from '../node_modules/react/addons';
import moment from 'moment';
import { Button } from 'react-bootstrap';


class AddItem extends React.Component{
    constructor() {
	    super();
	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.state = {newItem: ''}
    }

  handleChange(e){
    this.setState({
      newItem: e.target.value
    })
  }
  handleSubmit(e){
    if(e.keyCode === 13) {
      this.props.add(this.state.newItem);
      this.setState({
        newItem: ''
      });
    }
  }
  render(){
    return (
      <div>
        <input type="text"
          className="form-control"
          value={this.state.newItem}
          placeholder="New Item"
          onKeyDown={this.handleSubmit}
          onChange={this.handleChange} />
      </div>
    )
  }
}

class List extends React.Component {
  render(){
    let styles = {
      uList: {
        paddingLeft: 0,
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
    let listItems = this.props.items.map((item, idx) =>
    {
      return (
        <li
          key={idx}
          className="list-group-item"
          style={styles.listGroup}>
          <span style={styles.todoItem}>
            {item}
          </span>
          <span
            className="glyphicon glyphicon-remove"
            style={styles.removeItem}
            onClick={this.props.remove.bind(null, idx)}>
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

class ListContainer extends React.Component{
  constructor(){
    super();
	this.handleAddItem = this.handleAddItem.bind(this);
	this.handleRemoveItem = this.handleRemoveItem.bind(this);
	this.handleName = this.handleName.bind(this);
	this.state = {
		list: [],
		name: "Beautiful",
		time: moment(Date.now()).format('MM/DD/gggg hh:mm A')
	}
  }

  handleAddItem(newItem) {
    this.setState({
      list: this.state.list.concat([newItem])
    })
  }
  handleRemoveItem(idx) {
    let newList = this.state.list;
    newList.splice(idx, 1);
    this.setState({
      list: newList
    })
  }
  handleName(e) {
    this.setState({
      name: e.target.value
    })
  }
  render() {
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
          <AddItem add={this.handleAddItem}/>
          <List
            items={this.state.list}
            remove={this.handleRemoveItem}/>
      </div>
    )
  }
}

class ToDo extends React.Component {
  render(){
    return (  <div className="row">
          <ListContainer />
        </div>)
  }
}

React.render(
  <ToDo />,
  document.querySelector('.container')
)
