import React from 'react'
import ChatItem from './ChatItem'

class ChatList extends React.Component {

  render() {
    console.log(this.props.messages)
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
      <div className="video-chat">
        <div id="message-scroller" className="list-group chat-group">
          { this.props.empty ? 
          <ChatItem key={0} message={{
            message: 'There are no chat messages.'
          }} /> :
          items }
        </div>
      </div>
    )
  }
}


export default ChatList