import React from 'react'

const MessaegProvider = ({type, message}) => {
  switch (message.message_type) {
    case "MESSAGE":
      return <NormalMessage type={type} message={message} />
    case "DM":
      return <DirectMessage type={type} message={message} />
    case "ADMIN": // UPDATE, ACTIVE, INACTIVE
      return null;
    case "JOIN":
    case "LEAVE":
    case "SYSTEM":
      return <SystemMessage message={message} />
    default:
      return <SystemMessage message={message} />
  }
}

const SystemMessage = (props) => (
  <div className="list-group-item">
    <div className="bmd-list-group-col">
      <p className="list-group-item-text system-message">{props.message.message}</p>
    </div>
  </div>
)

const NormalMessage = (props) => (
  <div className="list-group-item">
    <div className="bmd-list-group-col">
      <div className="list-group-item-text">
      {props.message.user && props.message.user.username ? 
        <div className="message-user text-ellipsis">{`${props.message.user.username}`}{props.type && " :"}<span className="from-now">{props.message.created_at_format}</span></div> : 
        <div className="message-user">noname <span className="from-now">{props.message.created_at_format}</span></div> }
        <div className="message-content">{props.message.message}</div>
      </div>
    </div>
  </div>
)

const DirectMessage = (props) => (
  <div className="list-group-item">
    <div className="bmd-list-group-col">
      <div className="list-group-item-text direct-message">
      { props.message.user && props.message.user.username ? 
        <div className="message-user text-ellipsis">{`${props.message.user.username}`}{props.type && " :"}<span className="from-now">{props.message.created_at_format}</span></div> : 
        <div className="message-user">noname <span className="from-now">{props.message.created_at_format}</span></div> }
        <div className="message-content">{props.message.message}</div>
      </div>
    </div>
  </div>
)


class ChatItem extends React.Component {
  render() {
    return (
        MessaegProvider(this.props)
    )
  }
}


export default ChatItem