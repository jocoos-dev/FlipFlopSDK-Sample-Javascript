import React from 'react';
import Configs from '../Configs';

class VideoItem extends React.Component {
  default_avatar = 'https://s3.ap-northeast-2.amazonaws.com/mybeautip/avatar/img_profile_default.png'
  
  setVideo = () => {
    localStorage.setItem('demo.video', 
      JSON.stringify(this.props.video))
  }

  render() {
    const { video } = this.props
    // const thumbnailUrl = video.title.startsWith('Sample Live title...') ? Configs.DEFAULT_THUMBNAIL : video.thumbnail_url
    const thumbnailStyle = {
      background: `url(${Configs.DEFAULT_THUMBNAIL}) center center / contain no-repeat`,
      minHeight: '300px'
    }

    return (
      <div className="col-xl-4">
        <div className="card feed-post">
          <a className="thumbnail-box" href={this.props.link} target="_blank" rel="noopener noreferrer" onClick={this.setVideo}>
            { video.title && video.title.startsWith('Sample Live title...') ? 
            <div className="card-img-top" style={thumbnailStyle} /> : 
            <img className="card-img-top" src={video.thumbnail_url} alt={video.title + 'thumbnail'} /> }
            <div className="play-overlay">
              <i className="material-icons-round">play_arrow</i>
            </div>
            <div className="duration-overlay">{(video.duration / 1000).toFixed(0)}s</div>
            { video.state === 'LIVE' ? 
              <div className="live-overlay">LIVE</div> : '' }
          </a>
          <div className="card-body">
            <div className="card-text video-title">{`[${video.video_key}] ${video.title}`}</div>
            <div>
              {video.user_avatar_url !== '' ?
              <img className="user-avatar" src={video.user_avatar_url} alt={video.user_name === '' ? 'user avatar' : `${video.user_name} \\'s avatar'`}/> : 
              <img className="user-avatar" src={this.default_avatar} alt={video.user_name === '' ? 'user avatar' : `${video.user_name} \\'s avatar'`}/>
              }
              <span className="card-text text-muted user-name text-ellipsis" data-tooltip={video.user_id}>{video.user_name === '' ? '...' : video.user_name}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default VideoItem