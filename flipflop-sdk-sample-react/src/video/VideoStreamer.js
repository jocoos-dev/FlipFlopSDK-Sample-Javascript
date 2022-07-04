import React from 'react'
import Configs from '../Configs';
import ChatList from './ChatList'
import VideoGoodsSelector from './VideoGoodsSelector';
import { bindActionCreators } from 'redux';
import { actions as videoActions } from '../modules/video';
import { connect } from 'react-redux';
import { FlipFlop } from 'flipflop-sdk-javascript/dist/flipflop'
import Play from '../svg/Play'
import Stop from '../svg/Stop'
import LiveView from '../svg/LiveView'
import FormBullet from '../svg/FormBullet'
import LiveBadge from '../svg/LiveBadge';
import { isWebRTCSupported } from '../support/browser'
import "./VideoStreamer.css"

const PARAM_APP_KEY = 'appKey'
const PARAM_APP_SECRET = 'appSecret'

class VideoStreamer extends React.Component {
  request = null
  flipflopSDK = null
  videoNode = null
  gossip = null

  state = {
    video: null,
    videoKey: "",
    streamState: 'initialized',
    messages: [],
    itemKeys: [],
    items: []
  }

  componentDidMount = () => {    
    if(!isWebRTCSupported()) {
     alert("browser doesn't support webrtc")
    };

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
    
    const randomUserId = Math.floor(Math.random() * 10001)
    let userId = localStorage.getItem('demo.user_id')
    let userName = localStorage.getItem('demo.user_name')

    if(!userId) {
      userId = randomUserId
      localStorage.setItem('demo.user_id', userId);
    }

    if(!userName) {
      userName = 'user-' + randomUserId
      localStorage.setItem('demo.user_name', userName);
    }

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
    if (!window.confirm('Do you want to stop LIVE?')) {
      return
    }
    
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

      this.setState({videoKey: video.video_key})

      video.state = "LIVE"

      localStorage.setItem('demo.video', 
        JSON.stringify(video))
    }
  }

  viewLive = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const appKey = urlParams.get(PARAM_APP_KEY)
    const appSecret = urlParams.get(PARAM_APP_SECRET)

    window.open(`/videos/${this.state.videoKey}?appKey=${appKey}&appSecret=${appSecret}`);
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
    this.setStreamState('Ready')
  }

  onStart = (streamName) => {
    console.log(`onStart: ${streamName}`)
    this.setStreamState('Started')
  }

  onStop = () => {
    console.log(`onStopped`)
    this.setStreamState('Stopped')
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

    return (
      <div className="video-stream-container">
        <div className="video-stream-group">
          <div className="video-viewer-header">
            <div className="video-title-group">
              <h6 className="title">{video.title}</h6>
              <p>{video.content}</p>
              <div><span className="content"><FormBullet/>{`User ID:${video.user_id}`}</span><span className="content"><FormBullet/>{`Stream state: ${streamState}`}</span></div>
            </div>
            <div className="video-button-group">
              {streamState === 'Ready' ? 
                <button type="button" className="common-button large-button red-button" onClick={this.start}><Play />Start Live</button> : 
                  streamState === 'Started' ?
                    <div style={{display: 'flex'}}>
                      <button type="button" className="common-button large-button white-button" onClick={this.viewLive} style={{marginRight: '5px'}} ><LiveView /><span>View Live</span></button>
                      <button type="button" className="common-button large-button white-button" onClick={this.stop}><Stop /><span>Stop Live</span></button>
                    </div> :
                  streamState === 'Stopped' && ''}
            </div>
          </div>
          <div className="video-viewer">
            <div className="video-view-group">
              <div className="video-view-bg">
                {streamState === 'Started' && <div className="video-badge"><LiveBadge /></div>}
                <video id="screenvideo" className="stream-video" ref={node => this.videoNode = node } width="100%" autoPlay playsInline></video>
              </div>
              <div>
                <VideoGoodsSelector items={this.state.items} onClick={this.onClick} />
              </div>
            </div>
            <div className="video-chat-group">
              <ChatList type="pc" messages={messages} />
            </div>
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
