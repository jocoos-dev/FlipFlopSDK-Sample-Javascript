import * as React from 'react'

export default class Logout extends React.Component {
  componentDidMount = () => {

  }

  getUserid = () => {
    const userId = localStorage.getItem('demo.user_id')
    if (userId === '' || userId === undefined) {
      console.warn('acess token not found');
      alert('acess token not found');
      return
    }

    this.setState({ userId })
  }

  logOut = () => {
    localStorage.clear()
    alert('Session cleared')
  }

  render() {
    return <div className="container-fluid" style={{ marginTop: '50px' }}>
      <p></p>
      <button className="btn btn-raised btn-primary" onClick={this.logOut}>Logout</button>
    </div>
  }
}