let React = require('react')

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
