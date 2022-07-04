import React from 'react';
import VideoItem from './VideoItem';
import { bindActionCreators } from 'redux';
import { actions as videoActions } from '../modules/video'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FlipFlop } from 'flipflop-sdk-javascript/dist/flipflop'

const PARAM_APP_KEY = 'appKey'
const PARAM_APP_SECRET = 'appSecret'

class VideoList extends React.Component {
  state = {
    videos: [],
    scrollLock: false,
    userId: '',
    appKey: '',
    appSecret: ''
  };

  componentDidMount = async () => {
    this.addScrollEvent(this.loadMoreVideos)

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
    
    console.log(`appKey: ${appKey}, appSecret: ${appSecret}, userId: ${userId}, userName: ${userName}`)

    // For tests
    await this.initToken(appKey, appSecret, userId, userName);
    await this.loadVideos()
  }

  setToken = (appKey, appSecret) => {
    this.setState({ appKey, appSecret })
  }

  setUser = (userId) => {
    this.setState({ userId })
    localStorage.setItem('demo.user_id', userId)
  }

  initToken = async (appKey, appSecret, userId, userName) => {
    FlipFlop.initialize(appKey, appSecret);
    this.sdk = await FlipFlop.authentication(userId, userName)
    this.setState({ appKey, appSecret, userId })

    localStorage.setItem('demo.app_key', appKey)
    localStorage.setItem('demo.app_secret', appSecret)
    
    this.props.actions.setSdk(this.sdk)
  }

  addScrollEvent = (callback) => {
    window.onscroll = function(ev) {
      if (window.scrollY + document.documentElement.clientHeight
        > document.documentElement.scrollHeight - 200) {
        callback()
      }
    };
  }

  loadVideos = async () => {
    if (this.sdk) {
      this.loader = this.sdk.getVideoListLoader()
      const videos = await this.loader.next()
      console.log(videos)

      this.setVideos(videos)
    } else {
      console.error('this.sdk is undefined')
    }
  }

  loadMoreVideos = async () => {
    const { scrollLock } = this.state

    if (!scrollLock) {
      this.setState({ scrollLock : true })

      if (this.loader) {
        const videos = await this.loader.next()
        this.setVideos(videos)
      }
    } else {
      console.log('scrollLock: ' + scrollLock)
    }
  }

  setVideos = (vidoes) => {
    this.setState({ videos: [...this.state.videos].concat(vidoes),
      scrollLock: false });
  }

  changeUserId = () => {
    localStorage.clear();
    window.location.reload();
  }

  render() {
    const { userId, appKey, appSecret, videos } = this.state

    console.log(videos)

    const items = videos.map((v, index) =>
      <VideoItem key={index} video={v} link={`/videos/${v.video_key}?appKey=${appKey}&appSecret=${appSecret}`}/>
    )

    return (
      <div className="container">
        <div className="feed-list">
          <div className="row">
            <div className="col-xl-12 text-left">
              <a href={`/videos?appKey=${appKey}&appSecret=${appSecret}`} target="_blank" rel="noopener noreferrer" className="btn btn-raised btn-primary">Start Live</a>
              <Link to={{
                  pathname: `/videos?appKey=${appKey}&appSecret=${appSecret}`,
                  state: {
                    sdk: this.sdk
                  }
                }} target="_blank" />

              <button type="button" className="btn btn-raised btn-secondary" onClick={this.changeUserId} style={{marginLeft: '10px'}}>{`Change User (${userId})`}</button>
            </div>
            {this.state.videos.length > 0 ? 
              items : 
              <div className="col-xl-12 text-center">
                <p className="text-muted" style={{marginTop: '30px'}}>There are no videos</p>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
	() => ({}),
	(dispatch) => ({
    actions: bindActionCreators(videoActions, dispatch)
  })
)(VideoList)
