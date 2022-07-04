import * as React from 'react';
import { actions as videoActions } from '../modules/video'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import videojs from 'video.js';
// import 'video.js/dist/video-js.css';

class VideoPlayer extends React.Component {

  constructor(props) {
    super(props)
    this.player = undefined;
    this.videoNode = undefined;
  }

  componentDidMount = () => {
    this.player = videojs(this.videoNode)
    this.props.videos.setPlayer(this.player);

    const limit = this.props.retryLimit || 86400 // 24hours
    const interval = this.props.retryInterval || 3000
    this.addRetryHandler(limit, interval)
  }

  addRetryHandler = (limit, interval) => {
    if (this.player) {
      let retry = 0;
      const that = this.player
      console.log("this.player", this.player)
      this.player.on('error', () => {
        if(retry < limit){
          console.log(`Video source went wrong! Retrying.. ${++retry}`);
          setTimeout(() => {
            console.log(this.player)
            if (this.player.src !== null) {
              that.src(this.props.src)
              that.play();
            } 
          }, interval);
        }
      })
    }
  }

  componentWillUnmount = () => {
    if (this.player) {
      this.player.dispose();
    }
  }

  render = () => {
    const { src, poster } = this.props;
    const autoPlay = this.props.autoPlay ? true : false

    return(
      <div data-vjs-player="true">
        <video id="video-viewer" ref={(node) => this.videoNode = node } className="video-js vjs-default-skin vjs-big-play-centered" poster={poster} controls playsInline x-webkit-ariplay="allow" webkit-playsinline="allow" preload="metadata" autoPlay={autoPlay} width="100%" height="100%" muted data-setup='{"fluid": true}' {...this.props}>
          { src && src.indexOf('m3u8') > 0 ? 
            <source type="application/x-mpegurl" src={src} /> :
            <source type="video/mp4" src={src} />
          }
          <p className="vjs-no-js">no-js<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
        </video>
      </div>
    );
  }
}

export default connect(
	() => ({}),
	(dispatch) => ({
    videos: bindActionCreators(videoActions, dispatch),
  })
)(VideoPlayer)
