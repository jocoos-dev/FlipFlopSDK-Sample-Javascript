import React from 'react'
import Configs from '../Configs';
import ChatList from './ChatList'
import VideoGoodsSelector from './VideoGoodsSelector';
import { bindActionCreators } from 'redux';
import { actions as videoActions } from '../modules/video';
import { connect } from 'react-redux';
import { FlipFlop } from 'flipflop-sdk-javascript-dev/dist/flipflop'


const PARAM_APP_KEY = 'appKey'
const PARAM_APP_SECRET = 'appSecret'

class VideoStreamer extends React.Component {
  request = null
  flipflopSDK = null
  videoNode = null
  gossip = null

  state = {
    video: null,
    streamState: 'initialized',
    messages: [],
    itemKeys: [],
    items: []
  }

  componentDidMount = () => {    
    this.initToken()
  }
  
  initToken = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const appKey = urlParams.get(PARAM_APP_KEY)
    const appSecret = urlParams.get(PARAM_APP_SECRET)

    if (!appKey || !appSecret) {
      alert('appKey and appSecret parameters are required');
      return;
    }

    const userId = localStorage.getItem('demo.user_id');
    const userName = localStorage.getItem('demo.user_name');

    console.log(`appKey: ${appKey}, appSecret: ${appSecret}, userId: ${userId}, userName: ${userName}`);

    FlipFlop.initialize(appKey, appSecret);
    this.sdk = await FlipFlop.authentication(userId, userName);
    this.setState({ appKey, appSecret, userId });
    
    this.streamer = this.sdk.getStreamer()
    this.streamer.delegate = this

    this.setVideo({ 
      title: 'Sample Live title...', 
      content: 'Sample Live content...', 
      user_id: userId, 
      user_name: userName,
      user_avatar_url: Configs.DEFAULT_AVATAR
     })
  }

  componentWillUnmount = () => {
    if (this.streamer) {
      this.streamer.reset()
    }
  }

  createRequest = (userId) => {
    this.request = {
      title: 'Sample Live title...',
      content: 'Sample Live content...',
      user_id: userId,
      user_name: 'streamer-' + userId,
      user_avatar_url: Configs.DEFAULT_AVATAR
    }
  }

  setVideo = (video) => {
    this.setState({ video })

    if (this.streamer) {
      this.streamer.prepare(this.videoNode)
    }
  }

  setStreamState = (streamState) => {
    console.log(`--- janus state: ${streamState}`)
    this.setState({ streamState })
  }

  stop = () => {
    if (this.streamer) {
      this.streamer.stop()
    }

    this.setState({ items: [] })
  }

  start = async () => {
    const { items } = this.state

    if (this.streamer) {
      const video = await this.streamer.start(
        this.state.video.title,
        this.state.video.content,
        JSON.stringify({goods_list: items})
      )

      console.log(video)
    }
  }

  prepare = () => {
    window.location.reload(true);
  }

  onClick = (item) => {
    console.log(item)

    const { items } = this.state
    const index = items.findIndex(i => i.id === item.id)
    
    if (items && index >= 0) {
      items.splice(index, 1)
    } else {
      items.push(item)
    }

    console.log(items)  
    this.setState({ items })
  }
  
  onPrepare = () => {
    console.log('onPrepare')
    this.setStreamState('ready')
  }

  onStart = (streamName) => {
    console.log(`onStart: ${streamName}`)
    this.setStreamState('started')
  }

  onStopped = () => {
    console.log(`onStopped`)
    this.setStreamState('stopped')
  }

  onCompleted = () => {
    console.log(`onCompleted`)
  }

  onChatReceived = (message) => {
    message.elapsedTime = Date.now() - message.created_at
    console.log(message);
    
    const { messages } = this.state;
    this.setState({ messages: messages.concat(message) });
  }

  onError = (error) => {
    if (error){
      console.error(error)
    }
  }

  render() {
    if (this.state.video === null) {
      return null
    }

    const { video, streamState, messages } = this.state
    console.log(video)

    return (
      <div className="container-fluid">
        <div className="row video-viewer">
          <div className="col-xl-6">
            <video id="screenvideo" className="stream-video" ref={node => this.videoNode = node } width="100%" autoPlay playsInline></video>
            <div>
              <VideoGoodsSelector items={this.state.items} onClick={this.onClick} />
            </div>
            { streamState === 'ready' ? 
            <button type="button" className="btn btn-raised btn-primary" onClick={this.start} style={{marginTop: '30px'}}>Start Live</button> : 
              streamState === 'started' ?
            <button type="button" className="btn btn-raised btn-secondary" onClick={this.stop} style={{marginTop: '30px'}}>Stop Live</button> :
              streamState === 'stopped' ? 
            <button type="button" className="btn btn-raised btn-primary" onClick={this.prepare} style={{marginTop: '30px'}}>Prepare</button> : ''}
          </div>
          <div className="col-xl-6 video-info-group">
            <div className="video-info">
              <div className="user-info">
                <img className="user-avatar" src={video.user_avatar_url} alt={`${video.user_name} \\'s avatar'`}/>
                <span className="card-text text-muted user-name text-ellipsis">{video.user_name}</span>
              </div>
              <div className="video-title-group">
                <h6 className="title">{video.title}</h6>
                <p className="text-muted">{video.content}</p>
                <p className="text-muted">{`user id: ${video.user_id}`}</p>
                <p className="text-muted">{`stream state: ${streamState}`}</p>
              </div>
            </div>
            <ChatList messages={messages} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
	({ video }) => ({
    sdk: video.sdk
  }),
	(dispatch) => ({
    actions: bindActionCreators(videoActions, dispatch)
  })
)(VideoStreamer)
