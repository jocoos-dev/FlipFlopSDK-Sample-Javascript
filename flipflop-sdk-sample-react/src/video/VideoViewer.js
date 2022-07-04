import React from 'react';
import 'video.js';
import ChatList from './ChatList';
import moment from 'moment';
import ChatForm from './ChatForm';
import GoodsItem from './GoodsItem';
import { bindActionCreators } from 'redux';
import { actions as videoActions } from '../modules/video'
import { connect } from 'react-redux';
import { FlipFlop } from 'flipflop-sdk-javascript/dist/flipflop'
import LiveBadge from '../svg/LiveBadge';
import HlsBadge from '../svg/HlsBadge';
import "./VideoViewer.css"
import 'video.js/dist/video-js.css';
import WebrtcBadge from '../svg/WebrtcBadge';
import Configs from '../Configs';
import VideoPlayer from './VideoPlayer'


const PARAM_APP_KEY = 'appKey'
const PARAM_APP_SECRET = 'appSecret'

class VideoViewer extends React.Component {  
  state = {
    video: null,
    cursor: 0,
    messages: [],
    shown: []
  }

  componentDidMount = () => {    
    const videoKey = this.props.match.params.id;

    this.setVideoKey(videoKey)
    this.setVideo()
  }

  initToken = async (video) => {
    const urlParams = new URLSearchParams(window.location.search);
    const appKey = urlParams.get(PARAM_APP_KEY)
    const appSecret = urlParams.get(PARAM_APP_SECRET)

    if (!appKey || !appSecret) {
      alert('appKey and appSecret parameters are required');
      return;
    }
    
    const randomUserId = Math.floor(Math.random() * 10001)
    let userId = randomUserId
    let userName = 'user-' + randomUserId

    console.log(`appKey: ${appKey}, appSecret: ${appSecret}, userId: ${userId}, userName: ${userName}`);

    FlipFlop.initialize(appKey, appSecret);
    this.sdk = await FlipFlop.authentication(userId, userName);
    this.setState({ appKey, appSecret, userId });
    
    this.player = this.sdk.getPlayer(video.video_key);
    this.player.prepare(this);

    if (this.player) {
      if (video.state === "LIVE") {
        this.player.start()
      } else {
        this.player.getChatHistory(video.created_at)
      }
    }
  }

  componentWillUnmount = () => {
    if (this.videoNode) {
      this.videoNode.dispose()
    }

    if (this.player) {
      this.player.reset()
    }
  }

  setVideoKey = (videoKey) => {
    this.setState({ videoKey })
  }

  onPrepare = () => {
    console.log('onPrepare')
  }

  onStart = () => {
    console.log('onStart')
  }

  onStop = () => {
    console.log(`onStopped`)
  }

  onError = (error) => {
    if (error){
      console.error(error)
    }
  }

  onChatMessgeReceived = (messages) => {    
    const { video } = this.state
    if (!video) {
      return
    }

    if (messages) {
      for (const m of messages) {
        m.elapsed = (m.created_at - video.created_at) / 1000
        m.fromNow = moment(m.created_at).from(video.created_at)
        m.created_at_format = moment(m.created_at).format('HH:mm:ss')
      }
  
      this.setState({ messages })    
    }
  }

  onChatReceived = (message) => {
    message.elapsedTime = Date.now() - message.created_at
    console.log(message);
    
    const { messages } = this.state;
    this.setState({ messages: messages.concat(message) });
  }

  setVideo = () => {
    const item = localStorage.getItem('demo.video');
    console.log(item)

    if (item) {
      const video = JSON.parse(item)
      this.setState({ video })


      this.initToken(video)
    }
  }

  sendMessage = (message) => {
    if (this.player) {
      this.player.sendMessage(message)
    }
  }

  onTimeUpdate = (e) => {
    const cursor = e.target.currentTime

    this.setState({ cursor })
    const { video } = this.state

    if (video.state === 'VOD') {
      this.switchMessage(cursor)
    }
  }

  switchMessage = (now) => {
    const { cursor, shown, messages } = this.state
    
    if (now < cursor) {
      this.setState({
        shown: [],
        messages: [...shown].concat(messages)
      })
      return
    } 
    
    const index = messages.findIndex(m => m.elapsed > now);
    console.log(`cursor: ${parseInt(now)}, index: ${index}`)

    if (index > 0) {
      const toSwitch = messages.splice(0, index);
      console.log(toSwitch.length)
      
      if (toSwitch.length > 0) {
        const toShow = shown.concat(toSwitch)
        console.log(toShow)

        this.setState({
          shown: toShow
        })  
      } 
    }
  }

  toggleMute = () => {
    if (this.videoNode.muted) {
      this.videoNode.muted = false
    } else {
      this.videoNode.muted = true
    }
  }

  render() {
    const { video } = this.state

    if (video === undefined || video === null)  {
      return null;
    }
    
    const src = video.url

    const goods = video.data ? JSON.parse(video.data) : {}
    if(!goods.goods_list) {
      goods.goods_list = Configs.SAMPLE_GOODS
    }

    return (
      <div className="video-viewer-container">
        <div className="video-viewer-wrap">
          <div className="video-viewer-header">
            <div className="video-title-group">
              <h6 className="title">{video.title === '' ? 'No title' : video.title + `(${video.state})`}</h6>
              <p>{video.content === '' ? 'No content' : video.content}</p>
            </div>
          </div>
          <div className="video-viewer">
            <div className='video-view-group' >
              <div className="video-live-group">
                <div className={video.state === 'LIVE' ? "video-live-view-bg" : "video-vod-view-bg"}>
                  { video.state === 'LIVE' ? <div className="video-badge"><LiveBadge /><HlsBadge /></div> : ''}
                    <><VideoPlayer src={video?.url || ""} autoPlay={true} controls={false} onTimeUpdate={this.onTimeUpdate}/></>
                </div>
                {video.state === 'LIVE' ?
                <div className="video-live-view-bg">
                  <div className="video-badge"><LiveBadge /><WebrtcBadge /></div>
                  <video id="screenvideo" width="100%" controls muted autoPlay playsInline></video>
                </div>
                : ''}
              </div>
              {video.state === 'LIVE' ?
                goods && goods.goods_list ?
                <div className="video-goods-group">
                  <div className="row goods-list">
                    {goods.goods_list.map((item, index) => (
                      <GoodsItem key={index} item={item} />
                    ))}
                  </div>
                </div> :
                <div className="video-goods-group"> 
                  <div className="row goods-list">
                    <p className="text-muted">No goods data</p>
                  </div>
                </div> : '' }
                {video.state === 'VOD' ?
                goods && goods.goods_list ?
                <div className="video-goods-group">
                  <div className="row goods-list">
                    {goods.goods_list.map((item, index) => (
                      <GoodsItem key={index} item={item} />
                    ))}
                  </div>
                </div> :
                <div className="video-goods-group"> 
                  <div className="row goods-list">
                    <p className="text-muted">No goods data</p>
                  </div>
                </div> : '' }
              {/* <div>
                {this.videoNode && this.videoNode.muted ?
                <button ref={node => this.unmuteButton = node} type="button" className="btn btn-raised btn-primary" onClick={this.toggleMute}>Unmute</button> :
                <button type="button" className="btn btn-raised btn-secondary" onClick={this.toggleMute}>Mute</button> }
              </div> */}
            </div>
              {/* <div className="video-info">
                <div className="user-info">
                  {video.user_avatar_url !== '' ?
                  <img className="user-avatar" src={video.user_avatar_url} alt={video.user_name === '' ? 'user avatar' : `${video.user_name} \\'s avatar'`}/> : 
                  <img className="user-avatar" src={Configs.DEFAULT_AVATAR} alt={video.user_name === '' ? 'user avatar' : `${video.user_name} \\'s avatar'`}/> 
                  }
                  <span className="card-text text-muted user-name text-ellipsis">{video.user_name === '' ? '...' : video.user_name}</span>
                </div>
                <div className="video-title-group">
                  <h6 className="title">{video.title === '' ? 'No title' : video.title}</h6>
                  <p className="content">{video.content === '' ? 'No content' : video.content}</p>
                </div>
              </div> */}
            {video.state !== 'LIVE' ? 
              <div className='video-chat-group'><ChatList type="pc" empty={this.state.messages.length === 0} messages={this.state.shown} /></div> :
              <div className="video-chat-form-group"><ChatForm type="pc" empty={this.state.messages.length === 0} messages={this.state.messages} sendMessage={this.sendMessage}/></div>}            
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
	({ video }) => ({
    sdk: video.sdk,
    player: video.player
  }),
	(dispatch) => ({
    actions: bindActionCreators(videoActions, dispatch)
  })
)(VideoViewer)
