import React from 'react'
import ChatItem from './ChatItem'

class ChatForm extends React.Component {

  state = {
    available: false,
    message: ''
  }

  componentDidMount = () => {
  }

  onChange = (e) => {
    const { value } = e.currentTarget
    console.log(value)
    this.setState({ message: value })
  }

  send = () => {    
    const { message } = this.state
    if (message.length === 0) {
      alert('Enter messages to send')
      return
    }

    this.props.sendMessage(message)
    this.setState({ message: ''})
  }

  onKeyDown = (e) => {
		if(e.key === 'Enter'){
      this.send()
		}
  }

  render() {
    // console.log(this.props.messages)
    let items
    
    if (this.props.messages.length > 0) {
      items = this.props.messages.map((m, index) => (
        <ChatItem key={index} message={m} />
      ))
    } else {
      const no_message = {
        message: 'Preparing for chat messages...'
      }
      items = <ChatItem key={0} message={no_message} />
    }

    return (
      <div className="video-chat-group">
        <div className="video-chat">
          <div id="message-scroller" className="list-group chat-group">
            { this.props.empty ? 
            <ChatItem key={0} message={{
              message: 'There are no chat messages.'
            }} /> :
            items }
          </div>
        </div>
        <div className="video-chat-input input-group mb-3">
          <input type="text" className="form-control" placeholder="Messages to send" aria-label="Messages to send" aria-describedby="basic-addon2" value={this.state.message} onChange={this.onChange} onKeyPress={this.onKeyDown} />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={this.send}>Send</button>
          </div>
        </div>
      </div>
    )
  }
}


export default ChatForm