import * as React from "react/addons";

let ToDo = React.createClass({
  render(){
    return (
      <div>
        <h1>
        Hello World!
        </h1>
      </div>
    )
  }
})

React.render({
  <Todo />
  document.querySelector('.container')
})
