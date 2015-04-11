let React = require('react')

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

let List = React.createClass({
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
        <li key={idx} className="list-group-item" style={styles.listGroup}>
          <span
            className="glyphicon glyphicon-remove"
            style={styles.removeItem}
            onClick={this.props.remove.bind(null, idx)}>
          </span>
          <span style={styles.todoItem}>
            {item}
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
})

let ListContainer = React.createClass({
  getInitialState(){
    return {
      list: []
    }
  },
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
  render() {
    return (
      <div className="col-sm-6 col-md-offset-3">
        <div className="col-sm-12">
          <h3 className="text-center"> Todo List </h3>
          <AddItem add={this.handleAddItem}/>
          <List items={this.state.list} remove={this.handleRemoveItem}/>
        </div>
      </div>
    )
  }
})

let ToDo = React.createClass({
  render(){
    return (
      <div className="row">
          <ListContainer />
        </div>
    )
  }
})

React.render(
  <ToDo />,
  document.querySelector('.container')
)
