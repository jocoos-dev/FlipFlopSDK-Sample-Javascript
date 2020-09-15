import React from 'react'

const SystemMessage = (props) => (
    <div className="bmd-list-group-col">
      <p className="list-group-item-text system-message">{props.message.message}</p>
    </div>
)

const NormalMessage = (props) => (
  <div className="bmd-list-group-col">
    <div className="list-group-item-text">
    {props.message.user && props.message.user.username ? 
      <div className="message-user text-ellipsis">{props.message.user.username} <span className="from-now">{props.message.created_at_format}</span></div> : 
      <div className="message-user">noname <span className="from-now">{props.message.created_at_format}</span></div> }
      <div className="message-content">{props.message.message}</div>
    </div>
  </div>
)

class ChatItem extends React.Component {

  render() {
    const { message } = this.props
    
    return (
      <div className="list-group-item">
        {message.message_type === 'MESSAGE' ? 
          <NormalMessage message={message} /> : 
          <SystemMessage message={message} /> }
      </div>
    )
  }
}


export default ChatItem