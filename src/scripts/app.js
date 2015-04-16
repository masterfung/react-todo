let React = require('react/addons');
let moment = require('moment');
let rb = require('react-bootstrap');

require('../styles/main.styl');

let {Button} = rb

let AddItem = React.createClass({
  getInitialState(){
    return {
      newItem: ''
    }
  },
  handleChange(e){
    this.setState({
      newItem: e.target.value
    })
  },
  handleSubmit(e){
    if(e.keyCode === 13) {
      this.props.add(this.state.newItem);
      this.setState({
        newItem: ''
      });
    }
  },
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
})

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
    })
      return (
        <ul style={styles.uList}>
          {listItems}
        </ul>
      )

  }
}

let ListContainer = React.createClass({
  getInitialState(){
    return {
      list: [],
      name: "Beautiful",
      time: moment(Date.now()).format('MM/DD/gggg hh:mm A')
    }
  },
  // propTypes() {
  //   time: React.propTypes.number.isRequired
  // },
  handleAddItem(newItem) {
    this.setState({
      list: this.state.list.concat([newItem])
    })
  },
  handleRemoveItem(idx) {
    let newList = this.state.list;
    newList.splice(idx, 1);
    this.setState({
      list: newList
    })
  },
  handleName(e) {
    this.setState({
      name: e.target.value
    })
  },
  render() {
    let name = this.state.name;
    return (

      <div className="col-sm-6 col-md-offset-3">
          <h1 className="text-center">Welcome {name}! <br /> Your Todo List</h1>
          <Button className="btn btn-primary"><b>Time</b>: {this.state.time}</Button>
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
})

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
