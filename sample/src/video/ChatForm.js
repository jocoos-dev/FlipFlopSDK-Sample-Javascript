import React from 'react'
import ChatItem from './ChatItem'
import Send from '../svg/Send'

class ChatForm extends React.Component {

  state = {
    available: false,
    message: ''
  }

  onChange = (e) => {
    const { value } = e.currentTarget
    // console.log(value)
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

  shouldComponentUpdate(nextProps, nextState) { 
    if (nextProps.messages.length !== this.props.messages.length) { 
      if (this.scroller) {
        this.scroller.scrollIntoView({block: "end"});
      }
      return true; 
    }
    if (nextState.message !== this.state.message) {
      return true;
    }
    return false;
  } 

  render() {
    // console.log(this.props.messages)
    let items
    const { message } = this.state
    const { type } = this.props

    if (this.props.messages.length > 0) {
      items = this.props.messages.map((m, index) => (
        <ChatItem type={type} key={index} message={m} />
      ))
    } else {
      const no_message = {
        message: 'Preparing for chat messages...'
      }
      items = <ChatItem type={type} key={0} message={no_message} />
    }

    return (
      <div className="video-chat-group">
        <div className="video-chat">
          <div id="message-scroller" ref={ scroller => this.scroller = scroller } className="list-group chat-group">
            { this.props.empty ? 
            <ChatItem type={type} key={0} message={{
              message: 'There are no chat messages.'
            }} /> :
            items }
          </div>
        </div>
        <div className="video-chat-input input-group">
          <input type="text" className="form-control" placeholder="Messages to send" aria-label="Messages to send" aria-describedby="basic-addon2" value={this.state.message} onChange={this.onChange} onKeyPress={this.onKeyDown} />
          { message.length > 0 ? 
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={this.send}>{type === "pc" && <Send />}<span>Send</span></button>
          </div> : 
          <div className="input-group-append">
            <button className="btn btn-outline-secondary disabled" type="button">{type === "pc" && <Send />}<span>Send</span></button>
          </div> }
        </div>
      </div>
    )
  }
}


export default ChatForm