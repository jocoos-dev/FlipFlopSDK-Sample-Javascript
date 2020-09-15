import React from 'react';
import Content from './Content'
import './App.css'

class App extends React.Component {
  componentWillUnmount = () => {
    localStorage.clear()
  }
  render() {
    return (
      <div className="App">
        <Content />
      </div>
    );
  }
}

export default App;
