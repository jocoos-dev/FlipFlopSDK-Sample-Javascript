import React from 'react';
import 'video.js/dist/video-js.css';
import 'video.js';
import ChatList from './ChatList';
import moment from 'moment';
import ChatForm from './ChatForm';
import { bindActionCreators } from 'redux';
import { actions as videoActions } from '../modules/video'
import { connect } from 'react-redux';
import './MobileViewer.css'
import Gossip from '../support/gossipClient';
import Live from '../svg/Live';
import Close from '../svg/Close';


const MobileGoodsItem = ({ item })=> {
  return (
    <div className="goods-item">
      <img src={item.thumbnail_url} alt={`${item.title} thumnail`}/>
      <div className="goods-info">
        <p className="title text-ellipsis">{item.title}</p>
        <div className="goods-price-group">
          <span className="price">{`${item.price} 원`}</span>
          <span className="discount">{item.discount}</span>
          <span className="live-badge">라이브가</span>
        </div>
      </div>
      <p className="goods-count-badge">3</p>
    </div>
  )
}

class MobileViewer extends React.Component {  
  url = '12345'
  userId = '12345'
  accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE5MjY1ODE2OTgsImp0aSI6ImRiMTM0N2ZjLWEzYjQtNGYwZC05NTJkLTcxM2M4MzNhZjY3MSIsImFwcF9vd25lciI6MSwiY2xpZW50X2lkIjoiZmxpcGZsb3AifQ._VIDqtnSbM5O8S8S6WIShXW9Ov1Utj8UfpNQVd0Xs2k'
  liveKey = 'zczN3Q0MFRUN3oTYxAzM1cD' 
  gossipUrl = 'wss://media.flipflop.tv:8100/gossip'
  gossip

  state = {
    video: null,
    cursor: 0,
    messages: [],
    shown: []
  }

  componentDidMount = () => {
    const videoKey = this.props.match.params.id;
    console.log(videoKey)

    this.initVideo()
  }

  componentWillUnmount = () => {
    if (this.videoNode) {
      this.videoNode.dispose()
    }
    if (this.gossip) {
      this.gossip.disconnect()
    }
  }

  initVideo = async () => {    
    const user = {
      id: '12345',
      username: '플립플랍',
    }

    this.gossip = Gossip.client(this.gossipUrl, user);
    await this.gossip.connect(this.accessToken)
    await this.gossip.join(this.liveKey, this.onChatReceived, 
      (err) => {
        if (err) {
          console.error(err);
        }
    });
    
    this.setState({ video: {
      url: 'https://s3.ap-northeast-2.amazonaws.com/flipflop-prod/9z27htVnKe/videos/12036/vod.m3u8',
      title: '각질부각 안되는 3CE 벨벳 립틴트',
      state: 'LIVE',
      content: '',
      user_name: '애리얼',
      data: JSON.stringify({goods_list: [{
        id: 5, 
        title: '[3CE] 벨벳 립 틴트 4g', 
        price: '19,900', 
        discount: '15%', 
        thumbnail_url: 'https://shop-phinf.pstatic.net/20181228_46/skintoktalk_1545962390562vaoSw_JPEG/28593570204060548_313533979.jpg?type=m510'}
      ]})
    }})
  }

  componentWillUnmount = () => {
    if (this.videoNode) {
      this.videoNode.dispose()
    }

    if (this.gossip) {
      this.gossip.disconnect()
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

    if (message.message_type === 'JOIN') {
      message.message = `${message.user.username} 님이 입장하셨습니다.` 
    } else if (message.message_type === 'LEAVE') {
      message.message = `${message.user.username} 님이 나갔습니다.` 
    }

    this.setState({ messages: messages.concat(message) });
  }

  setVideo = ( video ) => {
    this.setState({ video })
  }

  sendMessage = (message) => {
    if (this.gossip) {
      this.gossip.sendMessage({
        message: message
      })
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

  onClose = () => {
    if (!window.confirm('Do you want to quit this video?')) {
      return
    }
    window.location.href = '/'
  }

  render() {
    const { video } = this.state

    if (!video) {
      return null
    }

    const src = video.url
    const goods = video.data ? JSON.parse(video.data) : null
    // console.log(video)
    // console.log(goods.goods_list)

    return (
      <div className="container mobile-container">
        <div className="row mobile-viewer">
          <div className="video-header">
            <div className="video-info">
              <div className="video-title-group">
                <p className="title">{video.title === '' ? 'No title' : video.title}</p>
                <p className="user-name text-ellipsis">{video.user_name === '' ? '...' : video.user_name} <Live /></p>
              </div>
            </div>
            <button type="button" className="close" onClick={this.onClose}>
              <Close />
            </button>
          </div>
          <div className="video-group">
            <div data-vjs-player>
              <video ref={node => this.videoNode = node} className="video-js vjs-default-skin vjs-big-play-centered" playsInline x-webkit-ariplay="allow" webkit-playsinline="allow" preload="auto" autoPlay={true} muted data-setup='{"fluid": true}' poster={video.thumbnail_url} onTimeUpdate={this.onTimeUpdate}>
                { src !== '' && src.indexOf('m3u8') > 0 ?
                  <source type="application/x-mpegURL" src={src} /> :
                  <source type="video/mp4" src={src} /> }
              </video>
            </div>
          </div>
          <div className="video-body">
            <div className="goods-group">
              {goods.goods_list.map((item, index) => (
                <MobileGoodsItem key={index} item={item} />
              ))}
            </div>
            <div className="gossip-group">
              {video.state !== 'LIVE' ? 
                <ChatList empty={this.state.messages.length === 0} messages={this.state.shown} /> :
                <ChatForm empty={this.state.messages.length === 0} messages={this.state.messages} sendMessage={this.sendMessage}/>}
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
)(MobileViewer)