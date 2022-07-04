import React from 'react'
import ChatItem from './ChatItem'

class ChatList extends React.Component {

  shouldComponentUpdate(nextProps) { 
    if (nextProps.messages.length !== this.props.messages.length) { 
      if (this.scroller) {
        this.scroller.scrollIntoView({block: "end"});
      }
      return true; 
    }
    return false; 
  } 

  render() {
    const { type } = this.props;
    console.log(this.props.messages)
    let items
    
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
      <div className="video-chat">
        <div id="message-scroller" ref={ scroller => this.scroller = scroller } className="list-group chat-group">
          { this.props.empty ? 
          <ChatItem type={type} key={0} message={{
            message: 'There are no chat messages.'
          }} /> :
          items }
        </div>
      </div>
    )
  }
}


export default ChatList